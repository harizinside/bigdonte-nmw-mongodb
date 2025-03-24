import { connectToDatabase } from "@/lib/mongodb";
import ServicesType from "@/models/servicesType";
import Patient from "@/models/patients";
import { NextResponse } from "next/server";
import { validateToken } from "@/lib/auth";
import path from "path";
import fs from "fs/promises";
import sharp from "sharp";

export async function GET(req: any, { params }: any) {
//   const authError = validateToken(req);
//   if (authError) return authError; 

  await connectToDatabase();

  const servicesType = await ServicesType.findOne({ slug: params.slug });

  if (!servicesType) {
    return NextResponse.json({ message: "Services type not found" }, { status: 404 });
  }

  return NextResponse.json(servicesType, { status: 200 });
}

export async function PUT(req: any, { params }: any) { 
  const authError = validateToken(req);
  if (authError) return authError;

  await connectToDatabase();

  const formData = await req.formData();
  const name = formData.get("name") as string;
  const slug = formData.get("slug") as string;
  const description = formData.get("description") as string;
  const imageFileBanner = formData.get("image") as File;

  const existingServicesType = await ServicesType.findOne({ slug: params.slug });
  if (!existingServicesType) {
    return NextResponse.json({ message: "Services not found" }, { status: 404 });
  }

  let finalImageUrl = existingServicesType.image; 

  if (imageFileBanner) {
    try {
      // Hapus gambar lama jika ada
      if (existingServicesType.image) {
        const oldImagePath = path.join(process.cwd(), "public", existingServicesType.image);
        console.log("Menghapus gambar lama:", oldImagePath);
        await fs.access(oldImagePath); // Periksa apakah file ada
        await fs.unlink(oldImagePath); // Hapus file
      }

      // Simpan gambar baru
      const timestamp = Date.now();
      const originalName = imageFileBanner.name.replace(/\.(png|jpg|jpeg|svg|webp)$/i, ""); // Hapus ekstensi
      const fileName = `${timestamp}-${originalName}.webp`; // Simpan sebagai WebP
      const newImagePath = path.join(process.cwd(), "public", "uploads", "services-type",fileName);

      // Konversi gambar ke WebP menggunakan Sharp
      const imageByteData = await imageFileBanner.arrayBuffer();
      const buffer = Buffer.from(imageByteData);
      await sharp(buffer)
        .webp({ quality: 80 }) // Kompresi ke WebP dengan kualitas 80%
        .toFile(newImagePath);

      finalImageUrl = `/uploads/services-type/${fileName}`; // Path relatif untuk akses publik
      console.log("Gambar baru berhasil disimpan:", finalImageUrl);
    } catch (error) {
      console.error("Gagal menghapus atau mengunggah gambar baru:", error);
    }
  }

  // Perbarui data Achievement di database
  const updatedServices = await ServicesType.findOneAndUpdate(
    { slug: params.slug }, // Query berdasarkan slug
    { name, description, slug, image: finalImageUrl },
    { new: true }
  );  

  return NextResponse.json(updatedServices, { status: 200 });
}

export async function DELETE(req: Request, { params }: any) {
  const authError = validateToken(req);
  if (authError) return authError;

  await connectToDatabase();

  // Cari ServicesType berdasarkan slug
  const servicesType = await ServicesType.findOne({ slug: params.slug });
  if (!servicesType) {
    console.log("servicesType tidak ditemukan di database.");
    return NextResponse.json({ message: "servicesType not found" }, { status: 404 });
  }

  // Fungsi untuk menghapus gambar dari direktori
  const deleteImage = async (imagePath: string) => {
    if (!imagePath) return;
    try {
      const fullPath = path.join(process.cwd(), "public", imagePath);
      console.log("Menghapus gambar:", fullPath);
      await fs.access(fullPath);
      await fs.unlink(fullPath);
    } catch (error) {
      console.error("Gagal menghapus gambar:", error);
    }
  };

  // Hapus gambar servicesType jika ada
  if (servicesType.image) await deleteImage(servicesType.image);

  // Cari semua Patient yang terkait
  const patients = await Patient.find({ id_servicesType: servicesType._id });

  // Hapus gambar yang terkait dalam Patient
  for (const item of patients) {
    if (item.image) await deleteImage(item.image);
    if (item.imageSecond) await deleteImage(item.imageSecond);
  }

  // Hapus semua Patient yang terkait dengan servicesType
  await Patient.deleteMany({ id_servicesType: servicesType._id });

  // Hapus servicesType dari database
  await ServicesType.findOneAndDelete({ slug: params.slug });

  console.log("servicesType dan semua data terkait berhasil dihapus.");
  return NextResponse.json({ message: "servicesType and related data deleted successfully" }, { status: 200 });
}