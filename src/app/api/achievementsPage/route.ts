import { connectToDatabase } from "@/lib/mongodb";
import AchievementsPage from "@/models/achievementsPage";
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

  const achievementsPageId = "67fa0bce937c8a47d97a0486";

  const achievementsPage = await AchievementsPage.findById(achievementsPageId);
  if (!achievementsPage) return NextResponse.json({ message: "Achievements Page not found" }, { status: 404 });
  return NextResponse.json(achievementsPage, { status: 200 });
}

export async function PUT(req: any, { params }: { params: { id: string } }) {
  const authError = validateToken(req);
  if (authError) return authError;

  const achievementsPageId = "67fa0bce937c8a47d97a0486";

  await connectToDatabase();

  const formData = await req.formData();
    const title = formData.get("title") as string;
    const headline = formData.get("headline") as string;
    const description = formData.get("description") as string;
    const keywords = formData.getAll("keywords") as string[];
    const imageFileBanner = formData.get("image") as File;

  const existingAchievementsPage = await AchievementsPage.findById(achievementsPageId);
  if (!existingAchievementsPage) {
    return NextResponse.json({ message: "Achievements Page not found" }, { status: 404 });
  }

  let finalImageUrl = existingAchievementsPage.image; 

  if (imageFileBanner) {
    try {
      // Hapus gambar lama jika ada
      if (existingAchievementsPage.image) {
        const oldImagePath = path.join(process.cwd(), "public", existingAchievementsPage.image);
        console.log("Menghapus gambar lama:", oldImagePath);
        await fs.access(oldImagePath); // Periksa apakah file ada
        await fs.unlink(oldImagePath); // Hapus file
      }

      // Simpan gambar baru
      const timestamp = Date.now();
      const originalName = imageFileBanner.name.replace(/\.(png|jpg|jpeg|svg|webp)$/i, ""); // Hapus ekstensi
      const fileName = `${timestamp}-${originalName}.webp`; // Simpan sebagai WebP
      const newImagePath = path.join(process.cwd(), "public", "uploads", "achievementsPage",fileName);

      // Konversi gambar ke WebP menggunakan Sharp
      const imageByteData = await imageFileBanner.arrayBuffer();
      const buffer = Buffer.from(imageByteData);
      await sharp(buffer)
        .webp({ quality: 80 }) // Kompresi ke WebP dengan kualitas 80%
        .toFile(newImagePath);

      finalImageUrl = `/uploads/achievementsPage/${fileName}`; // Path relatif untuk akses publik
      console.log("Gambar baru berhasil disimpan:", finalImageUrl);
    } catch (error) {
      console.error("Gagal menghapus atau mengunggah gambar baru:", error);
    }
  }

  // Perbarui data Achievement di database
  const updatedAchievements = await AchievementsPage.findByIdAndUpdate(
    achievementsPageId,
    { headline, title, description, image: finalImageUrl, keywords },
    { new: true }
  );

  return NextResponse.json(updatedAchievements, { status: 200 });
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
  
      const uploadsDir = path.join(process.cwd(), "public", "uploads", "achievementsPage");
  
      const imagePath = path.join(uploadsDir, imageFileName);
  
      // Konversi gambar ke WebP menggunakan Sharp
      const imageBuffer = Buffer.from(await imageFile.arrayBuffer());
      await sharp(imageBuffer).webp({ quality: 80 }).toFile(imagePath);    
  
      // Simpan ke MongoDB
      await connectToDatabase();
      const newAchievementsPage = new AchievementsPage({
        title,
        headline,
        description,
        keywords,
        image: `/uploads/achievementsPage/${imageFileName}`,
      });
  
      await newAchievementsPage.save();
  
      return NextResponse.json(newAchievementsPage, { status: 201 });
    } catch (error) {
      console.error("Error creating Achievements Page:", error);
      return NextResponse.json({ error: "Failed to create Achievements Page" }, { status: 500 });
    }
  }