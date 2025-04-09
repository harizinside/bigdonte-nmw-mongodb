import { connectToDatabase } from "@/lib/mongodb";
import Faq from "@/models/faqs";
import { NextResponse } from "next/server";
import { validateToken } from "@/lib/auth";

export const dynamic = "force-dynamic";

// GET: Get faq by ID
export async function GET(req: any, { params }: any) {
  const authError = validateToken(req);
  if (authError) return authError;

  await connectToDatabase();
  const faq = await Faq.findById(params.id);
  if (!faq) return NextResponse.json({ message: "Faq not found" }, { status: 404 });
  return NextResponse.json(faq, { status: 200 });
}

// PUT: Update doctor
export async function PUT(req: any, { params }: { params: { id: string } }) {
    const authError = validateToken(req);
    if (authError) return authError;
    await connectToDatabase();

    const { question, answer } = await req.json();

    const existingFaq = await Faq.findById(params.id);
    if (!existingFaq) {
        return NextResponse.json({ message: "Faq not found" }, { status: 404 });
    }

    const updatedFaq = await Faq.findByIdAndUpdate(
        params.id,
        { question, answer },
        { new: true }
    );

    return NextResponse.json(updatedFaq, { status: 200 });
}

// DELETE: Delete faq
export async function DELETE(req: Request, { params }: { params: { id: string } }) {
  const authError = validateToken(req);
  if (authError) return authError;
  await connectToDatabase();

  // Cari faq berdasarkan ID
  const faq = await Faq.findById(params.id);
  if (!faq) {
    console.log("faq tidak ditemukan di database.");
    return NextResponse.json({ message: "faq not found" }, { status: 404 });
  }

  // Hapus faq dari database
  await Faq.findByIdAndDelete(params.id);

  console.log("Faq berhasil dihapus.");
  return NextResponse.json({ message: "Faq deleted successfully" }, { status: 200 });
}