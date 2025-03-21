import { connectToDatabase } from "@/lib/mongodb";
import Promo from "@/models/promo";
import { NextResponse } from "next/server";
import cloudinary from "@/lib/cloudinary"; 
import { validateToken } from "@/lib/auth";
import path from "path";
import fs from "fs/promises";
import sharp from "sharp";
import mongoose from "mongoose";

// GET: Get promo by ID
export async function GET(req: any, { params }: any) {
  const authError = validateToken(req);
  if (authError) return authError;

  await connectToDatabase();
  const promo = await Promo.findById(params.id);
  if (!promo) return NextResponse.json({ message: "promo not found" }, { status: 404 });
  return NextResponse.json(promo, { status: 200 });
}

export async function PUT(req: any, { params }: { params: { id: string } }) {
  const authError = validateToken(req);
  if (authError) return authError;

  await connectToDatabase();

  const formData = await req.formData();
  const title = formData.get("title") as string; 
  const sk = formData.get("sk") as string; 
  const start_date = formData.get("start_date") as string;
  const end_date = formData.get("end_date") as string;
  const link = formData.get("link") as string;
  const slug = formData.get("slug") as string;
  const imageFile = formData.get("image") as File;

  const existingPromo = await Promo.findById(params.id);
  if (!existingPromo) {
    return NextResponse.json({ message: "Promo not found" }, { status: 404 });
  }

  let finalImageUrl = existingPromo.image; // Gunakan gambar lama jika tidak ada perubahan

  if (imageFile) {
    try {
      // Hapus gambar lama jika ada
      if (existingPromo.image) {
        const oldImagePath = path.join(process.cwd(), "public", existingPromo.image);
        console.log("Menghapus gambar lama:", oldImagePath);
        await fs.access(oldImagePath); // Periksa apakah file ada
        await fs.unlink(oldImagePath); // Hapus file
      }

      // Simpan gambar baru
      const timestamp = Date.now();
      const originalName = imageFile.name.replace(/\.(png|jpg|jpeg|svg|webp)$/i, ""); // Hapus ekstensi
      const fileName = `${timestamp}-${originalName}.webp`; // Simpan sebagai WebP
      const newImagePath = path.join(process.cwd(), "public", "uploads", "promo",fileName);

      // Konversi gambar ke WebP menggunakan Sharp
      const imageByteData = await imageFile.arrayBuffer();
      const buffer = Buffer.from(imageByteData);
      await sharp(buffer)
        .webp({ quality: 80 }) // Kompresi ke WebP dengan kualitas 80%
        .toFile(newImagePath);

      finalImageUrl = `/uploads/promo/${fileName}`; // Path relatif untuk akses publik
      console.log("Gambar baru berhasil disimpan:", finalImageUrl);
    } catch (error) {
      console.error("Gagal menghapus atau mengunggah gambar baru:", error);
    }
  }

  // Perbarui data Achievement di database
  const updatedPromo = await Promo.findByIdAndUpdate(
    params.id,
    { title, sk, start_date, end_date, link, slug, image: finalImageUrl },
    { new: true }
  );

  return NextResponse.json(updatedPromo, { status: 200 });
}

export async function DELETE(req: Request, { params }: { params: { id: string } }) {
  const authError = validateToken(req);
  if (authError) return authError;

  await connectToDatabase(); 

  // Cari Promo berdasarkan ID
  const promo = await Promo.findById(params.id);
  if (!promo) {
    console.log("Promo tidak ditemukan di database.");
    return NextResponse.json({ message: "Promo not found" }, { status: 404 });
  }

  // Jika ada gambar, hapus dari folder uploads
  if (promo.image) {
    try {
      const imagePath = path.join(process.cwd(), "public", promo.image); // Path lengkap ke file gambar
      console.log("Menghapus gambar dari folder uploads:", imagePath);

      // Periksa apakah file ada sebelum menghapus
      await fs.access(imagePath);
      await fs.unlink(imagePath); // Hapus file
    } catch (error) {
      console.error("Gagal menghapus gambar dari folder uploads:", error);
    }
  }

  // Hapus promo dari database
  await Promo.findByIdAndDelete(params.id);

  console.log("Promo berhasil dihapus.");
  return NextResponse.json({ message: "Promo deleted successfully" }, { status: 200 });
}