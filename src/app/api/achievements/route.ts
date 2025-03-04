import { connectToDatabase } from "@/lib/mongodb";
import Achievement from "@/models/achievements";
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
    const totalAchievements = await Achievement.countDocuments();
    
    // Ambil data dengan pagination (skip & limit)
    const achievements = await Achievement.find({})
      .skip((page - 1) * limit) // Lewati data sesuai halaman
      .limit(limit) // Batasi ke 15 data per halaman
      .sort({ createdAt: -1 }); // Urutkan dari terbaru

    // Hitung total halaman
    const totalPages = Math.ceil(totalAchievements / limit);

    return NextResponse.json({
      achievements,
      currentPage: page,
      totalPages,
      totalAchievements,
    }, { status: 200 });

  } catch (error) {
    console.error("❌ Error fetching achievements:", error);
    return NextResponse.json({ message: "Gagal mengambil data achievements." }, { status: 500 });
  }
}

// POST: Create a new achievement with Cloudinary upload
export async function POST(req: { json: () => PromiseLike<{ title: any; description: any; date: any; image: any; }> | { title: any; description: any; date: any; image: any; }; }) {
  try {
    await connectToDatabase();
    const { title, description, image, date } = await req.json();

    if (!title || !description || !image || !date) {
      return NextResponse.json({ error: "All fields are required" }, { status: 400 });
    }

    // Upload image to Cloudinary
    const uploadResponse = await cloudinary.uploader.upload(image, {
      folder: "achievements",
      transformation: [{ width: 500, height: 500, crop: "limit" }],
    });

    if (!uploadResponse.secure_url) {
      return NextResponse.json({ error: "Failed to upload image" }, { status: 500 });
    }

    // Save to MongoDB
    const newAchievement = new Achievement({
      title,
      description,
      date,
      image: uploadResponse.secure_url, // Save Cloudinary image URL
    });

    await newAchievement.save();
    
    return NextResponse.json(newAchievement, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: "Failed to create achievement" }, { status: 500 });
  }
}