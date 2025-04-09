import { connectToDatabase } from "@/lib/mongodb";
import Branchs from "@/models/branchs";
import { NextResponse } from "next/server";
import cloudinary from "@/lib/cloudinary"; 
import { validateToken } from "@/lib/auth";
import path from "path";
import sharp from "sharp";
import fs from "fs/promises";

export const dynamic = "force-dynamic";

// GET: Get branches by ID
export async function GET(req: any, { params }: any) {
  const authError = validateToken(req);
  if (authError) return authError;
  await connectToDatabase();
  const branches = await Branchs.findById(params.id);
  if (!branches) return NextResponse.json({ message: "Branches not found" }, { status: 404 });
  return NextResponse.json(branches, { status: 200 });
}

export async function PUT(req: any, { params }: { params: { id: string } }) {
  const authError = validateToken(req);
  if (authError) return authError;

  await connectToDatabase();

  const formData = await req.formData();
  const name = formData.get("name") as string;
  const address = formData.get("address") as string;
  const phone = formData.get("phone") as string;
  const location = formData.get("location") as string;
  const operasional = formData.getAll("operasional") as string[];
  const imageFile = formData.get("image") as File;

  const existingBranch = await Branchs.findById(params.id);
  if (!existingBranch) {
    return NextResponse.json({ message: "Achievement not found" }, { status: 404 });
  }

  let finalImageUrl = existingBranch.image; // Gunakan gambar lama jika tidak ada perubahan

  if (imageFile) {
    try {
      // Hapus gambar lama jika ada
      if (existingBranch.image) {
        const oldImagePath = path.join(process.cwd(), "public", existingBranch.image);
        console.log("Menghapus gambar lama:", oldImagePath);
        await fs.access(oldImagePath); // Periksa apakah file ada
        await fs.unlink(oldImagePath); // Hapus file
      }

      // Simpan gambar baru
      const timestamp = Date.now();
      const originalName = imageFile.name.replace(/\.(png|jpg|jpeg|svg|webp)$/i, ""); // Hapus ekstensi
      const fileName = `${timestamp}-${originalName}.webp`; // Simpan sebagai WebP
      const newImagePath = path.join(process.cwd(), "public", "uploads", "branches",fileName);

      // Konversi gambar ke WebP menggunakan Sharp
      const imageByteData = await imageFile.arrayBuffer();
      const buffer = Buffer.from(imageByteData);
      await sharp(buffer)
        .webp({ quality: 80 }) // Kompresi ke WebP dengan kualitas 80%
        .toFile(newImagePath);

      finalImageUrl = `/uploads/branches/${fileName}`; // Path relatif untuk akses publik
      console.log("Gambar baru berhasil disimpan:", finalImageUrl);
    } catch (error) {
      console.error("Gagal menghapus atau mengunggah gambar baru:", error);
    }
  }

  // Perbarui data Achievement di database
  const updatedAchievement = await Branchs.findByIdAndUpdate(
    params.id,
    { name, address, phone, location, operasional, image: finalImageUrl },
    { new: true }
  );

  return NextResponse.json(updatedAchievement, { status: 200 });
}

export async function DELETE(req: Request, { params }: { params: { id: string } }) {
  const authError = validateToken(req);
  if (authError) return authError;

  await connectToDatabase();

  console.log("Menghapus branch dengan ID:", params.id);

  // Cari Achievement berdasarkan ID
  const branch = await Branchs.findById(params.id);
  if (!branch) {
    console.log("Branch tidak ditemukan di database.");
    return NextResponse.json({ message: "Branch not found" }, { status: 404 });
  }

  // Jika ada gambar, hapus dari folder uploads
  if (branch.image) {
    try {
      const imagePath = path.join(process.cwd(), "public", branch.image); // Path lengkap ke file gambar
      console.log("Menghapus gambar dari folder uploads:", imagePath);

      // Periksa apakah file ada sebelum menghapus
      await fs.access(imagePath);
      await fs.unlink(imagePath); // Hapus file
    } catch (error) {
      console.error("Gagal menghapus gambar dari folder uploads:", error);
    }
  }

  // Hapus Branch dari database
  await Branchs.findByIdAndDelete(params.id);

  console.log("Branch berhasil dihapus.");
  return NextResponse.json({ message: "Branch deleted successfully" }, { status: 200 });
}