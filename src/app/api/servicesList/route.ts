import { connectToDatabase } from "@/lib/mongodb";
import ServicesList from "@/models/servicesList";
import Services from "@/models/services";
import { NextResponse } from "next/server";
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
    const page = parseInt(searchParams.get("page") || "1", 10);
    const limit = 15;
    const servicesSlug = searchParams.get("services"); // Ambil slug dari query parameter

    let query = {};

    if (servicesSlug) {
      // Cari service berdasarkan slug
      const service = await Services.findOne({ slug: servicesSlug });
      if (!service) {
        return NextResponse.json({ message: "Service not found" }, { status: 404 });
      }
      // Gunakan _id service sebagai id_services dalam ServicesList
      query = { id_services: service._id };
    }

    const totalServicesList = await ServicesList.countDocuments(query);
    const servicesList = await ServicesList.find(query)
      .skip((page - 1) * limit)
      .limit(limit)
      .sort({ createdAt: -1 })
      .populate("id_services"); // Opsional: Jika ingin mengambil detail services

    return new NextResponse(JSON.stringify({
      servicesList,
      currentPage: page,
      totalPages: Math.ceil(totalServicesList / limit),
      totalServicesList,
    }), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });

  } catch (error) {
    console.error("❌ Error fetching services list:", error);
    return new NextResponse(JSON.stringify({ message: "Gagal mengambil data services list." }), { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const authError = validateToken(request);
    if (authError) return authError;

    const formData = await request.formData();
    const name = formData.get("name") as string; 
    const slug = formData.get("slug") as string;
    const description = formData.get("description") as string;
    const sensitive_content = formData.get("sensitive_content") === "1";
    const imageFileBanner = formData.get("imageBanner") as File;
    const imageFileCover = formData.get("imageCover") as File;
    const slugServices = formData.get("slugServices") as string; 

    if (!name || !description || sensitive_content === null || sensitive_content === undefined || !imageFileBanner || !imageFileCover) {
      return NextResponse.json({ error: "All fields are required" }, { status: 400 });
    }

    const timestamp = Date.now();
    const originalName = imageFileBanner.name.replace(/\.(png|jpg|jpeg|svg|webp)$/i, ""); // Hapus ekstensi
    const fileName = `${timestamp}-${originalName}.webp`;
    const imagePath = path.join(process.cwd(), "public", "uploads", "services-list",fileName);

    // Konversi gambar ke WebP menggunakan Sharp
    const imageByteData = await imageFileBanner.arrayBuffer();
    const buffer = Buffer.from(imageByteData);
    await sharp(buffer)
      .webp({ quality: 80 }) // Kompresi ke WebP dengan kualitas 80%
      .toFile(imagePath);

    const originalNameCover = imageFileCover.name.replace(/\.(png|jpg|jpeg|svg|webp)$/i, ""); // Hapus ekstensi
    const fileNameCover = `${timestamp}-${originalNameCover}.webp`;
    const imagePathCover = path.join(process.cwd(), "public", "uploads", "services-list",fileNameCover);

    // Konversi gambar ke WebP menggunakan Sharp
    const imageByteDataCover = await imageFileCover.arrayBuffer();
    const bufferCover = Buffer.from(imageByteDataCover);
    await sharp(bufferCover)
      .webp({ quality: 80 }) // Kompresi ke WebP dengan kualitas 80%
      .toFile(imagePathCover);

    // Simpan ke MongoDB
    await connectToDatabase();
    const service = await Services.findOne({ slug: slugServices });
    const newServicesList = new ServicesList({
      name,
      slug,
      description,
      sensitive_content,
      id_services: service._id,
      imageBanner: `/uploads/services-list/${fileName}`, // Path relatif untuk akses publik
      imageCover: `/uploads/services-list/${fileNameCover}`, // Path relatif untuk akses publik
    });

    await newServicesList.save();

    return NextResponse.json(newServicesList, { status: 201 });
  } catch (error) {
    console.error("Error creating services:", error);
    return NextResponse.json({ error: "Failed to create services" }, { status: 500 });
  }
}