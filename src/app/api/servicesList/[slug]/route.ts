import { connectToDatabase } from "@/lib/mongodb";
import ServicesList from "@/models/servicesList";
import ServicesType from "@/models/servicesType";
import Patient from "@/models/patients";
import { NextResponse } from "next/server";
import { validateToken } from "@/lib/auth";
import path from "path";
import fs from "fs/promises";
import sharp from "sharp";

export const dynamic = "force-dynamic";

export async function GET(req: any, { params }: any) {
  const authError = validateToken(req);
  if (authError) return authError; 

  await connectToDatabase();

  const servicesList = await ServicesList.findOne({ slug: params.slug });

  if (!servicesList) {
    return NextResponse.json({ message: "Services list not found" }, { status: 404 });
  }

  return NextResponse.json(servicesList, { status: 200 });
}

export async function PUT(req: any, { params }: any) { 
  const authError = validateToken(req);
  if (authError) return authError;

  await connectToDatabase();

  const formData = await req.formData();
  const name = formData.get("name") as string;
  const slug = formData.get("slug") as string;
  const description = formData.get("description") as string;
  const sensitive_content = formData.get("sensitive_content") === "1";
  const imageFileBanner = formData.get("imageBanner") as File;
  const imageFileCover = formData.get("imageCover") as File;

  const existingServicesList = await ServicesList.findOne({ slug: params.slug });
  if (!existingServicesList) {
    return NextResponse.json({ message: "Services not found" }, { status: 404 });
  }

  let finalImageUrl = existingServicesList.imageBanner; 
  let finalImageCoverUrl = existingServicesList.imageCover; 

  if (imageFileBanner) {
    try {
      // Hapus gambar lama jika ada
      if (existingServicesList.imageBanner) {
        const oldImagePath = path.join(process.cwd(), "public", existingServicesList.imageBanner);
        console.log("Menghapus gambar lama:", oldImagePath);
        await fs.access(oldImagePath); // Periksa apakah file ada
        await fs.unlink(oldImagePath); // Hapus file
      }

      // Simpan gambar baru
      const timestamp = Date.now();
      const originalName = imageFileBanner.name.replace(/\.(png|jpg|jpeg|svg|webp)$/i, ""); // Hapus ekstensi
      const fileName = `${timestamp}-${originalName}.webp`; // Simpan sebagai WebP
      const newImagePath = path.join(process.cwd(), "public", "uploads", "services-list",fileName);

      // Konversi gambar ke WebP menggunakan Sharp
      const imageByteData = await imageFileBanner.arrayBuffer();
      const buffer = Buffer.from(imageByteData);
      await sharp(buffer)
        .webp({ quality: 80 }) // Kompresi ke WebP dengan kualitas 80%
        .toFile(newImagePath);

      finalImageUrl = `/uploads/services-list/${fileName}`; // Path relatif untuk akses publik
      console.log("Gambar baru berhasil disimpan:", finalImageUrl);
    } catch (error) {
      console.error("Gagal menghapus atau mengunggah gambar baru:", error);
    }
  }

  if (imageFileCover) {
    try {
      // Hapus gambar lama jika ada
      if (existingServicesList.imageCover) {
        const oldImagePath = path.join(process.cwd(), "public", existingServicesList.imageCover);
        console.log("Menghapus gambar lama:", oldImagePath);
        await fs.access(oldImagePath); // Periksa apakah file ada
        await fs.unlink(oldImagePath); // Hapus file
      }

      // Simpan gambar baru
      const timestamp = Date.now();
      const originalNameCover = imageFileCover.name.replace(/\.(png|jpg|jpeg|svg|webp)$/i, ""); // Hapus ekstensi
      const fileNameCover = `${timestamp}-${originalNameCover}.webp`; // Simpan sebagai WebP
      const newImagePathCover = path.join(process.cwd(), "public", "uploads", "services-list", fileNameCover);

      // Konversi gambar ke WebP menggunakan Sharp
      const imageByteDataCover = await imageFileCover.arrayBuffer();
      const bufferCover = Buffer.from(imageByteDataCover);
      await sharp(bufferCover)
        .webp({ quality: 80 }) // Kompresi ke WebP dengan kualitas 80%
        .toFile(newImagePathCover);

      finalImageCoverUrl = `/uploads/services-list/${fileNameCover}`; // Path relatif untuk akses publik
      console.log("Gambar baru berhasil disimpan:", finalImageCoverUrl);
    } catch (error) {
      console.error("Gagal menghapus atau mengunggah gambar baru:", error);
    }
  }

  // Perbarui data Achievement di database
  const updatedServices = await ServicesList.findOneAndUpdate(
    { slug: params.slug }, // Query berdasarkan slug
    { name, description, slug, sensitive_content, imageBanner: finalImageUrl, imageCover: finalImageCoverUrl },
    { new: true }
  );  

  return NextResponse.json(updatedServices, { status: 200 });
}

export async function DELETE(req: Request, { params }: any) {
  const authError = validateToken(req);
  if (authError) return authError;
 
  await connectToDatabase();

  // Cari Service berdasarkan ID
  const servicesList = await ServicesList.findOne({ slug: params.slug });
  if (!servicesList) {
    console.log("servicesList tidak ditemukan di database.");
    return NextResponse.json({ message: "servicesList not found" }, { status: 404 });
  }

  // Jika ada gambar, hapus dari folder uploads
  if (servicesList.imageBanner) {
    try {
      const imagePath = path.join(process.cwd(), "public", servicesList.imageBanner); // Path lengkap ke file gambar
      console.log("Menghapus gambar dari folder uploads:", imagePath);

      // Periksa apakah file ada sebelum menghapus
      await fs.access(imagePath);
      await fs.unlink(imagePath); // Hapus file
    } catch (error) {
      console.error("Gagal menghapus gambar dari folder uploads:", error);
    }
  }

  if (servicesList.imageCover) {
    try {
      const imagePathCover = path.join(process.cwd(), "public", servicesList.imageCover); // Path lengkap ke file gambar
      console.log("Menghapus gambar dari folder uploads:", imagePathCover);

      // Periksa apakah file ada sebelum menghapus
      await fs.access(imagePathCover);
      await fs.unlink(imagePathCover); // Hapus file
    } catch (error) {
      console.error("Gagal menghapus gambar dari folder uploads:", error);
    }
  }

  //   // Fungsi untuk menghapus gambar dari direktori
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

  //   // Cari semua `servicesType` yang terkait
  const servicesTypes = await ServicesType.find({ id_servicesList: servicesList._id });
  for (const item of servicesTypes) {
    if (item.image) await deleteImage(item.image);
  }

  const patients = await Patient.find({ id_servicesList: servicesList._id });
  for (const item of patients) {
    if (item.image) await deleteImage(item.image);
    if (item.imageSecond) await deleteImage(item.imageSecond);
  }

  // Hapus services dari database
  await ServicesType.deleteMany({ id_servicesList: servicesList._id });
  await Patient.deleteMany({ id_servicesList: servicesList._id });
  await ServicesList.findOneAndDelete({ slug: params.slug })

  console.log("services list berhasil dihapus.");
  return NextResponse.json({ message: "services list deleted successfully" }, { status: 200 });
}