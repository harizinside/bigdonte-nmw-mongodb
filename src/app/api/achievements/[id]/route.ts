import { connectToDatabase } from "@/lib/mongodb";
import Achievement from "@/models/achievements";
import { NextResponse } from "next/server";
import cloudinary from "@/lib/cloudinary"; 


// GET: Get achievement by ID
export async function GET(req: any, { params }: any) {
  await connectToDatabase();
  const achievement = await Achievement.findById(params.id);
  if (!achievement) return NextResponse.json({ message: "achievement not found" }, { status: 404 });
  return NextResponse.json(achievement, { status: 200 });
}

// PUT: Update achievement
export async function PUT(req: any, { params }: { params: { id: string } }) {
  await connectToDatabase();

  const { title, description, image, date } = await req.json();

  const existingAchievement = await Achievement.findById(params.id);
  if (!existingAchievement) {
    return NextResponse.json({ message: "Achievement not found" }, { status: 404 });
  }

  let finalImageUrl = existingAchievement.image; // Gunakan gambar lama jika tidak ada perubahan

  if (image && existingAchievement.image !== image) {
    try {
      // Hapus gambar lama jika ada
      const oldImageUrl = existingAchievement.image;
      const publicIdMatch = oldImageUrl.match(/\/v\d+\/achievements\/([^/.]+)/);
      const oldPublicId = publicIdMatch ? `achievements/${publicIdMatch[1]}` : null;

      if (oldPublicId) {
        console.log("Menghapus gambar lama dari Cloudinary:", oldPublicId);
        await cloudinary.uploader.destroy(oldPublicId);
      }

      // ✅ Pastikan URL baru benar-benar WebP
      finalImageUrl = image.replace("/upload/", "/upload/f_webp,q_auto/");

      console.log("Final WebP Image URL:", finalImageUrl);
    } catch (error) {
      console.error("Gagal menghapus atau mengubah gambar:", error);
    }
  }

  const updatedAchievement = await Achievement.findByIdAndUpdate(
    params.id,
    { title, description, date, image: finalImageUrl },
    { new: true }
  );

  return NextResponse.json(updatedAchievement, { status: 200 });
}

// DELETE: Delete Achievement
export async function DELETE(req: Request, { params }: { params: { id: string } }) {
  await connectToDatabase();

  console.log("Menghapus achievement dengan ID:", params.id);

  // Cari Achievement berdasarkan ID
  const achievement = await Achievement.findById(params.id);
  if (!achievement) {
    console.log("achievement tidak ditemukan di database.");
    return NextResponse.json({ message: "achievement not found" }, { status: 404 });
  }

  // Jika ada gambar, hapus dari Cloudinary
  if (achievement.image) {
    try {
      // Ambil public_id dari URL Cloudinary
      const imageUrl = achievement.image;
      const publicIdMatch = imageUrl.match(/\/v\d+\/achievements\/([^/.]+)/);
      const publicId = publicIdMatch ? `achievements/${publicIdMatch[1]}` : null;

      if (publicId) {
        console.log("Menghapus gambar dari Cloudinary:", publicId);
        await cloudinary.uploader.destroy(publicId);
      }
    } catch (error) {
      console.error("Gagal menghapus gambar dari Cloudinary:", error);
    }
  }

  // Hapus Achievement dari database
  await Achievement.findByIdAndDelete(params.id);

  console.log("Achievement berhasil dihapus.");
  return NextResponse.json({ message: "Achievement deleted successfully" }, { status: 200 });
}