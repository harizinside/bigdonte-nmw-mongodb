import { connectToDatabase } from "@/lib/mongodb";
import Patient from "@/models/patients";
import { NextResponse } from "next/server";
import { validateToken } from "@/lib/auth";
import path from "path";
import fs from "fs/promises";
import sharp from "sharp";

export async function GET(req: any, { params }: any) {
  const authError = validateToken(req);
  if (authError) return authError; 

  await connectToDatabase();

  const patients = await Patient.findOne({ slug: params.slug });

  if (!patients) {
    return NextResponse.json({ message: "Patiens not found" }, { status: 404 });
  }

  return NextResponse.json(patients, { status: 200 });
}

export async function PUT(req: any, { params }: any) { 
  const authError = validateToken(req);
  if (authError) return authError;

  await connectToDatabase();

  const formData = await req.formData();
  const name = formData.get("name") as string;
  const slug = formData.get("slug") as string;
  const description = formData.get("description") as string;
  const image = formData.get("image") as File;
  const imageSecond = formData.get("imageSecond") as File;

  const existingPatients = await Patient.findOne({ slug: params.slug });
  if (!existingPatients) {
    return NextResponse.json({ message: "Patient not found" }, { status: 404 });
  }

    let finalImageUrl = existingPatients.image; 
    let finalImageCoverUrl = existingPatients.imageSecond; 

    if (image) {
        try {
        // Hapus gambar lama jika ada
        if (existingPatients.image) {
            const oldImagePath = path.join(process.cwd(), "public", existingPatients.image);
            console.log("Menghapus gambar lama:", oldImagePath);
            await fs.access(oldImagePath); // Periksa apakah file ada
            await fs.unlink(oldImagePath); // Hapus file
        }

        // Simpan gambar baru
        const timestamp = Date.now();
        const originalName = image.name.replace(/\.(png|jpg|jpeg|svg|webp)$/i, ""); // Hapus ekstensi
        const fileName = `${timestamp}-${originalName}.webp`; // Simpan sebagai WebP
        const newImagePath = path.join(process.cwd(), "public", "uploads", "patients",fileName);

        // Konversi gambar ke WebP menggunakan Sharp
        const imageByteData = await image.arrayBuffer();
        const buffer = Buffer.from(imageByteData);
        await sharp(buffer)
            .webp({ quality: 80 }) // Kompresi ke WebP dengan kualitas 80%
            .toFile(newImagePath);

        finalImageUrl = `/uploads/patients/${fileName}`; // Path relatif untuk akses publik
        console.log("Gambar baru berhasil disimpan:", finalImageUrl);
        } catch (error) {
        console.error("Gagal menghapus atau mengunggah gambar baru:", error);
        }
    }

    if (imageSecond) {
        try {
        // Hapus gambar lama jika ada
        if (existingPatients.imageSecond) {
            const oldImagePath = path.join(process.cwd(), "public", existingPatients.imageSecond);
            console.log("Menghapus gambar lama:", oldImagePath);
            await fs.access(oldImagePath); // Periksa apakah file ada
            await fs.unlink(oldImagePath); // Hapus file
        }

        // Simpan gambar baru
        const timestamp = Date.now();
        const originalNameCover = imageSecond.name.replace(/\.(png|jpg|jpeg|svg|webp)$/i, ""); // Hapus ekstensi
        const fileNameCover = `${timestamp}-${originalNameCover}.webp`; // Simpan sebagai WebP
        const newImagePathCover = path.join(process.cwd(), "public", "uploads", "patients", fileNameCover);

        // Konversi gambar ke WebP menggunakan Sharp
        const imageByteDataCover = await imageSecond.arrayBuffer();
        const bufferCover = Buffer.from(imageByteDataCover);
        await sharp(bufferCover)
            .webp({ quality: 80 }) // Kompresi ke WebP dengan kualitas 80%
            .toFile(newImagePathCover);

        finalImageCoverUrl = `/uploads/patients/${fileNameCover}`; // Path relatif untuk akses publik
        console.log("Gambar baru berhasil disimpan:", finalImageCoverUrl);
        } catch (error) {
        console.error("Gagal menghapus atau mengunggah gambar baru:", error);
        }
    }

  // Perbarui data Achievement di database
  const updatedPatients = await Patient.findOneAndUpdate(
    { slug: params.slug }, // Query berdasarkan slug
    { name, description, slug, image: finalImageUrl, imageSecond: finalImageCoverUrl },
    { new: true }
  );  

  return NextResponse.json(updatedPatients, { status: 200 });
}

export async function DELETE(req: Request, { params }: any) {
  const authError = validateToken(req);
  if (authError) return authError;
 
  await connectToDatabase();

  // Cari Service berdasarkan ID
  const patients = await Patient.findOne({ slug: params.slug });
  if (!patients) {
    console.log("patients tidak ditemukan di database.");
    return NextResponse.json({ message: "patients not found" }, { status: 404 });
  }

  // Jika ada gambar, hapus dari folder uploads
  if (patients.image) {
    try {
      const imagePath = path.join(process.cwd(), "public", patients.image); // Path lengkap ke file gambar
      console.log("Menghapus gambar dari folder uploads:", imagePath);

      // Periksa apakah file ada sebelum menghapus
      await fs.access(imagePath);
      await fs.unlink(imagePath); // Hapus file
    } catch (error) {
      console.error("Gagal menghapus gambar dari folder uploads:", error);
    }
  }

  if (patients.imageSecond) {
    try {
      const imagePathSecond = path.join(process.cwd(), "public", patients.imageSecond); // Path lengkap ke file gambar
      console.log("Menghapus gambar dari folder uploads:", imagePathSecond);

      // Periksa apakah file ada sebelum menghapus
      await fs.access(imagePathSecond);
      await fs.unlink(imagePathSecond); // Hapus file
    } catch (error) {
      console.error("Gagal menghapus gambar dari folder uploads:", error);
    }
  }

  // Hapus services dari database
  await Patient.findOneAndDelete({ slug: params.slug })

  console.log("patient berhasil dihapus.");
  return NextResponse.json({ message: "patient deleted successfully" }, { status: 200 });
}