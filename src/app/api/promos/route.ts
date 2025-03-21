// import { NextRequest, NextResponse } from "next/server";

// export const dynamic = "force-dynamic";

// export async function GET(req: Request) {
//   try {
//     const { searchParams } = new URL(req.url);
//     const page = searchParams.get("page") || "1";

//     const response = await fetch(`https://nmw.prahwa.net/api/promo?page=${page}`);

//     if (!response.ok) {
//       return NextResponse.json({ message: `Error: ${response.statusText}` }, { status: response.status });
//     }

//     const data = await response.json();

//     // Perbaikan: Ubah URL gambar menjadi absolute URL
//     data.data.forEach((promo: { image: string; }) => {
//       promo.image = `https://nmw.prahwa.net/storage/${promo.image}`;
//     });

//     return NextResponse.json({
//       data: data.data,
//       pagination: {
//         currentPage: data.meta?.current_page || 1,
//         totalPages: data.meta?.last_page || 1,
//         perPage: data.meta?.per_page || 10,
//         total: data.meta?.total || 0,
//         links: data.links || [],
//       },
//     }, { status: 200 });
//   } catch (error) {
//     console.error("Error fetching promo:", error);
//     return NextResponse.json({ message: "Failed to fetch promo" }, { status: 500 });
//   }
// }

import { connectToDatabase } from "@/lib/mongodb";
import Promo from "@/models/promo";
import { NextResponse } from "next/server";
import { validateToken } from "@/lib/auth";
import path from "path";
import sharp from "sharp";

// GET: Fetch all doctor
export async function GET(req: { url: string | URL; }) {
  const authError = validateToken(req);
  if (authError) return authError;
  await connectToDatabase();
  
  try {
    // Ambil query parameter `page`, default ke 1 jika tidak ada
    const { searchParams } = new URL(req.url);
    const page = parseInt(searchParams.get("page") || "1", 10);
    const limit = 15; // Jumlah data per halaman

    // Hitung total data
    const totalPromo = await Promo.countDocuments();
    
    // Ambil data dengan pagination (skip & limit)
    const promo = await Promo.find({})
      .skip((page - 1) * limit) // Lewati data sesuai halaman
      .limit(limit) // Batasi ke 15 data per halaman
      .sort({ createdAt: -1 }); // Urutkan dari terbaru

    // Hitung total halaman
    const totalPages = Math.ceil(totalPromo / limit);

    return NextResponse.json({
      promo, 
      currentPage: page,
      totalPages,
      totalPromo,
    }, { status: 200 });

  } catch (error) {
    console.error("❌ Error fetching promo:", error);
    return NextResponse.json({ message: "Gagal mengambil data promo." }, { status: 500 });
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