import { connectToDatabase } from "@/lib/mongodb";
import Popup from "@/models/popups";
import { NextResponse } from "next/server";
import { validateToken } from "@/lib/auth";
import path from "path";
import fs from "fs/promises";
import sharp from "sharp";

export const dynamic = "force-dynamic";

// GET: Get popup by ID
export async function GET(req: any, { params }: any) {
  const authError = validateToken(req);
  if (authError) return authError;

  await connectToDatabase();
  const popup = await Popup.findById(params.id);
  if (!popup) return NextResponse.json({ message: "Popup not found" }, { status: 404 });
  return NextResponse.json(popup, { status: 200 });
}

export async function PUT(req: any, { params }: { params: { id: string } }) {
  const authError = validateToken(req);
  if (authError) return authError;

  await connectToDatabase();

  const formData = await req.formData();
  const link = formData.get("link") as string;
  const status = formData.get("status") === "1";
  const imageFile = formData.get("image") as File;

  const existingPopup = await Popup.findById(params.id);
  if (!existingPopup) {
    return NextResponse.json({ message: "Popup not found" }, { status: 404 });
  }

  let finalImageUrl = existingPopup.image; // Gunakan gambar lama jika tidak ada perubahan

  if (imageFile) {
    try {
      // Hapus gambar lama jika ada
      if (existingPopup.image) {
        const oldImagePath = path.join(process.cwd(), "public", existingPopup.image);
        console.log("Menghapus gambar lama:", oldImagePath);
        await fs.access(oldImagePath); // Periksa apakah file ada
        await fs.unlink(oldImagePath); // Hapus file
      }

      // Simpan gambar baru
      const timestamp = Date.now();
      const originalName = imageFile.name.replace(/\.(png|jpg|jpeg|svg|webp)$/i, ""); // Hapus ekstensi
      const fileName = `${timestamp}-${originalName}.webp`; // Simpan sebagai WebP
      const newImagePath = path.join(process.cwd(), "public", "uploads", "popups",fileName);

      // Konversi gambar ke WebP menggunakan Sharp
      const imageByteData = await imageFile.arrayBuffer();
      const buffer = Buffer.from(imageByteData);
      await sharp(buffer)
        .webp({ quality: 80 }) // Kompresi ke WebP dengan kualitas 80%
        .toFile(newImagePath);

      finalImageUrl = `/uploads/popups/${fileName}`; // Path relatif untuk akses publik
      console.log("Gambar baru berhasil disimpan:", finalImageUrl);
    } catch (error) {
      console.error("Gagal menghapus atau mengunggah gambar baru:", error);
    }
  }

  // Perbarui data Achievement di database
  const updatedPopup = await Popup.findByIdAndUpdate(
    params.id,
    { link, status, image: finalImageUrl },
    { new: true }
  );

  return NextResponse.json(updatedPopup, { status: 200 });
}

export async function DELETE(req: Request, { params }: { params: { id: string } }) {
  const authError = validateToken(req);
  if (authError) return authError;

  await connectToDatabase();

  // Cari Popup berdasarkan ID
  const popup = await Popup.findById(params.id);
  if (!popup) {
    console.log("Popup tidak ditemukan di database.");
    return NextResponse.json({ message: "Popup not found" }, { status: 404 });
  }

  // Jika ada gambar, hapus dari folder uploads
  if (popup.image) {
    try {
      const imagePath = path.join(process.cwd(), "public", popup.image); // Path lengkap ke file gambar
      console.log("Menghapus gambar dari folder uploads:", imagePath);

      // Periksa apakah file ada sebelum menghapus
      await fs.access(imagePath);
      await fs.unlink(imagePath); // Hapus file
    } catch (error) {
      console.error("Gagal menghapus gambar dari folder uploads:", error);
    }
  }

  // Hapus popup dari database
  await Popup.findByIdAndDelete(params.id);

  console.log("Popup berhasil dihapus.");
  return NextResponse.json({ message: "Popup deleted successfully" }, { status: 200 });
}