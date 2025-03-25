import { connectToDatabase } from "@/lib/mongodb";
import Social from "@/models/socialMedia";
import { NextRequest, NextResponse } from "next/server";
import { validateToken } from "@/lib/auth";
import path from "path";
import sharp from "sharp";
import mongoose from "mongoose";

// GET: Fetch all doctors
export async function GET(req: NextRequest) {
  const authError = validateToken(req);
  if (authError) return authError;

  await connectToDatabase();

  try {
    const socialDocs = await Social.find({});
    return NextResponse.json(socialDocs, { status: 200 });
  } catch (error) {
    console.error("❌ Error fetching social:", error);
    return NextResponse.json({ message: "Failed to fetch social data." }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const authError = validateToken(request);
    if (authError) return authError;

    const formData = await request.formData();
    const title = formData.get("title") as string;
    const link = formData.get("link") as string;
    const icon = formData.get("icon") as string;

    // Simpan ke MongoDB
    await connectToDatabase();
    const newSocial = new Social({
      icon,
      link,
      title,
    });

    await newSocial.save();

    return NextResponse.json(newSocial, { status: 201 });
  } catch (error) {
    console.error("Error creating social:", error);
    return NextResponse.json({ error: "Failed to create social" }, { status: 500 });
  }
}