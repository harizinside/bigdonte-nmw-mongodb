import { connectToDatabase } from "@/lib/mongodb";
import Achievement from "@/models/achievements";
import { NextResponse } from "next/server";
import { validateToken } from "@/lib/auth";
import path from "path";
import sharp from "sharp";

// GET: Fetch all doctor
// export async function GET(req: { url: string | URL; }) {
//   const authError = validateToken(req);
//   if (authError) return authError;
//   await connectToDatabase();
  
//   try {
//     // Ambil query parameter `page`, default ke 1 jika tidak ada
//     const { searchParams } = new URL(req.url);
//     const page = parseInt(searchParams.get("page") || "1", 10);
//     const limit = 15; // Jumlah data per halaman

//     // Hitung total data
//     const totalAchievements = await Achievement.countDocuments();
    
//     // Ambil data dengan pagination (skip & limit)
//     const achievements = await Achievement.find({})
//       .skip((page - 1) * limit) // Lewati data sesuai halaman
//       .limit(limit) // Batasi ke 15 data per halaman
//       .sort({ createdAt: -1 }); // Urutkan dari terbaru

//     // Hitung total halaman
//     const totalPages = Math.ceil(totalAchievements / limit);

//     return NextResponse.json({
//       achievements, 
//       currentPage: page,
//       totalPages,
//       totalAchievements,
//     }, { status: 200 });

//   } catch (error) {
//     console.error("❌ Error fetching achievements:", error);
//     return NextResponse.json({ message: "Gagal mengambil data achievements." }, { status: 500 });
//   }
// }

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

    if (!title || !description || !date || !imageFile) {
      return NextResponse.json({ error: "All fields are required" }, { status: 400 });
    }

    const timestamp = Date.now();
    const originalName = imageFile.name.replace(/\.(png|jpg|jpeg|svg|webp)$/i, ""); // Hapus ekstensi
    const fileName = `${timestamp}-${originalName}.webp`;
    const imagePath = path.join(process.cwd(), "public", "uploads", "achievements",fileName);

    // Konversi gambar ke WebP menggunakan Sharp
    const imageByteData = await imageFile.arrayBuffer();
    const buffer = Buffer.from(imageByteData);
    await sharp(buffer)
      .webp({ quality: 80 }) // Kompresi ke WebP dengan kualitas 80%
      .toFile(imagePath);

    // Simpan ke MongoDB
    await connectToDatabase();
    const newAchievement = new Achievement({
      title,
      description,
      date,
      image: `/uploads/achievements/${fileName}`, // Path relatif untuk akses publik
    });

    await newAchievement.save();

    return NextResponse.json(newAchievement, { status: 201 });
  } catch (error) {
    console.error("Error creating achievement:", error);
    return NextResponse.json({ error: "Failed to create achievement" }, { status: 500 });
  }
}