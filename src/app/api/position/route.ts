import { connectToDatabase } from "@/lib/mongodb";
import Position from "@/models/position";
import { NextRequest, NextResponse } from "next/server";
import { validateToken } from "@/lib/auth";

export async function GET(req: NextRequest) {
  try {
    const authError = validateToken(req);
    if (authError) return authError;

    await connectToDatabase();

    const positionDocs = await Position.find({});
    return NextResponse.json(positionDocs, { status: 200 });
  } catch (error) {
    console.error("❌ Error fetching position:", error);
    return NextResponse.json({ message: "Failed to fetch position data." }, { status: 500 });
  }
}

export async function POST(request: Request) {
    try {
      const authError = validateToken(request);
      if (authError) return authError;
  
      const formData = await request.formData();
      const title = formData.get("title") as string;
  
      if (!title) {
        return NextResponse.json({ error: "All fields are required" }, { status: 400 });
      }
  
      // Simpan ke MongoDB
      await connectToDatabase();
      const newPosition = new Position({
        title,
      });
  
      await newPosition.save();
  
      return NextResponse.json(newPosition, { status: 201 });
    } catch (error) {
      console.error("Error creating position:", error);
      return NextResponse.json({ error: "Failed to create position" }, { status: 500 });
    }
  }