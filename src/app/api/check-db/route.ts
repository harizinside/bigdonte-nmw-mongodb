import { connectToDatabase } from "@/lib/mongodb";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    await connectToDatabase();
    return NextResponse.json({ message: "✅ MongoDB connected!" }, { status: 200 });
  } catch (error) {
    return NextResponse.json({ message: "❌ MongoDB connection failed!" }, { status: 500 });
  }
}