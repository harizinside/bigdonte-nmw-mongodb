import { NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/mongodb";
import Article from "@/models/articles";
import { validateToken } from "@/lib/auth";
import path from "path";
import sharp from "sharp";
import mongoose from "mongoose";

export async function GET(req: Request) {
  const authError = validateToken(req);
  if (authError) return authError;

  await connectToDatabase();

  try {
    const { searchParams } = new URL(req.url);
    const pageParam = searchParams.get("page");
    const limit = 15;

    if (!pageParam || pageParam === "all") {
      // Jika `page` tidak ada atau bernilai "all", ambil semua data dokter
      const articles = await Article.find({}).sort({ createdAt: -1 });

      return new NextResponse(JSON.stringify({
        articles,
        totalArticles: articles.length,
      }), {
        status: 200,
        headers: { "Content-Type": "application/json" },
      });
    }

    // Jika `page` ada, jalankan pagination seperti biasa
    const page = parseInt(pageParam, 10);
    const totalArticles = await Article.countDocuments();
    const articles = await Article.find({})
      .skip((page - 1) * limit)
      .limit(limit)
      .sort({ createdAt: -1 });

    return new NextResponse(JSON.stringify({
      articles,
      currentPage: page,
      totalPages: Math.ceil(totalArticles / limit),
      totalArticles,
    }), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });

  } catch (error) {
    console.error("❌ Error fetching articles:", error);
    return new NextResponse(JSON.stringify({ message: "Gagal mengambil data articles." }), { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const authError = validateToken(request);
    if (authError) return authError;

    const formData = await request.formData();
    const title = formData.get("title") as string;
    const slug = formData.get("slug") as string;
    const imageSourceName = formData.get("imageSourceName") as string;
    const imageSourceLink = formData.get("imageSourceLink") as string;
    const date = formData.get("date") as string;
    const description = formData.get("description") as string;
    const author = formData.get("author") as string;
    const editor = formData.get("editor") as string;
    const sourceLink = formData.get("sourceLink") as string;
    const doctorId = formData.get("doctorId") as string;
    const serviceId = formData.get("serviceId") as string;
    const products = formData.getAll("products") as string[]; 
    const tags = formData.getAll("tags") as string[];
    const imageFile = formData.get("image") as File;
    const status = formData.get("status") === "1"; 
    
    if (
      !title ||
      !slug ||
      !date ||
      !description ||
      !imageFile
    ) {
      return NextResponse.json({ error: "All fields are required" }, { status: 400 });
    }

    // Validasi `ObjectId` untuk doctorId dan serviceId
    const idDoctorObjectId = mongoose.Types.ObjectId.isValid(doctorId) ? new mongoose.Types.ObjectId(doctorId) : null;
    const idServiceObjectId = mongoose.Types.ObjectId.isValid(serviceId) ? new mongoose.Types.ObjectId(serviceId) : null;
    const idProductsObjectId = products.map((productId) =>
      mongoose.Types.ObjectId.isValid(productId) ? new mongoose.Types.ObjectId(productId) : null
    ).filter(Boolean);

    // Proses upload gambar
    const timestamp = Date.now();
    const originalName = imageFile.name.replace(/\.(png|jpg|jpeg|svg|webp)$/i, ""); // Hapus ekstensi
    const imageFileName = `${timestamp}-${originalName}.webp`;

    const uploadsDir = path.join(process.cwd(), "public", "uploads", "articles");

    const imagePath = path.join(uploadsDir, imageFileName);

    // Konversi gambar ke WebP menggunakan Sharp
    const imageBuffer = Buffer.from(await imageFile.arrayBuffer());
    await sharp(imageBuffer).webp({ quality: 80 }).toFile(imagePath);    

    // Simpan ke MongoDB
    await connectToDatabase();
    const newArticle = new Article({
      title,
      slug,
      imageSourceName,
      imageSourceLink,
      date,
      description,
      author,
      editor,
      sourceLink,
      status,
      tags,
      products: idProductsObjectId,
      doctorId: idDoctorObjectId,
      serviceId: idServiceObjectId,
      image: `/uploads/articles/${imageFileName}`,
    });

    await newArticle.save();

    return NextResponse.json(newArticle, { status: 201 });
  } catch (error) {
    console.error("Error creating article:", error);
    return NextResponse.json({ error: "Failed to create article" }, { status: 500 });
  }
}