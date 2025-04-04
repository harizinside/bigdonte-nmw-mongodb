import { connectToDatabase } from "@/lib/mongodb";
import Catalog from "@/models/catalogs";
import { NextResponse } from "next/server";
import { validateToken } from "@/lib/auth";
import path from "path";
import sharp from "sharp";
import { writeFile } from "fs/promises";

export async function GET(req: Request) {
  const authError = validateToken(req);
  if (authError) return authError;

  await connectToDatabase();

  try {
    const { searchParams } = new URL(req.url);
    const pageParam = searchParams.get("page");
    const limit = 15;

    if (!pageParam || pageParam === "all") {
      // Jika `page` tidak ada atau bernilai "all", ambil semua data dokter
      const catalogs = await Catalog.find({}).sort({ createdAt: -1 });

      return new NextResponse(JSON.stringify({
        catalogs,
        totalCatalogs: catalogs.length,
      }), { 
        status: 200,
        headers: { "Content-Type": "application/json" },
      });
    }

    // Jika `page` ada, jalankan pagination seperti biasa
    const page = parseInt(pageParam, 10);
    const totalCatalogs = await Catalog.countDocuments();
    const catalogs = await Catalog.find({})
      .skip((page - 1) * limit)
      .limit(limit)
      .sort({ createdAt: -1 });

    return new NextResponse(JSON.stringify({
      catalogs,
      currentPage: page,
      totalPages: Math.ceil(totalCatalogs / limit),
      totalCatalogs,
    }), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });

  } catch (error) {
    console.error("❌ Error fetching catalogs:", error);
    return new NextResponse(JSON.stringify({ message: "Gagal mengambil data catalogs." }), { status: 500 });
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

    if (!title || !documentFile || !date) {
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