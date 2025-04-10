import { connectToDatabase } from "@/lib/mongodb";
import Product from "@/models/products";
import { NextResponse } from "next/server";
import cloudinary from "@/lib/cloudinary";
import { validateToken } from "@/lib/auth";
import path from "path";
import sharp from "sharp";
import mongoose from "mongoose";

// GET: Fetch all products
export async function GET(req: Request) {
  const authError = validateToken(req);
  if (authError) return authError;

  await connectToDatabase();

  try {
    const { searchParams } = new URL(req.url);
    const pageParam = searchParams.get("page");
    const ids = searchParams.get("id")?.split(",") || [];

    // Jika ada `id`, ambil berdasarkan ID
    if (ids.length > 0) {
      const products = await Product.find({ _id: { $in: ids } });

      return new NextResponse(JSON.stringify({ products }), {
        status: 200,
        headers: { "Content-Type": "application/json" },
      });
    }

    const limit = 15;

    // Jika `page` tidak ada atau bernilai "all", ambil semua data produk
    if (!pageParam || pageParam === "all") {
      const allProducts = await Product.find({}).sort({ createdAt: -1 });

      return new NextResponse(JSON.stringify({
        products: allProducts,
        totalProducts: allProducts.length,
      }), {
        status: 200,
        headers: { "Content-Type": "application/json" },
      });
    }

    // Jika `page` ada, jalankan pagination
    const page = parseInt(pageParam, 10);
    const totalProducts = await Product.countDocuments();
    const paginatedProducts = await Product.find({})
      .skip((page - 1) * limit)
      .limit(limit)
      .sort({ createdAt: -1 });

    return new NextResponse(JSON.stringify({
      products: paginatedProducts,
      currentPage: page,
      totalPages: Math.ceil(totalProducts / limit),
      totalProducts,
    }), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });

  } catch (error) {
    console.error("❌ Error fetching products:", error);
    return new NextResponse(JSON.stringify({ message: "Gagal mengambil data products." }), { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const authError = validateToken(request);
    if (authError) return authError;

    const formData = await request.formData();
    const imageFile = formData.get("image") as File;
    const name = formData.get("name") as string;
    const link = formData.get("link") as string;
    const description = formData.get("description") as string;

    if (!name || !link || !description) {
      return NextResponse.json({ error: "All fields are required" }, { status: 400 });
    }

    const timestamp = Date.now();
    const originalName = imageFile.name.replace(/\.(png|jpg|jpeg|svg|webp)$/i, ""); // Hapus ekstensi
    const fileName = `${timestamp}-${originalName}.webp`;
    const imagePath = path.join(process.cwd(), "public", "uploads", "products",fileName);

    // Konversi gambar ke WebP menggunakan Sharp
    const imageByteData = await imageFile.arrayBuffer();
    const buffer = Buffer.from(imageByteData);
    await sharp(buffer)
      .webp({ quality: 80 }) // Kompresi ke WebP dengan kualitas 80%
      .toFile(imagePath);

    // Simpan ke MongoDB
    await connectToDatabase();
    const newProduct = new Product({
      name,
      link,
      description,
      image: `/uploads/products/${fileName}`, // Path relatif untuk akses publik
    });

    await newProduct.save();

    return NextResponse.json(newProduct, { status: 201 });
  } catch (error) {
    console.error("Error creating product:", error);
    return NextResponse.json({ error: "Failed to create product" }, { status: 500 });
  }
}