import { connectToDatabase } from "@/lib/mongodb";
import Product from "@/models/products";
import { NextResponse } from "next/server";
import cloudinary from "@/lib/cloudinary"; 
import { validateToken } from "@/lib/auth";
import path from "path";
import fs from "fs/promises";
import sharp from "sharp";
import mongoose from "mongoose";

export const dynamic = "force-dynamic";

// GET: Get product by ID
export async function GET(req: any, { params }: any) {
  const authError = validateToken(req);
  if (authError) return authError;

  await connectToDatabase();
  const product = await Product.findById(params.id);
  if (!product) return NextResponse.json({ message: "Product not found" }, { status: 404 });
  return NextResponse.json(product, { status: 200 });
}

export async function PUT(req: any, { params }: { params: { id: string } }) {
  const authError = validateToken(req);
  if (authError) return authError;

  await connectToDatabase();

  const formData = await req.formData();
  const name = formData.get("name") as string;
  const link = formData.get("link") as string;
  const description = formData.get("description") as string;
  const imageFile = formData.get("image") as File;

  const existingProduct = await Product.findById(params.id);
  if (!existingProduct) {
    return NextResponse.json({ message: "Product not found" }, { status: 404 });
  }

  let finalImageUrl = existingProduct.image; // Gunakan gambar lama jika tidak ada perubahan

  if (imageFile) {
    try {
      // Hapus gambar lama jika ada
      if (existingProduct.image) {
        const oldImagePath = path.join(process.cwd(), "public", existingProduct.image);
        console.log("Menghapus gambar lama:", oldImagePath);
        await fs.access(oldImagePath); // Periksa apakah file ada
        await fs.unlink(oldImagePath); // Hapus file
      }

      // Simpan gambar baru
      const timestamp = Date.now();
      const originalName = imageFile.name.replace(/\.(png|jpg|jpeg|svg|webp)$/i, ""); // Hapus ekstensi
      const fileName = `${timestamp}-${originalName}.webp`; // Simpan sebagai WebP
      const newImagePath = path.join(process.cwd(), "public", "uploads", "products",fileName);

      // Konversi gambar ke WebP menggunakan Sharp
      const imageByteData = await imageFile.arrayBuffer();
      const buffer = Buffer.from(imageByteData);
      await sharp(buffer)
        .webp({ quality: 80 }) // Kompresi ke WebP dengan kualitas 80%
        .toFile(newImagePath);

      finalImageUrl = `/uploads/products/${fileName}`; // Path relatif untuk akses publik
      console.log("Gambar baru berhasil disimpan:", finalImageUrl);
    } catch (error) {
      console.error("Gagal menghapus atau mengunggah gambar baru:", error);
    }
  }

  // Perbarui data Achievement di database
  const updatedProducts = await Product.findByIdAndUpdate(
    params.id,
    { name, link, description, image: finalImageUrl },
    { new: true }
  );

  return NextResponse.json(updatedProducts, { status: 200 });
}

export async function DELETE(req: Request, { params }: { params: { id: string } }) {
  const authError = validateToken(req);
  if (authError) return authError;

  await connectToDatabase();

  // Cari product berdasarkan ID
  const product = await Product.findById(params.id);
  if (!product) {
    console.log("Product tidak ditemukan di database.");
    return NextResponse.json({ message: "Product not found" }, { status: 404 });
  }

  // Jika ada gambar, hapus dari folder uploads
  if (product.image) {
    try {
      const imagePath = path.join(process.cwd(), "public", product.image); // Path lengkap ke file gambar
      console.log("Menghapus gambar dari folder uploads:", imagePath);

      // Periksa apakah file ada sebelum menghapus
      await fs.access(imagePath);
      await fs.unlink(imagePath); // Hapus file
    } catch (error) {
      console.error("Gagal menghapus gambar dari folder uploads:", error);
    }
  }

  // Hapus product dari database
  await Product.findByIdAndDelete(params.id);

  console.log("Product berhasil dihapus.");
  return NextResponse.json({ message: "Product deleted successfully" }, { status: 200 });
}