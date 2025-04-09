import { connectToDatabase } from "@/lib/mongodb";
import Position from "@/models/position";
import { NextResponse } from "next/server";
import { validateToken } from "@/lib/auth";

export const dynamic = "force-dynamic";

export async function GET(req: any, { params }: any) {
  const authError = validateToken(req);
  if (authError) return authError;

  await connectToDatabase();
  const position = await Position.findById(params.id);
  if (!position) return NextResponse.json({ message: "position not found" }, { status: 404 });
  return NextResponse.json(position, { status: 200 });
}

export async function PUT(req: any, { params }: { params: { id: string } }) {
  try {
    const authError = validateToken(req);
    if (authError) return authError;
    await connectToDatabase();

    const formData = await req.formData();
    const title = formData.get("title") as string;

    if (!title) {
      return NextResponse.json({ error: "All fields are required" }, { status: 400 });
    }

    // Update the existing document by ID
    const updatedPosition = await Position.findByIdAndUpdate(
      params.id,
      { title },
      { new: true }
    );

    if (!updatedPosition) {
      return NextResponse.json({ error: "position document not found" }, { status: 404 });
    }

    return NextResponse.json(updatedPosition, { status: 200 });
  } catch (error) {
    console.error("❌ Error updating position:", error);
    return NextResponse.json({ error: "Failed to update position" }, { status: 500 });
  }
}

export async function DELETE(req: Request, { params }: { params: { id: string } }) {
  const authError = validateToken(req);
  if (authError) return authError;
  await connectToDatabase();

  // Cari Subscriber berdasarkan ID
  const position = await Position.findById(params.id);
  if (!position) {
    console.log("Position tidak ditemukan di database.");
    return NextResponse.json({ message: "Position not found" }, { status: 404 });
  }

  // Hapus position dari database
  await Position.findByIdAndDelete(params.id);
  return NextResponse.json({ message: "Position deleted successfully" }, { status: 200 });
}