import { connectToDatabase } from "@/lib/mongodb";
import Subscriber from "@/models/subscribers";
import { NextResponse } from "next/server";
import { validateToken } from "@/lib/auth";

// GET: Fetch all Subscriber documents
export async function GET(req: Request) {
  const authError = validateToken(req);
  if (authError) return authError;

  await connectToDatabase();

  try {
    const { searchParams } = new URL(req.url);
    const page = parseInt(searchParams.get("page") || "1", 10);
    const limit = 15;

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
    console.error("❌ Error fetching subscriber:", error);
    return new NextResponse(JSON.stringify({ message: "Gagal mengambil data subscriber." }), { status: 500 });
  }
}

// POST: Create a new subscriber document
export async function POST(req: { json: () => PromiseLike<{ email: any;}> | { email: any;}; }) {
  try {
    const authError = validateToken(req);
    if (authError) return authError;
    await connectToDatabase();

    let requestBody;
    try {
      requestBody = await req.json();
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
      return NextResponse.json({ error: "email sudah terdaftar" }, { status: 400 });
    }

    // Save to MongoDB
    const newSubscriber = new Subscriber({
      email,
    });

    await newSubscriber.save();
    
    return NextResponse.json(newSubscriber, { status: 201 });
  } catch (error) {
    console.error("❌ Error creating subscriber:", error);
    return NextResponse.json({ error: "Failed to create subscriber" }, { status: 500 });
  }
}