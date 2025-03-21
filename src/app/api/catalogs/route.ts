import { connectToDatabase } from "@/lib/mongodb";
import Catalog from "@/models/catalogs";
import { NextResponse } from "next/server";
import { validateToken } from "@/lib/auth";
import path from "path";
import sharp from "sharp";
import { writeFile } from "fs/promises";

// GET: Fetch all doctor
export async function GET(req: { url: string | URL; }) {
  const authError = validateToken(req);
  if (authError) return authError;
  await connectToDatabase(); 
  
  try {
    // Ambil query parameter `page`, default ke 1 jika tidak ada
    const { searchParams } = new URL(req.url);
    const page = parseInt(searchParams.get("page") || "1", 10);
    const limit = 15; // Jumlah data per halaman

    // Hitung total data
    const totalCatalogs = await Catalog.countDocuments();
    
    // Ambil data dengan pagination (skip & limit)
    const catalogs = await Catalog.find({})
      .skip((page - 1) * limit) // Lewati data sesuai halaman
      .limit(limit) // Batasi ke 15 data per halaman
      .sort({ createdAt: -1 }); // Urutkan dari terbaru

    // Hitung total halaman
    const totalPages = Math.ceil(totalCatalogs / limit);

    return NextResponse.json({
      catalogs,
      currentPage: page,
      totalPages,
      totalCatalogs,
    }, { status: 200 });

  } catch (error) {
    console.error("❌ Error fetching catalogs:", error);
    return NextResponse.json({ message: "Gagal mengambil data catalog." }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const authError = validateToken(request);
    if (authError) return authError;

    const formData = await request.formData();
    const title = formData.get("title") as string;
    const date = formData.get("date") as string;
    const documentFile = formData.get("document") as File;
    const imageFile = formData.get("image") as File;

    if (!title || !documentFile || !date || !imageFile) {
      return NextResponse.json({ error: "All fields are required" }, { status: 400 });
    }

    const timestamp = Date.now();
    const originalName = imageFile.name.replace(/\.(png|jpg|jpeg|svg|webp)$/i, ""); // Hapus ekstensi
    const imageFileName = `${timestamp}-${originalName}.webp`;
    const documentFileName = `${timestamp}-${documentFile.name}`; // Simpan dokumen dengan nama asli

    const uploadsDir = path.join(process.cwd(), "public", "uploads", "catalogs");

    const imagePath = path.join(uploadsDir, imageFileName);
    const documentPath = path.join(uploadsDir, documentFileName);

    // Konversi gambar ke WebP menggunakan Sharp
    const imageBuffer = Buffer.from(await imageFile.arrayBuffer());
    await sharp(imageBuffer).webp({ quality: 80 }).toFile(imagePath);

    // Simpan dokumen
    const documentBuffer = new Uint8Array(await documentFile.arrayBuffer());
    await writeFile(documentPath, documentBuffer);

    // Simpan ke MongoDB
    await connectToDatabase();
    const newCatalog = new Catalog({
      title,
      document: `/uploads/catalogs/${documentFileName}`,
      date,
      image: `/uploads/catalogs/${imageFileName}`, // Path relatif untuk akses publik
    });

    await newCatalog.save();

    return NextResponse.json(newCatalog, { status: 201 });
  } catch (error) {
    console.error("Error creating catalog:", error);
    return NextResponse.json({ error: "Failed to create catalog" }, { status: 500 });
  }
}