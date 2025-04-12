import { connectToDatabase } from "@/lib/mongodb";
import CatalogsPage from "@/models/catalogsPage";
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

  const catalogsPageId = "67fa0378c6d73b8b3466f32f";

  const catalogsPage = await CatalogsPage.findById(catalogsPageId);
  if (!catalogsPage) return NextResponse.json({ message: "catalogsPage not found" }, { status: 404 });
  return NextResponse.json(catalogsPage, { status: 200 });
}

export async function PUT(req: any, { params }: { params: { id: string } }) {
  const authError = validateToken(req);
  if (authError) return authError;

  const catalogsPageId = "67fa0378c6d73b8b3466f32f";

  await connectToDatabase();

  const formData = await req.formData();
    const title = formData.get("title") as string;
    const headline = formData.get("headline") as string;
    const description = formData.get("description") as string;
    const keywords = formData.getAll("keywords") as string[];
    const imageFileBanner = formData.get("image") as File;

  const existingCatalogsPage = await CatalogsPage.findById(catalogsPageId);
  if (!existingCatalogsPage) {
    return NextResponse.json({ message: "Catalogs Page not found" }, { status: 404 });
  }

  let finalImageUrl = existingCatalogsPage.image; 

  if (imageFileBanner) {
    try {
      // Hapus gambar lama jika ada
      if (existingCatalogsPage.image) {
        const oldImagePath = path.join(process.cwd(), "public", existingCatalogsPage.image);
        console.log("Menghapus gambar lama:", oldImagePath);
        await fs.access(oldImagePath); // Periksa apakah file ada
        await fs.unlink(oldImagePath); // Hapus file
      }

      // Simpan gambar baru
      const timestamp = Date.now();
      const originalName = imageFileBanner.name.replace(/\.(png|jpg|jpeg|svg|webp)$/i, ""); // Hapus ekstensi
      const fileName = `${timestamp}-${originalName}.webp`; // Simpan sebagai WebP
      const newImagePath = path.join(process.cwd(), "public", "uploads", "catalogsPage",fileName);

      // Konversi gambar ke WebP menggunakan Sharp
      const imageByteData = await imageFileBanner.arrayBuffer();
      const buffer = Buffer.from(imageByteData);
      await sharp(buffer)
        .webp({ quality: 80 }) // Kompresi ke WebP dengan kualitas 80%
        .toFile(newImagePath);

      finalImageUrl = `/uploads/catalogsPage/${fileName}`; // Path relatif untuk akses publik
      console.log("Gambar baru berhasil disimpan:", finalImageUrl);
    } catch (error) {
      console.error("Gagal menghapus atau mengunggah gambar baru:", error);
    }
  }

  // Perbarui data Achievement di database
  const updatedCatalogs = await CatalogsPage.findByIdAndUpdate(
    catalogsPageId,
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
  
      const uploadsDir = path.join(process.cwd(), "public", "uploads", "catalogsPage");
  
      const imagePath = path.join(uploadsDir, imageFileName);
  
      // Konversi gambar ke WebP menggunakan Sharp
      const imageBuffer = Buffer.from(await imageFile.arrayBuffer());
      await sharp(imageBuffer).webp({ quality: 80 }).toFile(imagePath);    
  
      // Simpan ke MongoDB
      await connectToDatabase();
      const newCatalogsPage = new CatalogsPage({
        title,
        headline,
        description,
        keywords,
        image: `/uploads/catalogsPage/${imageFileName}`,
      });
  
      await newCatalogsPage.save();
  
      return NextResponse.json(newCatalogsPage, { status: 201 });
    } catch (error) {
      console.error("Error creating catalogsPage:", error);
      return NextResponse.json({ error: "Failed to create catalogsPage" }, { status: 500 });
    }
  }