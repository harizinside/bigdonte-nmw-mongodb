import { NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/mongodb";
import Branchs from "@/models/branchs";
import { validateToken } from "@/lib/auth";
import path from "path";
import sharp from "sharp";

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
    const totalBranches = await Branchs.countDocuments();
    
    // Ambil data dengan pagination (skip & limit)
    const branches = await Branchs.find({})
      .skip((page - 1) * limit) // Lewati data sesuai halaman
      .limit(limit) // Batasi ke 15 data per halaman
      .sort({ createdAt: -1 }); // Urutkan dari terbaru

    // Hitung total halaman
    const totalPages = Math.ceil(totalBranches / limit);

    return NextResponse.json({
      branches,
      currentPage: page,
      totalPages,
      totalBranches,
    }, { status: 200 });

  } catch (error) {
    console.error("❌ Error fetching doctors:", error);
    return NextResponse.json({ message: "Gagal mengambil data dokter." }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const authError = validateToken(request);
    if (authError) return authError;

    const formData = await request.formData();
    const name = formData.get("name") as string;
    const address = formData.get("address") as string;
    const phone = formData.get("phone") as string;
    const location = formData.get("location") as string;
    const operasional = formData.getAll("operasional") as string[];
    const imageFile = formData.get("image") as File;

    if (!name || !address || !phone || !location || operasional.length === 0 || !imageFile) {
      return NextResponse.json({ error: "All fields are required" }, { status: 400 });
    }

    const timestamp = Date.now();
    const originalName = imageFile.name.replace(/\.(png|jpg|jpeg|svg|webp)$/i, ""); // Hapus ekstensi
    const imageFileName = `${timestamp}-${originalName}.webp`;

    const uploadsDir = path.join(process.cwd(), "public", "uploads", "branches");

    const imagePath = path.join(uploadsDir, imageFileName);

    // Konversi gambar ke WebP menggunakan Sharp
    const imageBuffer = Buffer.from(await imageFile.arrayBuffer());
    await sharp(imageBuffer).webp({ quality: 80 }).toFile(imagePath);

    // Simpan ke MongoDB
    await connectToDatabase();
    const newBranch = new Branchs({
      name,
      address,
      phone,
      location,
      operasional,
      image: `/uploads/branches/${imageFileName}`, // Path relatif untuk akses publik
    });

    await newBranch.save();

    return NextResponse.json(newBranch, { status: 201 });
  } catch (error) {
    console.error("Error creating branch:", error);
    return NextResponse.json({ error: "Failed to create branch" }, { status: 500 });
  }
}