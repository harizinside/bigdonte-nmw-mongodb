import { connectToDatabase } from "@/lib/mongodb";
import Doctor from "@/models/doctors";
import { NextResponse } from "next/server";
import cloudinary from "@/lib/cloudinary"; 
import { validateToken } from "@/lib/auth";
import path from "path";
import fs from "fs/promises";
import sharp from "sharp";
import mongoose from "mongoose";

export const dynamic = "force-dynamic";

// GET: Get doctor by ID
export async function GET(req: any, { params }: any) {
  const authError = validateToken(req);
  if (authError) return authError;

  await connectToDatabase();
  const doctor = await Doctor.findById(params.id);
  if (!doctor) return NextResponse.json({ message: "Doctor not found" }, { status: 404 });
  return NextResponse.json(doctor, { status: 200 });
}

export async function PUT(req: any, { params }: { params: { id: string } }) {
  const authError = validateToken(req);
  if (authError) return authError;

  await connectToDatabase();

  const formData = await req.formData();
  const name = formData.get("name") as string;
  const position = formData.get("position") as string;
  const id_position = formData.get("id_position") as string;
  const imageFile = formData.get("image") as File;

  const existingDoctor = await Doctor.findById(params.id);
  if (!existingDoctor) {
    return NextResponse.json({ message: "Doctor not found" }, { status: 404 });
  }

  const idPositionObjectId = new mongoose.Types.ObjectId(id_position);

  let finalImageUrl = existingDoctor.image; // Gunakan gambar lama jika tidak ada perubahan

  if (imageFile) {
    try {
      // Hapus gambar lama jika ada
      if (existingDoctor.image) {
        const oldImagePath = path.join(process.cwd(), "public", existingDoctor.image);
        console.log("Menghapus gambar lama:", oldImagePath);
        await fs.access(oldImagePath); // Periksa apakah file ada
        await fs.unlink(oldImagePath); // Hapus file
      }

      // Simpan gambar baru
      const timestamp = Date.now();
      const originalName = imageFile.name.replace(/\.(png|jpg|jpeg|svg|webp)$/i, ""); // Hapus ekstensi
      const fileName = `${timestamp}-${originalName}.webp`; // Simpan sebagai WebP
      const newImagePath = path.join(process.cwd(), "public", "uploads", "doctors",fileName);

      // Konversi gambar ke WebP menggunakan Sharp
      const imageByteData = await imageFile.arrayBuffer();
      const buffer = Buffer.from(imageByteData);
      await sharp(buffer)
        .webp({ quality: 80 }) // Kompresi ke WebP dengan kualitas 80%
        .toFile(newImagePath);

      finalImageUrl = `/uploads/doctors/${fileName}`; // Path relatif untuk akses publik
      console.log("Gambar baru berhasil disimpan:", finalImageUrl);
    } catch (error) {
      console.error("Gagal menghapus atau mengunggah gambar baru:", error);
    }
  }

  // Perbarui data Achievement di database
  const updatedDoctor = await Doctor.findByIdAndUpdate(
    params.id,
    { name, position, id_position: idPositionObjectId, image: finalImageUrl },
    { new: true }
  );

  return NextResponse.json(updatedDoctor, { status: 200 });
}

export async function DELETE(req: Request, { params }: { params: { id: string } }) {
  const authError = validateToken(req);
  if (authError) return authError;

  await connectToDatabase();

  // Cari Doctor berdasarkan ID
  const doctor = await Doctor.findById(params.id);
  if (!doctor) {
    console.log("doctor tidak ditemukan di database.");
    return NextResponse.json({ message: "doctor not found" }, { status: 404 });
  }

  // Jika ada gambar, hapus dari folder uploads
  if (doctor.image) {
    try {
      const imagePath = path.join(process.cwd(), "public", doctor.image); // Path lengkap ke file gambar
      console.log("Menghapus gambar dari folder uploads:", imagePath);

      // Periksa apakah file ada sebelum menghapus
      await fs.access(imagePath);
      await fs.unlink(imagePath); // Hapus file
    } catch (error) {
      console.error("Gagal menghapus gambar dari folder uploads:", error);
    }
  }

  // Hapus doctor dari database
  await Doctor.findByIdAndDelete(params.id);

  console.log("Doctor berhasil dihapus.");
  return NextResponse.json({ message: "Doctor deleted successfully" }, { status: 200 });
}