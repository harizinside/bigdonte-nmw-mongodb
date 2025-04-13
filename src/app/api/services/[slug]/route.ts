import { connectToDatabase } from "@/lib/mongodb";
import Services from "@/models/services";
import ServicesList from "@/models/servicesList";
import ServicesType from "@/models/servicesType";
import Patient from "@/models/patients";
import { NextResponse } from "next/server";
import { validateToken } from "@/lib/auth";
import path from "path";
import fs from "fs/promises";
import sharp from "sharp";
import mongoose from "mongoose";

export const dynamic = "force-dynamic";

export async function GET(req: Request, { params }: { params: { slug: string } }) {
  const authError = validateToken(req);
  if (authError) return authError;

  await connectToDatabase();

  try {
    const { slug } = params;
    let services;

    if (mongoose.Types.ObjectId.isValid(slug)) {
      // Jika slug adalah ObjectId yang valid, cari berdasarkan _id
      services = await Services.findById(slug);
    } else {
      // Jika bukan ObjectId, cari berdasarkan slug
      services = await Services.findOne({ slug });
    }

    if (!services) {
      return NextResponse.json({ message: "Services not found" }, { status: 404 });
    }

    return NextResponse.json(services, { status: 200 });

  } catch (error) {
    console.error("❌ Error fetching services:", error);
    return NextResponse.json({ message: "Internal Server Error" }, { status: 500 });
  }
}

export async function PUT(req: any, { params }: any) { 
  const authError = validateToken(req);
  if (authError) return authError;

  await connectToDatabase();

  const formData = await req.formData();
  const name = formData.get("name") as string;
  const slug = formData.get("slug") as string;
  const description = formData.get("description") as string;
  const keywords = formData.getAll("keywords") as string[];
  const phone = formData.get("phone") as string;
  const template = formData.get("template") === "1";
  const imageFileBanner = formData.get("imageBanner") as File;
  const imageFileCover = formData.get("imageCover") as File;

  const existingServices = await Services.findOne({ slug: params.slug });
  if (!existingServices) {
    return NextResponse.json({ message: "Services not found" }, { status: 404 });
  }

  let finalImageUrl = existingServices.imageBanner; 
  let finalImageCoverUrl = existingServices.imageCover; 

  if (imageFileBanner) {
    try {
      // Hapus gambar lama jika ada
      if (existingServices.imageBanner) {
        const oldImagePath = path.join(process.cwd(), "public", existingServices.imageBanner);
        console.log("Menghapus gambar lama:", oldImagePath);
        await fs.access(oldImagePath); // Periksa apakah file ada
        await fs.unlink(oldImagePath); // Hapus file
      }

      // Simpan gambar baru
      const timestamp = Date.now();
      const originalName = imageFileBanner.name.replace(/\.(png|jpg|jpeg|svg|webp)$/i, ""); // Hapus ekstensi
      const fileName = `${timestamp}-${originalName}.webp`; // Simpan sebagai WebP
      const newImagePath = path.join(process.cwd(), "public", "uploads", "services",fileName);

      // Konversi gambar ke WebP menggunakan Sharp
      const imageByteData = await imageFileBanner.arrayBuffer();
      const buffer = Buffer.from(imageByteData);
      await sharp(buffer)
        .webp({ quality: 80 }) // Kompresi ke WebP dengan kualitas 80%
        .toFile(newImagePath);

      finalImageUrl = `/uploads/services/${fileName}`; // Path relatif untuk akses publik
      console.log("Gambar baru berhasil disimpan:", finalImageUrl);
    } catch (error) {
      console.error("Gagal menghapus atau mengunggah gambar baru:", error);
    }
  }

  if (imageFileCover) {
    try {
      // Hapus gambar lama jika ada
      if (existingServices.imageCover) {
        const oldImagePath = path.join(process.cwd(), "public", existingServices.imageCover);
        console.log("Menghapus gambar lama:", oldImagePath);
        await fs.access(oldImagePath); // Periksa apakah file ada
        await fs.unlink(oldImagePath); // Hapus file
      }

      // Simpan gambar baru
      const timestamp = Date.now();
      const originalNameCover = imageFileCover.name.replace(/\.(png|jpg|jpeg|svg|webp)$/i, ""); // Hapus ekstensi
      const fileNameCover = `${timestamp}-${originalNameCover}.webp`; // Simpan sebagai WebP
      const newImagePathCover = path.join(process.cwd(), "public", "uploads", "services", fileNameCover);

      // Konversi gambar ke WebP menggunakan Sharp
      const imageByteDataCover = await imageFileCover.arrayBuffer();
      const bufferCover = Buffer.from(imageByteDataCover);
      await sharp(bufferCover)
        .webp({ quality: 80 }) // Kompresi ke WebP dengan kualitas 80%
        .toFile(newImagePathCover);

      finalImageCoverUrl = `/uploads/services/${fileNameCover}`; // Path relatif untuk akses publik
      console.log("Gambar baru berhasil disimpan:", finalImageCoverUrl);
    } catch (error) {
      console.error("Gagal menghapus atau mengunggah gambar baru:", error);
    }
  }

  // Perbarui data Achievement di database
  const updatedServices = await Services.findOneAndUpdate(
    { slug: params.slug }, // Query berdasarkan slug
    { name, description, keywords, phone, slug, template, imageBanner: finalImageUrl, imageCover: finalImageCoverUrl },
    { new: true }
  );  

  return NextResponse.json(updatedServices, { status: 200 });
}

export async function DELETE(req: Request, { params }: any) {
  const authError = validateToken(req);
  if (authError) return authError;

  await connectToDatabase();

  // Cari Service berdasarkan slug
  const services = await Services.findOne({ slug: params.slug });
  if (!services) {
    console.log("services tidak ditemukan di database.");
    return NextResponse.json({ message: "services not found" }, { status: 404 });
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

  // Hapus gambar dari `services`
  if (services.imageBanner) await deleteImage(services.imageBanner);
  if (services.imageCover) await deleteImage(services.imageCover);

  // Cari semua `servicesList` yang terkait
  const servicesLists = await ServicesList.find({ id_services: services._id });
  for (const item of servicesLists) {
    if (item.imageBanner) await deleteImage(item.imageBanner);
    if (item.imageCover) await deleteImage(item.imageCover);
  }

  // Cari semua `servicesType` yang terkait
  const servicesTypes = await ServicesType.find({ id_services: services._id });
  for (const item of servicesTypes) {
    if (item.image) await deleteImage(item.image);
  }
  const patients = await Patient.find({ id_services: services._id });
  for (const item of patients) {
    if (item.image) await deleteImage(item.image);
    if (item.imageSecond) await deleteImage(item.imageimageSecond);
  }

  // Hapus data terkait dari database
  await ServicesList.deleteMany({ id_services: services._id });
  await ServicesType.deleteMany({ id_services: services._id });
  await Patient.deleteMany({ id_services: services._id });
  await Services.findOneAndDelete({ slug: params.slug });

  console.log("services dan semua data serta gambar terkait berhasil dihapus.");
  return NextResponse.json({ message: "services and related data deleted successfully" }, { status: 200 });
}