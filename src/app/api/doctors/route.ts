import { connectToDatabase } from "@/lib/mongodb";
import Doctor from "@/models/doctors";
import { NextResponse } from "next/server";
import cloudinary from "@/lib/cloudinary";
import { validateToken } from "@/lib/auth";
import path from "path";
import sharp from "sharp";
import mongoose from "mongoose";

// GET: Fetch all doctors
export async function GET(req: Request) {
  const authError = validateToken(req);
  if (authError) return authError;

  await connectToDatabase();

  try {
    const { searchParams } = new URL(req.url);
    const pageParam = searchParams.get("page");
    const idPosition = searchParams.get("id_position"); // Ambil id_position dari query
    const limit = 15;

    // Buat filter query berdasarkan id_position (jika ada)
    const filter: any = {};
    if (idPosition) {
      filter.id_position = idPosition;
    }

    if (!pageParam || pageParam === "all") {
      // Jika `page` tidak ada atau bernilai "all", ambil semua data dokter berdasarkan filter
      const doctors = await Doctor.find(filter).sort({ createdAt: -1 });

      return new NextResponse(JSON.stringify({
        doctors,
        totalDoctors: doctors.length,
      }), {
        status: 200,
        headers: { "Content-Type": "application/json" },
      });
    }

    // Jika `page` ada, jalankan pagination seperti biasa
    const page = parseInt(pageParam, 10);
    const totalDoctors = await Doctor.countDocuments(filter);
    const doctors = await Doctor.find(filter)
      .skip((page - 1) * limit)
      .limit(limit)
      .sort({ createdAt: -1 });

    return new NextResponse(JSON.stringify({
      doctors,
      currentPage: page,
      totalPages: Math.ceil(totalDoctors / limit),
      totalDoctors,
    }), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });

  } catch (error) {
    console.error("❌ Error fetching doctors")}
}

export async function POST(request: Request) {
  try {
    const authError = validateToken(request);
    if (authError) return authError;

    const formData = await request.formData();
    const name = formData.get("name") as string;
    const position = formData.get("position") as string;
    const id_position = formData.get("id_position") as string;
    const imageFile = formData.get("image") as File;

    if (!name || !position || !imageFile || !id_position) {
      return NextResponse.json({ error: "All fields are required" }, { status: 400 });
    }

    const idPositionObjectId = mongoose.Types.ObjectId.isValid(id_position)
  ? new mongoose.Types.ObjectId(id_position)
  : null;

    const timestamp = Date.now();
    const originalName = imageFile.name.replace(/\.(png|jpg|jpeg|svg|webp)$/i, ""); // Hapus ekstensi
    const fileName = `${timestamp}-${originalName}.webp`;
    const imagePath = path.join(process.cwd(), "public", "uploads", "doctors",fileName);

    // Konversi gambar ke WebP menggunakan Sharp
    const imageByteData = await imageFile.arrayBuffer();
    const buffer = Buffer.from(imageByteData);
    await sharp(buffer)
      .webp({ quality: 80 }) // Kompresi ke WebP dengan kualitas 80%
      .toFile(imagePath);

    // Simpan ke MongoDB
    await connectToDatabase();
    const newDoctor = new Doctor({
      name,
      position,
      id_position: idPositionObjectId,
      image: `/uploads/doctors/${fileName}`, // Path relatif untuk akses publik
    });

    await newDoctor.save();

    return NextResponse.json(newDoctor, { status: 201 });
  } catch (error) {
    console.error("Error creating doctor:", error);
    return NextResponse.json({ error: "Failed to create doctor" }, { status: 500 });
  }
}