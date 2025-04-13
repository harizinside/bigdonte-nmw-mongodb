import { connectToDatabase } from "@/lib/mongodb";
import ArticlesPage from "@/models/articlesPage";
import { NextResponse } from "next/server";
import { validateToken } from "@/lib/auth";
import path from "path";
import sharp from "sharp";
import fs from "fs/promises";

// GET: Fetch all doctors
export async function GET(req: any, { params }: any) { 
  const authError = validateToken(req);
  if (authError) return authError;

  await connectToDatabase();

  const articlesPageId = "67fb14450fb5a9cb8ddf67c4";

  const articlesPage = await ArticlesPage.findById(articlesPageId);
  if (!articlesPage) return NextResponse.json({ message: "Articles Page not found" }, { status: 404 });
  return NextResponse.json(articlesPage, { status: 200 });
}

export async function PUT(req: any, { params }: { params: { id: string } }) {
  const authError = validateToken(req);
  if (authError) return authError;

  const articlesPageId = "67fb14450fb5a9cb8ddf67c4";

  await connectToDatabase();

  const formData = await req.formData();
    const title = formData.get("title") as string;
    const headline = formData.get("headline") as string;
    const description = formData.get("description") as string;
    const keywords = formData.getAll("keywords") as string[];
    const imageFileBanner = formData.get("image") as File;

  const existingArticlesPage = await ArticlesPage.findById(articlesPageId);
  if (!existingArticlesPage) {
    return NextResponse.json({ message: "Articles Page not found" }, { status: 404 });
  }

  let finalImageUrl = existingArticlesPage.image; 

  if (imageFileBanner) {
    try {
      // Hapus gambar lama jika ada
      if (existingArticlesPage.image) {
        const oldImagePath = path.join(process.cwd(), "public", existingArticlesPage.image);
        console.log("Menghapus gambar lama:", oldImagePath);
        await fs.access(oldImagePath); // Periksa apakah file ada
        await fs.unlink(oldImagePath); // Hapus file
      }

      // Simpan gambar baru
      const timestamp = Date.now();
      const originalName = imageFileBanner.name.replace(/\.(png|jpg|jpeg|svg|webp)$/i, ""); // Hapus ekstensi
      const fileName = `${timestamp}-${originalName}.webp`; // Simpan sebagai WebP
      const newImagePath = path.join(process.cwd(), "public", "uploads", "articlesPage",fileName);

      // Konversi gambar ke WebP menggunakan Sharp
      const imageByteData = await imageFileBanner.arrayBuffer();
      const buffer = Buffer.from(imageByteData);
      await sharp(buffer)
        .webp({ quality: 80 }) // Kompresi ke WebP dengan kualitas 80%
        .toFile(newImagePath);

      finalImageUrl = `/uploads/articlesPage/${fileName}`; // Path relatif untuk akses publik
      console.log("Gambar baru berhasil disimpan:", finalImageUrl);
    } catch (error) {
      console.error("Gagal menghapus atau mengunggah gambar baru:", error);
    }
  }

  // Perbarui data Achievement di database
  const updatedCatalogs = await ArticlesPage.findByIdAndUpdate(
    articlesPageId,
    { headline, title, description, image: finalImageUrl, keywords },
    { new: true }
  );

  return NextResponse.json(updatedCatalogs, { status: 200 });
}

export async function POST(request: Request) {
    try {
      const authError = validateToken(request);
      if (authError) return authError;
  
      const formData = await request.formData();
      const title = formData.get("title") as string;
      const headline = formData.get("headline") as string;
      const description = formData.get("description") as string;
      const keywords = formData.getAll("keywords") as string[];
      const imageFile = formData.get("image") as File;
      
      if (
        !title ||
        !description
      ) {
        return NextResponse.json({ error: "All fields are required" }, { status: 400 });
      }
  
  
      // Proses upload gambar
      const timestamp = Date.now();
      const originalName = imageFile.name.replace(/\.(png|jpg|jpeg|svg|webp)$/i, ""); // Hapus ekstensi
      const imageFileName = `${timestamp}-${originalName}.webp`;
  
      const uploadsDir = path.join(process.cwd(), "public", "uploads", "articlesPage");
  
      const imagePath = path.join(uploadsDir, imageFileName);
  
      // Konversi gambar ke WebP menggunakan Sharp
      const imageBuffer = Buffer.from(await imageFile.arrayBuffer());
      await sharp(imageBuffer).webp({ quality: 80 }).toFile(imagePath);    
  
      // Simpan ke MongoDB
      await connectToDatabase();
      const newArticlesPage = new ArticlesPage({
        title,
        headline,
        description,
        keywords,
        image: `/uploads/articlesPage/${imageFileName}`,
      });
  
      await newArticlesPage.save();
  
      return NextResponse.json(newArticlesPage, { status: 201 });
    } catch (error) {
      console.error("Error creating Articles Page:", error);
      return NextResponse.json({ error: "Failed to create Articles Page" }, { status: 500 });
    }
  }