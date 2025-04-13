import { connectToDatabase } from "@/lib/mongodb";
import ServicesList from "@/models/servicesList";
import ServicesType from "@/models/servicesType";
import Services from "@/models/services";
import Patient from "@/models/patients";
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
    const page = parseInt(searchParams.get("page") || "1", 10);
    const limit = 15;
    const servicesSlug = searchParams.get("services");
    const servicesListSlug = searchParams.get("servicesList");
    const servicesTypeSlug = searchParams.get("servicesType");

    let query: Record<string, any> = {}; // 👈 Ini memperbolehkan properti dinamis

    if (servicesSlug) {
      const service = await Services.findOne({ slug: servicesSlug });
      if (!service) {
        return NextResponse.json({ message: "Service not found" }, { status: 404 });
      }
      query.id_services = service._id;// ✅ Tidak error karena `query` bisa punya properti dinamis
    }

    if (servicesListSlug) {
      const serviceList = await ServicesList.findOne({ slug: servicesListSlug });
      if (!serviceList) {
        return NextResponse.json({ message: "Service List not found" }, { status: 404 });
      }
      query.id_servicesList = serviceList._id; // ✅ Aman
    }

    if (servicesTypeSlug) {
      const serviceType = await ServicesType.findOne({ slug: servicesTypeSlug });
      if (!serviceType) {
        return NextResponse.json({ message: "Service Type not found" }, { status: 404 });
      }
      query.id_servicesType = serviceType._id; // ✅ Aman
    }

    // Hitung total data berdasarkan query
    const totalPatients = await Patient.countDocuments(query);

    // Ambil data dengan pagination
    const patients = await Patient.find(query)
      .skip((page - 1) * limit)
      .limit(limit)
      .sort({ createdAt: -1 })
      .populate("id_services")
      .populate("id_servicesList")
      .populate("id_servicesType");

    return new NextResponse(JSON.stringify({
      patients,
      currentPage: page,
      totalPages: Math.ceil(totalPatients / limit),
      totalPatients,
    }), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });

  } catch (error) {
    console.error("❌ Error fetching patients:", error);
    return new NextResponse(JSON.stringify({ message: "Gagal mengambil data patients." }), { status: 500 });
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
    const keywords = formData.getAll("keywords") as string[];
    const image = formData.get("image") as File;
    const imageSecond = formData.get("imageSecond") as File;
    const slugServices = formData.get("slugServices") as string; 
    const slugServicesList = formData.get("slugServicesList") as string; 
    const slugServicesType = formData.get("slugServicesType") as string; 

    if (!name || !description) {
      return NextResponse.json({ error: "All fields are required" }, { status: 400 });
    }

    let count = 1;
    let baseSlug = slug; // Simpan slug awal
    while (await Patient.findOne({ slug })) {
      count++;
      slug = `${baseSlug}-${count}`;
    }

    let countTitle = 1;
    let baseName = name; // Simpan nama awal
    while (await Patient.findOne({ name })) {
      countTitle++;
      name = `${baseName} ${countTitle}`;
    }

    const timestamp = Date.now();
    const originalName = image.name.replace(/\.(png|jpg|jpeg|svg|webp)$/i, ""); // Hapus ekstensi
        const fileName = `${timestamp}-${originalName}.webp`;
        const imagePath = path.join(process.cwd(), "public", "uploads", "patients",fileName);
    
        // Konversi gambar ke WebP menggunakan Sharp
        const imageByteData = await image.arrayBuffer();
        const buffer = Buffer.from(imageByteData);
        await sharp(buffer)
          .webp({ quality: 80 }) // Kompresi ke WebP dengan kualitas 80%
          .toFile(imagePath);
    
        const originalNameCover = imageSecond.name.replace(/\.(png|jpg|jpeg|svg|webp)$/i, ""); // Hapus ekstensi
        const fileNameCover = `${timestamp}-${originalNameCover}.webp`;
        const imagePathCover = path.join(process.cwd(), "public", "uploads", "patients",fileNameCover);
    
        // Konversi gambar ke WebP menggunakan Sharp
        const imageByteDataCover = await imageSecond.arrayBuffer();
        const bufferCover = Buffer.from(imageByteDataCover);
        await sharp(bufferCover)
          .webp({ quality: 80 }) // Kompresi ke WebP dengan kualitas 80%
          .toFile(imagePathCover);

    // Simpan ke MongoDB
    await connectToDatabase();
    const service = await Services.findOne({ slug: slugServices });
    const serviceList = await ServicesList.findOne({ slug: slugServicesList });
    const serviceType = await ServicesType.findOne({ slug: slugServicesType });
    const newPatients = new Patient({
      name,
      slug,
      description,
      keywords,
      id_services: service._id,
      id_servicesList: serviceList._id,
      id_servicesType: serviceType._id,
      image: `/uploads/patients/${fileName}`, // Path relatif untuk akses publik
      imageSecond: `/uploads/patients/${fileNameCover}`, // Path relatif untuk akses publik
    });

    await newPatients.save();

    return NextResponse.json(newPatients, { status: 201 });
  } catch (error) {
    console.error("Error creating patients:", error);
    return NextResponse.json({ error: "Failed to create patients" }, { status: 500 });
  }
}