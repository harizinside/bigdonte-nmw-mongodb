import { connectToDatabase } from "@/lib/mongodb";
import Subscriber from "@/models/subscribers";
import { NextResponse } from "next/server";
import { validateToken } from "@/lib/auth";

export async function DELETE(req: Request, { params }: { params: { id: string } }) {
  const authError = validateToken(req);
  if (authError) return authError;
  await connectToDatabase();

  console.log("Menghapus Subscriber dengan ID:", params.id);

  // Cari Subscriber berdasarkan ID
  const subscriber = await Subscriber.findById(params.id);
  if (!subscriber) {
    console.log("Subscriber tidak ditemukan di database.");
    return NextResponse.json({ message: "Subscriber not found" }, { status: 404 });
  }

  // Hapus Subscriber dari database
  await Subscriber.findByIdAndDelete(params.id);

  console.log("Subscriber berhasil dihapus.");
  return NextResponse.json({ message: "Subscriber deleted successfully" }, { status: 200 });
}