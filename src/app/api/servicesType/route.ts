import { connectToDatabase } from "@/lib/mongodb";
import ServicesList from "@/models/servicesList";
import ServicesType from "@/models/servicesType";
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
    const servicesSlug = searchParams.get("services");
    const servicesListSlug = searchParams.get("servicesList");

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

    if (servicesListSlug) {
      // Cari service berdasarkan slug
      const serviceList = await ServicesList.findOne({ slug: servicesListSlug });
      if (!serviceList) {
        return NextResponse.json({ message: "Service List not found" }, { status: 404 });
      }
      // Gunakan _id service sebagai id_services dalam ServicesList
      query = { id_servicesList: serviceList._id };
    }

    const totalServicesType = await ServicesType.countDocuments(query);
    const servicesType = await ServicesType.find(query)
      .skip((page - 1) * limit)
      .limit(limit)
      .sort({ createdAt: -1 })
      .populate("id_services")
      .populate("id_servicesList")

    return new NextResponse(JSON.stringify({
      servicesType,
      currentPage: page,
      totalPages: Math.ceil(totalServicesType / limit),
      totalServicesType,
    }), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });

  } catch (error) {
    console.error("❌ Error fetching services type:", error);
    return new NextResponse(JSON.stringify({ message: "Gagal mengambil data services type." }), { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const authError = validateToken(request);
    if (authError) return authError;

    const formData = await request.formData();
    let name = formData.get("name") as string; 
    let slug = formData.get("slug") as string;
    const description = formData.get("description") as string;
    const imageFileBanner = formData.get("image") as File;
    const slugServices = formData.get("slugServices") as string; 
    const slugServicesList = formData.get("slugServicesList") as string; 

    if (!name || !description || !imageFileBanner) {
      return NextResponse.json({ error: "All fields are required" }, { status: 400 });
    }

    let count = 1;
    let baseSlug = slug; // Simpan slug awal
    while (await ServicesType.findOne({ slug })) {
      count++;
      slug = `${baseSlug}-${count}`;
    }

    let countTitle = 1;
    let baseName = name; // Simpan nama awal
    while (await ServicesType.findOne({ name })) {
      countTitle++;
      name = `${baseName} ${countTitle}`;
    }

    const timestamp = Date.now();
    const originalName = imageFileBanner.name.replace(/\.(png|jpg|jpeg|svg|webp)$/i, ""); // Hapus ekstensi
    const fileName = `${timestamp}-${originalName}.webp`;
    const imagePath = path.join(process.cwd(), "public", "uploads", "services-type",fileName);

    // Konversi gambar ke WebP menggunakan Sharp
    const imageByteData = await imageFileBanner.arrayBuffer();
    const buffer = Buffer.from(imageByteData);
    await sharp(buffer)
      .webp({ quality: 80 }) // Kompresi ke WebP dengan kualitas 80%
      .toFile(imagePath);

    // Simpan ke MongoDB
    await connectToDatabase();
    const service = await Services.findOne({ slug: slugServices });
    const serviceList = await ServicesList.findOne({ slug: slugServicesList });
    const newServicesType = new ServicesType({
      name,
      slug,
      description,
      id_services: service._id,
      id_servicesList: serviceList._id,
      image: `/uploads/services-type/${fileName}`, // Path relatif untuk akses publik
    });

    await newServicesType.save();

    return NextResponse.json(newServicesType, { status: 201 });
  } catch (error) {
    console.error("Error creating services type:", error);
    return NextResponse.json({ error: "Failed to create services type" }, { status: 500 });
  }
}