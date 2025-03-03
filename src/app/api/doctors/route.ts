import { connectToDatabase } from "@/lib/mongodb";
import Doctor from "@/models/doctors";
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
    const totalDoctors = await Doctor.countDocuments();
    
    // Ambil data dengan pagination (skip & limit)
    const doctors = await Doctor.find({})
      .skip((page - 1) * limit) // Lewati data sesuai halaman
      .limit(limit) // Batasi ke 15 data per halaman
      .sort({ createdAt: -1 }); // Urutkan dari terbaru

    // Hitung total halaman
    const totalPages = Math.ceil(totalDoctors / limit);

    return NextResponse.json({
      doctors,
      currentPage: page,
      totalPages,
      totalDoctors,
    }, { status: 200 });

  } catch (error) {
    console.error("❌ Error fetching doctors:", error);
    return NextResponse.json({ message: "Gagal mengambil data dokter." }, { status: 500 });
  }
}

// POST: Create a new doctor with Cloudinary upload
export async function POST(req: { json: () => PromiseLike<{ name: any; position: any; image: any; }> | { name: any; position: any; image: any; }; }) {
  try {
    await connectToDatabase();
    const { name, position, image } = await req.json();

    if (!name || !position || !image) {
      return NextResponse.json({ error: "All fields are required" }, { status: 400 });
    }

    // Upload image to Cloudinary
    const uploadResponse = await cloudinary.uploader.upload(image, {
      folder: "doctors",
      transformation: [{ width: 500, height: 500, crop: "limit" }],
    });

    if (!uploadResponse.secure_url) {
      return NextResponse.json({ error: "Failed to upload image" }, { status: 500 });
    }

    // Save to MongoDB
    const newDoctor = new Doctor({
      name,
      position,
      image: uploadResponse.secure_url, // Save Cloudinary image URL
    });

    await newDoctor.save();
    
    return NextResponse.json(newDoctor, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: "Failed to create doctor" }, { status: 500 });
  }
}