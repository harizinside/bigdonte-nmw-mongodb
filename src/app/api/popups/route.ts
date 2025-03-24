import { connectToDatabase } from "@/lib/mongodb";
import Popups from "@/models/popups";
import { NextResponse } from "next/server";
import { validateToken } from "@/lib/auth";
import path from "path";
import sharp from "sharp";

// GET: Fetch all doctors
export async function GET(req: Request) {
    const authError = validateToken(req);
    if (authError) return authError;

  await connectToDatabase();

  try {
    const { searchParams } = new URL(req.url);
    const page = parseInt(searchParams.get("page") || "1", 10);
    const limit = 15;

    const totalPopups = await Popups.countDocuments();
    const popups = await Popups.find({})
      .skip((page - 1) * limit)
      .limit(limit)
      .sort({ createdAt: -1 });

    return new NextResponse(JSON.stringify({
      popups,
      currentPage: page,
      totalPages: Math.ceil(totalPopups / limit),
      totalPopups,
    }), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });

  } catch (error) {
    console.error("❌ Error fetching popups:", error);
    return new NextResponse(JSON.stringify({ message: "Gagal mengambil data popups." }), { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const authError = validateToken(request);
    if (authError) return authError;

    const formData = await request.formData();
    const link = formData.get("link") as string;
    const status = formData.get("status") === "1"; 
    const imageFile = formData.get("image") as File;

    if (!link || status === null || !imageFile) {
      return NextResponse.json({ error: "All fields are required" }, { status: 400 });
    }
  

    const timestamp = Date.now();
    const originalName = imageFile.name.replace(/\.(png|jpg|jpeg|svg|webp)$/i, ""); // Hapus ekstensi
    const fileName = `${timestamp}-${originalName}.webp`;
    const imagePath = path.join(process.cwd(), "public", "uploads", "popups",fileName);

    // Konversi gambar ke WebP menggunakan Sharp
    const imageByteData = await imageFile.arrayBuffer();
    const buffer = Buffer.from(imageByteData);
    await sharp(buffer)
      .webp({ quality: 80 }) // Kompresi ke WebP dengan kualitas 80%
      .toFile(imagePath);

    // Simpan ke MongoDB
    await connectToDatabase();
    const newPopups = new Popups({
      link,
      status,
      image: `/uploads/popups/${fileName}`, // Path relatif untuk akses publik
    });

    await newPopups.save();

    return NextResponse.json(newPopups, { status: 201 });
  } catch (error) {
    console.error("Error creating popups:", error);
    return NextResponse.json({ error: "Failed to create popups" }, { status: 500 });
  }
}