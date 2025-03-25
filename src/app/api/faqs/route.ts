import { connectToDatabase } from "@/lib/mongodb";
import Faq from "@/models/faqs";
import { validateToken } from "@/lib/auth";
import { NextRequest, NextResponse } from "next/server";

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
      const faqs = await Faq.find({}).sort({ createdAt: -1 });

      return new NextResponse(JSON.stringify({
        faqs,
        totalFaqs: faqs.length,
      }), { 
        status: 200,
        headers: { "Content-Type": "application/json" },
      });
    }

    // Jika `page` ada, jalankan pagination seperti biasa
    const page = parseInt(pageParam, 10);
    const totalFaqs = await Faq.countDocuments();
    const faqs = await Faq.find({})
      .skip((page - 1) * limit)
      .limit(limit)
      .sort({ createdAt: -1 });

    return new NextResponse(JSON.stringify({
      faqs,
      currentPage: page,
      totalPages: Math.ceil(totalFaqs / limit),
      totalFaqs,
    }), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });

  } catch (error) {
    console.error("❌ Error fetching faqs:", error);
    return new NextResponse(JSON.stringify({ message: "Gagal mengambil data faqs." }), { status: 500 });
  }
}

// POST: Create a new faq document
export async function POST(req: NextRequest) {
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

    const { question, answer } = requestBody;

    if (!question || !answer) {
      return NextResponse.json({ error: "All fields are required" }, { status: 400 });
    }

    // Save to MongoDB
    const newFaq = new Faq({ question, answer });
    await newFaq.save();
    
    return NextResponse.json(newFaq, { status: 201 });
  } catch (error) {
    console.error("❌ Error creating faq:", error);
    return NextResponse.json({ error: "Failed to create faq" }, { status: 500 });
  }
}