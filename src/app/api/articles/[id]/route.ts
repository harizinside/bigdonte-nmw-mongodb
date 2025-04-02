import { connectToDatabase } from "@/lib/mongodb";
import Article from "@/models/articles";
import { NextResponse } from "next/server";
import cloudinary from "@/lib/cloudinary"; 
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

  try {
    const { id } = params;

    let article;
    if (id.match(/^[0-9a-fA-F]{24}$/)) {
        // Jika ID berbentuk ObjectId, cari berdasarkan _id
        article = await Article.findById(id);
    } else {
        // Jika ID bukan ObjectId, cari berdasarkan slug
        article = await Article.findOne({ slug: id });
    }

    if (!article) {
      return NextResponse.json({ message: "Article not found" }, { status: 404 });
    }

    return NextResponse.json(article, { status: 200 });

  } catch (error) {
    console.error("❌ Error fetching article:", error);
    return NextResponse.json({ message: "Internal Server Error" }, { status: 500 });
  }
}

// PUT: Update achievement
export async function PUT(req: any, { params }: { params: { id: string } }) {
  const authError = validateToken(req);
  if (authError) return authError;

  await connectToDatabase();

  const url = new URL(req.url); // Dapatkan URL dari request
  const isStatusUpdate = url.searchParams.has("status"); // Cek apakah query `?status` ada

  const formData = await req.formData();

  if (isStatusUpdate) {
    // Jika hanya status yang diupdate
    const status = formData.get("status") === "1";

    const updatedArticle = await Article.findByIdAndUpdate(
      params.id,
      { status },
      { new: true }
    );

    return NextResponse.json(updatedArticle, { status: 200 });
  }

  // Jika bukan hanya status, lakukan update keseluruhan artikel
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
        await fs.access(oldImagePath);
        await fs.unlink(oldImagePath);
      }

      // Simpan gambar baru
      const timestamp = Date.now();
      const originalName = imageFile.name.replace(/\.(png|jpg|jpeg|svg|webp)$/i, "");
      const fileName = `${timestamp}-${originalName}.webp`;
      const newImagePath = path.join(process.cwd(), "public", "uploads", "articles", fileName);

      // Konversi ke WebP
      const imageByteData = await imageFile.arrayBuffer();
      const buffer = Buffer.from(imageByteData);
      await sharp(buffer).webp({ quality: 80 }).toFile(newImagePath);

      finalImageUrl = `/uploads/articles/${fileName}`;
    } catch (error) {
      console.error("Gagal menghapus atau mengunggah gambar baru:", error);
    }
  }

  // Perbarui artikel di database
  const updatedArticle = await Article.findByIdAndUpdate(
    params.id,
    {
      title,
      description,
      date,
      image: finalImageUrl,
      slug,
      imageSourceName,
      imageSourceLink,
      author,
      editor,
      sourceLink,
      serviceId,
      doctorId,
      products,
      tags,
    },
    { new: true }
  );

  return NextResponse.json(updatedArticle, { status: 200 });
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