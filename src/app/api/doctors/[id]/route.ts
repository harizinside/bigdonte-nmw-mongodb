import { connectToDatabase } from "@/lib/mongodb";
import Doctor from "@/models/doctors";
import { NextResponse } from "next/server";
import cloudinary from "@/lib/cloudinary"; 


// GET: Get doctor by ID
export async function GET(req: any, { params }: any) {
  await connectToDatabase();
  const doctor = await Doctor.findById(params.id);
  if (!doctor) return NextResponse.json({ message: "Doctor not found" }, { status: 404 });
  return NextResponse.json(doctor, { status: 200 });
}

// PUT: Update doctor
export async function PUT(req: any, { params }: { params: { id: string } }) {
  await connectToDatabase();

  const { name, position, image } = await req.json();

  const existingDoctor = await Doctor.findById(params.id);
  if (!existingDoctor) {
    return NextResponse.json({ message: "Doctor not found" }, { status: 404 });
  }

  let finalImageUrl = existingDoctor.image; // Gunakan gambar lama jika tidak ada perubahan

  if (image && existingDoctor.image !== image) {
    try {
      // Hapus gambar lama jika ada
      const oldImageUrl = existingDoctor.image;
      const publicIdMatch = oldImageUrl.match(/\/v\d+\/doctors\/([^/.]+)/);
      const oldPublicId = publicIdMatch ? `doctors/${publicIdMatch[1]}` : null;

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

  const updatedDoctor = await Doctor.findByIdAndUpdate(
    params.id,
    { name, position, image: finalImageUrl },
    { new: true }
  );

  return NextResponse.json(updatedDoctor, { status: 200 });
}

// DELETE: Delete doctor
export async function DELETE(req: Request, { params }: { params: { id: string } }) {
  await connectToDatabase();

  console.log("Menghapus dokter dengan ID:", params.id);

  // Cari dokter berdasarkan ID
  const doctor = await Doctor.findById(params.id);
  if (!doctor) {
    console.log("Doctor tidak ditemukan di database.");
    return NextResponse.json({ message: "Doctor not found" }, { status: 404 });
  }

  // Jika ada gambar, hapus dari Cloudinary
  if (doctor.image) {
    try {
      // Ambil public_id dari URL Cloudinary
      const imageUrl = doctor.image;
      const publicIdMatch = imageUrl.match(/\/v\d+\/doctors\/([^/.]+)/);
      const publicId = publicIdMatch ? `doctors/${publicIdMatch[1]}` : null;

      if (publicId) {
        console.log("Menghapus gambar dari Cloudinary:", publicId);
        await cloudinary.uploader.destroy(publicId);
      }
    } catch (error) {
      console.error("Gagal menghapus gambar dari Cloudinary:", error);
    }
  }

  // Hapus dokter dari database
  await Doctor.findByIdAndDelete(params.id);

  console.log("Dokter berhasil dihapus.");
  return NextResponse.json({ message: "Doctor deleted successfully" }, { status: 200 });
}