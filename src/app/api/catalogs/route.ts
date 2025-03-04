import { connectToDatabase } from "@/lib/mongodb";
import Catalog from "@/models/catalogs";
import { NextResponse } from "next/server";
import cloudinary from "@/lib/cloudinary";

// GET: Fetch all doctor
export async function GET(req: { url: string | URL; }) {
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

// POST: Create a new doctor with Cloudinary upload
export async function POST(req: { json: () => PromiseLike<{ title: any; date: any; image: any; document: any; }> | { title: any; date: any; image: any; document: any; }; }) {
  try {
    await connectToDatabase();
    const { title, date, image, document } = await req.json();

    if (!title || !date || !image || !document) {
      return NextResponse.json({ error: "All fields are required" }, { status: 400 });
    }

    // Upload image ke Cloudinary
    const imageUpload = await cloudinary.uploader.upload(image, { 
      folder: "catalogs",
      transformation: [{ width: 500, height: 500, crop: "limit" }],
    });

    if (!imageUpload.secure_url) {
      return NextResponse.json({ error: "Failed to upload image" }, { status: 500 });
    }

    // Upload document ke Cloudinary (PDF, DOCX, dll.)
    const documentUpload = await cloudinary.uploader.upload(document, {
      folder: "catalogs",
      resource_type: "raw", // Untuk dokumen
      access_mode: "public",
      sign_url: true, 
    });

    if (!documentUpload.secure_url) {
      return NextResponse.json({ error: "Failed to upload document" }, { status: 500 });
    }

    // Simpan ke MongoDB
    const newCatalog = new Catalog({
      title,
      date,
      image: imageUpload.secure_url, // Simpan URL gambar
      document: documentUpload.secure_url, // Simpan URL dokumen
    });

    await newCatalog.save();

    return NextResponse.json(newCatalog, { status: 201 });
  } catch (error) {
    console.error("Error creating catalog:", error);
    return NextResponse.json({ error: "Failed to create catalog" }, { status: 500 });
  }
}