import { connectToDatabase } from "@/lib/mongodb";
import Media from "@/models/media";
import { NextResponse } from "next/server";
import { validateToken } from "@/lib/auth";
import path from "path";
import fs from "fs/promises";
import sharp from "sharp";

export const dynamic = "force-dynamic";

// GET: Get media by ID
export async function GET(req: any, { params }: any) {
  const authError = validateToken(req);
    if (authError) return authError;
  await connectToDatabase();
  const media = await Media.findById(params.id);
  if (!media) return NextResponse.json({ message: "media not found" }, { status: 404 });
  return NextResponse.json(media, { status: 200 });
}

// PUT: Update media
export async function PUT(req: any, { params }: { params: { id: string } }) {
  const authError = validateToken(req);
  if (authError) return authError;

  await connectToDatabase();

  const formData = await req.formData();
  const imageFile = formData.get("image") as File;

  const existingMedia = await Media.findById(params.id);
  if (!existingMedia) {
    return NextResponse.json({ message: "Media not found" }, { status: 404 });
  }

  let finalImageUrl = existingMedia.image; // Gunakan gambar lama jika tidak ada perubahan

  if (imageFile) {
    try {
      // Hapus gambar lama jika ada
      if (existingMedia.image) {
        const oldImagePath = path.join(process.cwd(), "public", existingMedia.image);
        await fs.access(oldImagePath); // Periksa apakah file ada
        await fs.unlink(oldImagePath); // Hapus file
      }

      // Simpan gambar baru
      const timestamp = Date.now();
      const originalName = imageFile.name.replace(/\.(png|jpg|jpeg|svg|webp)$/i, ""); // Hapus ekstensi
      const fileName = `${timestamp}-${originalName}.webp`; // Simpan sebagai WebP
      const newImagePath = path.join(process.cwd(), "public", "uploads", "media",fileName);

      // Konversi gambar ke WebP menggunakan Sharp
      const imageByteData = await imageFile.arrayBuffer();
      const buffer = Buffer.from(imageByteData);
      await sharp(buffer)
        .webp({ quality: 80 }) // Kompresi ke WebP dengan kualitas 80%
        .toFile(newImagePath);

      finalImageUrl = `/uploads/media/${fileName}`; // Path relatif untuk akses publik
      console.log("Gambar baru berhasil disimpan:", finalImageUrl);
    } catch (error) {
      console.error("Gagal menghapus atau mengunggah gambar baru:", error);
    }
  }

  // Perbarui data Media di database
  const updatedMedia = await Media.findByIdAndUpdate(
    params.id,
    { image: finalImageUrl },
    { new: true }
  );

  return NextResponse.json(updatedMedia, { status: 200 });
}

// DELETE: Delete Media
export async function DELETE(req: Request, { params }: { params: { id: string } }) {
  const authError = validateToken(req);
  if (authError) return authError;

  await connectToDatabase();

  // Cari Media berdasarkan ID
  const media = await Media.findById(params.id);
  if (!media) {
    console.log("Media tidak ditemukan di database.");
    return NextResponse.json({ message: "Media not found" }, { status: 404 });
  }

  // Jika ada gambar, hapus dari folder uploads
  if (media.image) {
    try {
      const imagePath = path.join(process.cwd(), "public", media.image);

      // Periksa apakah file ada sebelum menghapus
      await fs.access(imagePath);
      await fs.unlink(imagePath); // Hapus file
    } catch (error) {
      console.error("Gagal menghapus gambar dari folder uploads:", error);
    }
  }

  // Hapus Media dari database
  await Media.findByIdAndDelete(params.id);
  return NextResponse.json({ message: "Media deleted successfully" }, { status: 200 });
}