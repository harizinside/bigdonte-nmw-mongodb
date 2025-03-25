import { connectToDatabase } from "@/lib/mongodb";
import Subscriber from "@/models/subscribers";
import { NextRequest, NextResponse } from "next/server";
import { validateToken } from "@/lib/auth";

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
      const subscribers = await Subscriber.find({}).sort({ createdAt: -1 });

      return new NextResponse(JSON.stringify({
        subscribers,
        totalSubscribers: subscribers.length,
      }), { 
        status: 200,
        headers: { "Content-Type": "application/json" },
      });
    }

    // Jika `page` ada, jalankan pagination seperti biasa
    const page = parseInt(pageParam, 10);
    const totalSubscribers = await Subscriber.countDocuments();
    const subscribers = await Subscriber.find({})
      .skip((page - 1) * limit)
      .limit(limit)
      .sort({ createdAt: -1 });

    return new NextResponse(JSON.stringify({
      subscribers,
      currentPage: page,
      totalPages: Math.ceil(totalSubscribers / limit),
      totalSubscribers,
    }), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });

  } catch (error) {
    console.error("❌ Error fetching subscribers:", error);
    return new NextResponse(JSON.stringify({ message: "Gagal mengambil data subscribers." }), { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const authError = validateToken(req);
    if (authError) return authError;

    await connectToDatabase();

    let requestBody;
    try {
      requestBody = await req.json(); // ✅ `NextRequest` mendukung `.json()`
    } catch (jsonError) {
      console.error("❌ Error parsing JSON:", jsonError);
      return NextResponse.json({ error: "Invalid JSON format" }, { status: 400 });
    }

    const { email } = requestBody;

    if (!email) {
      return NextResponse.json({ error: "All fields are required" }, { status: 400 });
    }

    // Check if email already exists
    const existingSubscriber = await Subscriber.findOne({ email });
    if (existingSubscriber) {
      return NextResponse.json({ error: "Email sudah terdaftar" }, { status: 400 });
    }

    // Save to MongoDB
    const newSubscriber = new Subscriber({ email });
    await newSubscriber.save();

    return NextResponse.json(newSubscriber, { status: 201 });
  } catch (error) {
    console.error("❌ Error creating subscriber:", error);
    return NextResponse.json({ error: "Failed to create subscriber" }, { status: 500 });
  }
}