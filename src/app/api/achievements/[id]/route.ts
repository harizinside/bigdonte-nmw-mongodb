import { connectToDatabase } from "@/lib/mongodb";
import Achievement from "@/models/achievements";
import { NextResponse } from "next/server";
import { validateToken } from "@/lib/auth";
import path from "path";
import fs from "fs/promises";
import sharp from "sharp";

export const dynamic = "force-dynamic";

// GET: Get achievement by ID
export async function GET(req: any, { params }: any) {
  const authError = validateToken(req);
    if (authError) return authError;
  await connectToDatabase();
  const achievement = await Achievement.findById(params.id);
  if (!achievement) return NextResponse.json({ message: "achievement not found" }, { status: 404 });
  return NextResponse.json(achievement, { status: 200 });
}

// PUT: Update achievement
export async function PUT(req: any, { params }: { params: { id: string } }) {
  const authError = validateToken(req);
  if (authError) return authError;

  await connectToDatabase();

  const formData = await req.formData();
  const title = formData.get("title") as string;
  const description = formData.get("description") as string;
  const date = formData.get("date") as string;
  const imageFile = formData.get("image") as File;

  const existingAchievement = await Achievement.findById(params.id);
  if (!existingAchievement) {
    return NextResponse.json({ message: "Achievement not found" }, { status: 404 });
  }

  let finalImageUrl = existingAchievement.image; // Gunakan gambar lama jika tidak ada perubahan

  if (imageFile) {
    try {
      // Hapus gambar lama jika ada
      if (existingAchievement.image) {
        const oldImagePath = path.join(process.cwd(), "public", existingAchievement.image);
        console.log("Menghapus gambar lama:", oldImagePath);
        await fs.access(oldImagePath); // Periksa apakah file ada
        await fs.unlink(oldImagePath); // Hapus file
      }

      // Simpan gambar baru
      const timestamp = Date.now();
      const originalName = imageFile.name.replace(/\.(png|jpg|jpeg|svg|webp)$/i, ""); // Hapus ekstensi
      const fileName = `${timestamp}-${originalName}.webp`; // Simpan sebagai WebP
      const newImagePath = path.join(process.cwd(), "public", "uploads", "achievements",fileName);

      // Konversi gambar ke WebP menggunakan Sharp
      const imageByteData = await imageFile.arrayBuffer();
      const buffer = Buffer.from(imageByteData);
      await sharp(buffer)
        .webp({ quality: 80 }) // Kompresi ke WebP dengan kualitas 80%
        .toFile(newImagePath);

      finalImageUrl = `/uploads/achievements/${fileName}`; // Path relatif untuk akses publik
      console.log("Gambar baru berhasil disimpan:", finalImageUrl);
    } catch (error) {
      console.error("Gagal menghapus atau mengunggah gambar baru:", error);
    }
  }

  // Perbarui data Achievement di database
  const updatedAchievement = await Achievement.findByIdAndUpdate(
    params.id,
    { title, description, date, image: finalImageUrl },
    { new: true }
  );

  return NextResponse.json(updatedAchievement, { status: 200 });
}

// DELETE: Delete Achievement
export async function DELETE(req: Request, { params }: { params: { id: string } }) {
  const authError = validateToken(req);
  if (authError) return authError;

  await connectToDatabase();

  console.log("Menghapus achievement dengan ID:", params.id);

  // Cari Achievement berdasarkan ID
  const achievement = await Achievement.findById(params.id);
  if (!achievement) {
    console.log("Achievement tidak ditemukan di database.");
    return NextResponse.json({ message: "Achievement not found" }, { status: 404 });
  }

  // Jika ada gambar, hapus dari folder uploads
  if (achievement.image) {
    try {
      const imagePath = path.join(process.cwd(), "public", achievement.image); // Path lengkap ke file gambar
      console.log("Menghapus gambar dari folder uploads:", imagePath);

      // Periksa apakah file ada sebelum menghapus
      await fs.access(imagePath);
      await fs.unlink(imagePath); // Hapus file
    } catch (error) {
      console.error("Gagal menghapus gambar dari folder uploads:", error);
    }
  }

  // Hapus Achievement dari database
  await Achievement.findByIdAndDelete(params.id);

  console.log("Achievement berhasil dihapus.");
  return NextResponse.json({ message: "Achievement deleted successfully" }, { status: 200 });
}