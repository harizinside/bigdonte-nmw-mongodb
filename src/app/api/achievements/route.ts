import { connectToDatabase } from "@/lib/mongodb";
import Achievement from "@/models/achievements";
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
      const achievements = await Achievement.find({}).sort({ createdAt: -1 });

      return new NextResponse(JSON.stringify({
        achievements,
        totalAchievements: achievements.length,
      }), { 
        status: 200,
        headers: { "Content-Type": "application/json" },
      });
    }

    // Jika `page` ada, jalankan pagination seperti biasa
    const page = parseInt(pageParam, 10);
    const totalAchievements = await Achievement.countDocuments();
    const achievements = await Achievement.find({})
      .skip((page - 1) * limit)
      .limit(limit)
      .sort({ createdAt: -1 });

    return new NextResponse(JSON.stringify({
      achievements,
      currentPage: page,
      totalPages: Math.ceil(totalAchievements / limit),
      totalAchievements,
    }), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });

  } catch (error) {
    console.error("❌ Error fetching achievements:", error);
    return new NextResponse(JSON.stringify({ message: "Gagal mengambil data achievements." }), { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const authError = validateToken(request);
    if (authError) return authError;

    const formData = await request.formData();
    const title = formData.get("title") as string;
    const description = formData.get("description") as string;
    const date = formData.get("date") as string;
    const imageFile = formData.get("image") as File;

    if (!title || !description || !date) {
      return NextResponse.json(
        { error: "Semua field harus diisi." },
        { status: 400 }
      );
    }

    const timestamp = Date.now();
    const originalName = imageFile.name.replace(/\.(png|jpg|jpeg|svg|webp)$/i, "");
    const fileName = `${timestamp}-${originalName}.webp`;
    const imagePath = path.join(process.cwd(), "public", "uploads", "achievements", fileName);

    // Konversi ke WebP
    const buffer = Buffer.from(await imageFile.arrayBuffer());

    try {
      await sharp(buffer)
        .webp({ quality: 80 })
        .toFile(imagePath);
    } catch (err: any) {
      if (err.code === "EACCES" || err.code === "EROFS") {
        return NextResponse.json(
          {
            error: "Gagal menyimpan gambar. Folder public mungkin hanya-baca di server (misalnya Vercel).",
          },
          { status: 500 }
        );
      }

      return NextResponse.json(
        {
          error: "Terjadi kesalahan saat mengolah gambar.",
        },
        { status: 500 }
      );
    }

    // Simpan ke DB
    await connectToDatabase();
    const newAchievement = new Achievement({
      title,
      description,
      date,
      image: `/uploads/achievements/${fileName}`,
    });

    await newAchievement.save();

    return NextResponse.json(newAchievement, { status: 201 });

  } catch (error: any) {
    // Tangani error umum di luar proses konversi/simpan
    return NextResponse.json(
      {
        error: "Terjadi kesalahan saat membuat data prestasi.",
        message: error?.message || "Unknown error",
      },
      { status: 500 }
    );
  }
}
