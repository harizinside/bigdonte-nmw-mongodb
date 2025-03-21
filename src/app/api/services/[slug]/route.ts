import { connectToDatabase } from "@/lib/mongodb";
import Services from "@/models/services";
import { NextResponse } from "next/server";
import { validateToken } from "@/lib/auth";
import path from "path";
import fs from "fs/promises";
import sharp from "sharp";

export async function GET(req: any, { params }: any) {
  const authError = validateToken(req);
  if (authError) return authError; 

  await connectToDatabase();

  const services = await Services.findOne({ slug: params.slug });

  if (!services) {
    return NextResponse.json({ message: "services not found" }, { status: 404 });
  }

  return NextResponse.json(services, { status: 200 });
}

export async function PUT(req: any, { params }: any) { 
  const authError = validateToken(req);
  if (authError) return authError;

  await connectToDatabase();

  const formData = await req.formData();
  const name = formData.get("name") as string;
  const slug = formData.get("slug") as string;
  const description = formData.get("description") as string;
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
    { name, description, phone, slug, template, imageBanner: finalImageUrl, imageCover: finalImageCoverUrl },
    { new: true }
  );  

  return NextResponse.json(updatedServices, { status: 200 });
}

export async function DELETE(req: Request, { params }: any) {
  const authError = validateToken(req);
  if (authError) return authError;
 
  await connectToDatabase();

  // Cari Service berdasarkan ID
  const services = await Services.findOne({ slug: params.slug });
  if (!services) {
    console.log("services tidak ditemukan di database.");
    return NextResponse.json({ message: "services not found" }, { status: 404 });
  }

  // Jika ada gambar, hapus dari folder uploads
  if (services.imageBanner) {
    try {
      const imagePath = path.join(process.cwd(), "public", services.imageBanner); // Path lengkap ke file gambar
      console.log("Menghapus gambar dari folder uploads:", imagePath);

      // Periksa apakah file ada sebelum menghapus
      await fs.access(imagePath);
      await fs.unlink(imagePath); // Hapus file
    } catch (error) {
      console.error("Gagal menghapus gambar dari folder uploads:", error);
    }
  }

  if (services.imageCover) {
    try {
      const imagePathCover = path.join(process.cwd(), "public", services.imageCover); // Path lengkap ke file gambar
      console.log("Menghapus gambar dari folder uploads:", imagePathCover);

      // Periksa apakah file ada sebelum menghapus
      await fs.access(imagePathCover);
      await fs.unlink(imagePathCover); // Hapus file
    } catch (error) {
      console.error("Gagal menghapus gambar dari folder uploads:", error);
    }
  }

  // Hapus services dari database
  await Services.findOneAndDelete({ slug: params.slug })

  console.log("services berhasil dihapus.");
  return NextResponse.json({ message: "services deleted successfully" }, { status: 200 });
}