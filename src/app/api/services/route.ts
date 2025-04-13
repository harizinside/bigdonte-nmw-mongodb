import { connectToDatabase } from "@/lib/mongodb";
import Services from "@/models/services";
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
      const services = await Services.find({}).sort({ createdAt: -1 });

      return new NextResponse(JSON.stringify({
        services, 
        totalServices: services.length,
      }), { 
        status: 200,
        headers: { "Content-Type": "application/json" },
      });
    }

    // Jika `page` ada, jalankan pagination seperti biasa
    const page = parseInt(pageParam, 10);
    const totalServices = await Services.countDocuments();
    const services = await Services.find({})
      .skip((page - 1) * limit)
      .limit(limit)
      .sort({ createdAt: -1 });

    return new NextResponse(JSON.stringify({
      services,
      currentPage: page,
      totalPages: Math.ceil(totalServices / limit),
      totalServices,
    }), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });

  } catch (error) {
    console.error("❌ Error fetching services:", error);
    return new NextResponse(JSON.stringify({ message: "Gagal mengambil data services." }), { status: 500 });
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
    const phone = formData.get("phone") as string;
    const template = formData.get("template") === "1"; 
    const imageFileBanner = formData.get("imageBanner") as File;
    const imageFileCover = formData.get("imageCover") as File;

    if (!name || !description || !phone || 
        template === null || template === undefined || !imageFileBanner || !imageFileCover) {
      return NextResponse.json({ error: "All fields are required" }, { status: 400 });
    }
  
    let count = 1;
    let baseSlug = slug; // Simpan slug awal
    while (await Services.findOne({ slug })) {
      count++;
      slug = `${baseSlug}-${count}`;
    }

    let countTitle = 1;
    let baseName = name; // Simpan nama awal
    while (await Services.findOne({ name })) {
      countTitle++;
      name = `${baseName} ${countTitle}`;
    }

    const timestamp = Date.now();
    const originalName = imageFileBanner.name.replace(/\.(png|jpg|jpeg|svg|webp)$/i, ""); // Hapus ekstensi
    const fileName = `${timestamp}-${originalName}.webp`;
    const imagePath = path.join(process.cwd(), "public", "uploads", "services",fileName);

    // Konversi gambar ke WebP menggunakan Sharp
    const imageByteData = await imageFileBanner.arrayBuffer();
    const buffer = Buffer.from(imageByteData);
    await sharp(buffer)
      .webp({ quality: 80 }) // Kompresi ke WebP dengan kualitas 80%
      .toFile(imagePath);

    const originalNameCover = imageFileCover.name.replace(/\.(png|jpg|jpeg|svg|webp)$/i, ""); // Hapus ekstensi
    const fileNameCover = `${timestamp}-${originalNameCover}.webp`;
    const imagePathCover = path.join(process.cwd(), "public", "uploads", "services",fileNameCover);

    // Konversi gambar ke WebP menggunakan Sharp
    const imageByteDataCover = await imageFileCover.arrayBuffer();
    const bufferCover = Buffer.from(imageByteDataCover);
    await sharp(bufferCover)
      .webp({ quality: 80 }) // Kompresi ke WebP dengan kualitas 80%
      .toFile(imagePathCover);

    // Simpan ke MongoDB
    await connectToDatabase();
    const newServices = new Services({
      name,
      slug,
      description,
      keywords,
      phone,
      template,
      imageBanner: `/uploads/services/${fileName}`, // Path relatif untuk akses publik
      imageCover: `/uploads/services/${fileNameCover}`, // Path relatif untuk akses publik
    });

    await newServices.save();

    return NextResponse.json(newServices, { status: 201 });
  } catch (error) {
    console.error("Error creating services:", error);
    return NextResponse.json({ error: "Failed to create services" }, { status: 500 });
  }
}