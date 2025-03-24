import { connectToDatabase } from "@/lib/mongodb";
import Promo from "@/models/promo";
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
      const promos = await Promo.find({}).sort({ createdAt: -1 });

      return new NextResponse(JSON.stringify({
        promos,
        totalPromos: promos.length,
      }), { 
        status: 200,
        headers: { "Content-Type": "application/json" },
      });
    }

    // Jika `page` ada, jalankan pagination seperti biasa
    const page = parseInt(pageParam, 10);
    const totalPromos = await Promo.countDocuments();
    const promos = await Promo.find({})
      .skip((page - 1) * limit)
      .limit(limit)
      .sort({ createdAt: -1 });

    return new NextResponse(JSON.stringify({
      promos,
      currentPage: page,
      totalPages: Math.ceil(totalPromos / limit),
      totalPromos,
    }), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });

  } catch (error) {
    console.error("❌ Error fetching promos:", error);
    return new NextResponse(JSON.stringify({ message: "Gagal mengambil data promos." }), { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const authError = validateToken(request);
    if (authError) return authError;

    const formData = await request.formData();
    const title = formData.get("title") as string;
    const sk = formData.get("sk") as string;
    const start_date = formData.get("start_date") as string;
    const end_date = formData.get("end_date") as string;
    const link = formData.get("link") as string;
    const slug = formData.get("slug") as string;
    const imageFile = formData.get("image") as File;

    if (!imageFile) {
      return NextResponse.json({ error: "All fields are required" }, { status: 400 });
    }

    const timestamp = Date.now();
    const originalName = imageFile.name.replace(/\.(png|jpg|jpeg|svg|webp)$/i, ""); // Hapus ekstensi
    const fileName = `${timestamp}-${originalName}.webp`;
    const imagePath = path.join(process.cwd(), "public", "uploads", "promo",fileName);

    // Konversi gambar ke WebP menggunakan Sharp
    const imageByteData = await imageFile.arrayBuffer();
    const buffer = Buffer.from(imageByteData);
    await sharp(buffer)
      .webp({ quality: 80 }) // Kompresi ke WebP dengan kualitas 80%
      .toFile(imagePath);

    // Simpan ke MongoDB
    await connectToDatabase();
    const newPromo = new Promo({
      title,
      sk,
      start_date,
      end_date,
      link,
      slug,
      image: `/uploads/promo/${fileName}`, // Path relatif untuk akses publik
    });

    await newPromo.save();

    return NextResponse.json(newPromo, { status: 201 });
  } catch (error) {
    console.error("Error creating promo:", error);
    return NextResponse.json({ error: "Failed to create promo" }, { status: 500 });
  }
}