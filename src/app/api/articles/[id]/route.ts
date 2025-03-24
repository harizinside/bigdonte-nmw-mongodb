import { connectToDatabase } from "@/lib/mongodb";
import Article from "@/models/articles";
import { NextResponse } from "next/server";
import cloudinary from "@/lib/cloudinary"; 
import { validateToken } from "@/lib/auth";
import path from "path";
import fs from "fs/promises";
import sharp from "sharp";

export const config = {
  api: {
    bodyParser: false,
  },
};

// GET: Get achievement by ID
export async function GET(req: any, { params }: any) {
  const authError = validateToken(req);
    if (authError) return authError;
  await connectToDatabase();
  const achievement = await Article.findById(params.id);
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

  const existingArticle = await Article.findById(params.id);
  if (!existingArticle) {
    return NextResponse.json({ message: "Article not found" }, { status: 404 });
  }

  let finalImageUrl = existingArticle.image; // Gunakan gambar lama jika tidak ada perubahan

  if (imageFile) {
    try {
      // Hapus gambar lama jika ada
      if (existingArticle.image) {
        const oldImagePath = path.join(process.cwd(), "public", existingArticle.image);
        console.log("Menghapus gambar lama:", oldImagePath);
        await fs.access(oldImagePath); // Periksa apakah file ada
        await fs.unlink(oldImagePath); // Hapus file
      }

      // Simpan gambar baru
      const timestamp = Date.now();
      const originalName = imageFile.name.replace(/\.(png|jpg|jpeg|svg|webp)$/i, ""); // Hapus ekstensi
      const fileName = `${timestamp}-${originalName}.webp`; // Simpan sebagai WebP
      const newImagePath = path.join(process.cwd(), "public", "uploads", "articles",fileName);

      // Konversi gambar ke WebP menggunakan Sharp
      const imageByteData = await imageFile.arrayBuffer();
      const buffer = Buffer.from(imageByteData);
      await sharp(buffer)
        .webp({ quality: 80 }) // Kompresi ke WebP dengan kualitas 80%
        .toFile(newImagePath);

      finalImageUrl = `/uploads/articles/${fileName}`; // Path relatif untuk akses publik
      console.log("Gambar baru berhasil disimpan:", finalImageUrl);
    } catch (error) {
      console.error("Gagal menghapus atau mengunggah gambar baru:", error);
    }
  }

  // Perbarui data Achievement di database
  const updatedAchievement = await Article.findByIdAndUpdate(
    params.id,
    { title, description, date, status, image: finalImageUrl, slug, imageSourceName, imageSourceLink, author, editor, sourceLink, serviceId, doctorId, products, tags },
    { new: true }
  );

  return NextResponse.json(updatedAchievement, { status: 200 });
}

// DELETE: Delete Achievement
export async function DELETE(req: Request, { params }: { params: { id: string } }) {
  const authError = validateToken(req);
  if (authError) return authError;

  await connectToDatabase();

  // Cari Achievement berdasarkan ID
  const article = await Article.findById(params.id);
  if (!article) {
    console.log("article tidak ditemukan di database.");
    return NextResponse.json({ message: "article not found" }, { status: 404 });
  }

  // Jika ada gambar, hapus dari folder uploads
  if (article.image) {
    try {
      const imagePath = path.join(process.cwd(), "public", article.image); // Path lengkap ke file gambar
      console.log("Menghapus gambar dari folder uploads:", imagePath);

      // Periksa apakah file ada sebelum menghapus
      await fs.access(imagePath);
      await fs.unlink(imagePath); // Hapus file
    } catch (error) {
      console.error("Gagal menghapus gambar dari folder uploads:", error);
    }
  }

  // Hapus article dari database
  await Article.findByIdAndDelete(params.id);

  console.log("Article berhasil dihapus.");
  return NextResponse.json({ message: "Article deleted successfully" }, { status: 200 });
}