import { connectToDatabase } from "@/lib/mongodb";
import Branchs from "@/models/branchs";
import { NextResponse } from "next/server";
import cloudinary from "@/lib/cloudinary"; 

// GET: Get branches by ID
export async function GET(req: any, { params }: any) {
  await connectToDatabase();
  const branches = await Branchs.findById(params.id);
  if (!branches) return NextResponse.json({ message: "Branches not found" }, { status: 404 });
  return NextResponse.json(branches, { status: 200 });
}

// PUT: Update branches
export async function PUT(req: any, { params }: { params: { id: string } }) {
  await connectToDatabase();

  const { name, address, phone, location, operasional, image } = await req.json();

  // Ambil data branch lama sebelum diupdate
  const existingBranch = await Branchs.findById(params.id);
  if (!existingBranch) {
    return NextResponse.json({ message: "Branch not found" }, { status: 404 });
  }

  // Jika ada perubahan gambar, hapus gambar lama dari Cloudinary
  if (image && existingBranch.image !== image) {
    try {
      const oldImageUrl = existingBranch.image;
      const publicIdMatch = oldImageUrl.match(/\/v\d+\/branches\/([^/.]+)/);
      const oldPublicId = publicIdMatch ? `branches/${publicIdMatch[1]}` : null;

      if (oldPublicId) {
        console.log("Menghapus gambar lama dari Cloudinary:", oldPublicId);
        await cloudinary.uploader.destroy(oldPublicId);
      }
    } catch (error) {
      console.error("Gagal menghapus gambar lama dari Cloudinary:", error);
    }
  }

  // Update data branch dengan gambar baru atau lama
  const updatedBranch = await Branchs.findByIdAndUpdate(
    params.id,
    { name, address, phone, location, operasional, image },
    { new: true }
  );

  return NextResponse.json(updatedBranch, { status: 200 });
}

// DELETE: Delete branch
export async function DELETE(req: Request, { params }: { params: { id: string } }) {
  await connectToDatabase();

  console.log("Menghapus branch dengan ID:", params.id);

  // Cari branch berdasarkan ID
  const branches = await Branchs.findById(params.id);
  if (!branches) {
    console.log("Branches tidak ditemukan di database.");
    return NextResponse.json({ message: "Branches not found" }, { status: 404 });
  }

  // Jika ada gambar, hapus dari Cloudinary
  if (branches.image) {
    try {
      // Ambil public_id dari URL Cloudinary
      const imageUrl = branches.image;
      const publicIdMatch = imageUrl.match(/\/v\d+\/branches\/([^/.]+)/);
      const publicId = publicIdMatch ? `branches/${publicIdMatch[1]}` : null;

      if (publicId) {
        console.log("Menghapus gambar dari Cloudinary:", publicId);
        await cloudinary.uploader.destroy(publicId);
      }
    } catch (error) {
      console.error("Gagal menghapus gambar dari Cloudinary:", error);
    }
  }

  // Hapus branch dari database
  await Branchs.findByIdAndDelete(params.id);

  console.log("Branch berhasil dihapus.");
  return NextResponse.json({ message: "Branch deleted successfully" }, { status: 200 });
}