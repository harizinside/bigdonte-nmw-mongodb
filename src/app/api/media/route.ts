import { connectToDatabase } from "@/lib/mongodb";
import Media from "@/models/media";
import { NextResponse } from "next/server";
import { validateToken } from "@/lib/auth";
import path from "path";
import sharp from "sharp";

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
      const media = await Media.find({}).sort({ createdAt: -1 });

      return new NextResponse(JSON.stringify({
        media,
        totalMedia: media.length,
      }), { 
        status: 200,
        headers: { "Content-Type": "application/json" },
      });
    }

    // Jika `page` ada, jalankan pagination seperti biasa
    const page = parseInt(pageParam, 10);
    const totalMedia = await Media.countDocuments();
    const media = await Media.find({})
      .skip((page - 1) * limit)
      .limit(limit)
      .sort({ createdAt: -1 });

    return new NextResponse(JSON.stringify({
      media,
      currentPage: page,
      totalPages: Math.ceil(totalMedia / limit),
      totalMedia,
    }), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });

  } catch (error) {
    console.error("❌ Error fetching media:", error);
    return new NextResponse(JSON.stringify({ message: "Gagal mengambil data media." }), { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const authError = validateToken(request);
    if (authError) return authError;

    const formData = await request.formData();
    const imageFile = formData.get("image") as File;

    if (!imageFile) {
      return NextResponse.json({ error: "All fields are required" }, { status: 400 });
    }

    const timestamp = Date.now();
    const originalName = imageFile.name.replace(/\.(png|jpg|jpeg|svg|webp)$/i, ""); // Hapus ekstensi
    const fileName = `${timestamp}-${originalName}.webp`;
    const imagePath = path.join(process.cwd(), "public", "uploads", "media",fileName);

    // Konversi gambar ke WebP menggunakan Sharp
    const imageByteData = await imageFile.arrayBuffer();
    const buffer = Buffer.from(imageByteData);
    await sharp(buffer)
      .webp({ quality: 80 }) // Kompresi ke WebP dengan kualitas 80%
      .toFile(imagePath);

    // Simpan ke MongoDB
    await connectToDatabase();
    const newMedia = new Media({
      image: `/uploads/media/${fileName}`, // Path relatif untuk akses publik
    });

    await newMedia.save();

    return NextResponse.json(newMedia, { status: 201 });
  } catch (error) {
    console.error("Error creating media:", error);
    return NextResponse.json({ error: "Failed to create media" }, { status: 500 });
  }
}