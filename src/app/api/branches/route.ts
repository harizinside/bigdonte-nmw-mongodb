import { NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/mongodb";
import Branchs from "@/models/branchs";

export async function GET(req: { url: string | URL; }) {
  await connectToDatabase();
  // const branches = await Branchs.find();
  // return NextResponse.json(branches);
  try {
    // Ambil query parameter `page`, default ke 1 jika tidak ada
    const { searchParams } = new URL(req.url);
    const page = parseInt(searchParams.get("page") || "1", 10);
    const limit = 15; // Jumlah data per halaman

    // Hitung total data
    const totalBranches = await Branchs.countDocuments();
    
    // Ambil data dengan pagination (skip & limit)
    const branches = await Branchs.find({})
      .skip((page - 1) * limit) // Lewati data sesuai halaman
      .limit(limit) // Batasi ke 15 data per halaman
      .sort({ createdAt: -1 }); // Urutkan dari terbaru

    // Hitung total halaman
    const totalPages = Math.ceil(totalBranches / limit);

    return NextResponse.json({
      branches,
      currentPage: page,
      totalPages,
      totalBranches,
    }, { status: 200 });

  } catch (error) {
    console.error("❌ Error fetching doctors:", error);
    return NextResponse.json({ message: "Gagal mengambil data dokter." }, { status: 500 });
  }
}

export async function POST(req: { json: () => PromiseLike<{ name: any; address: any; phone: any; location: any; operasional: any; image: any; }> | { name: any; address: any; phone: any; location: any; operasional: any; image: any; }; }) {
  try {
    await connectToDatabase();
    const { name, address, phone, location, operasional, image } = await req.json();

    // Validasi data agar tidak ada yang kosong
    if (!name || !address || !phone || !location || !operasional || !image) {
      return NextResponse.json({ message: "Semua field harus diisi!" }, { status: 400 });
    }

    const newBranch = new Branchs({ name, address, phone, location, operasional, image });
    await newBranch.save();

    return NextResponse.json(newBranch, { status: 201 });
  } catch (error: any) {
    console.error("Error di POST branches:", error.message);
    return NextResponse.json({ message: "Server error!", error: error.message }, { status: 500 });
  }
}

