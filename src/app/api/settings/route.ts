import { connectToDatabase } from "@/lib/mongodb";
import Setting from "@/models/settings";
import { NextResponse } from "next/server";
import { validateToken } from "@/lib/auth";
import path from "path";
import sharp from "sharp";
import fs from "fs/promises";

// GET: Fetch all doctors
export async function GET(req: any, { params }: any) {
  const authError = validateToken(req);
  if (authError) return authError;

  await connectToDatabase();

  const settingId = "67daf4822231c37a8362a38a";

  const setting = await Setting.findById(settingId);
  if (!setting) return NextResponse.json({ message: "setting not found" }, { status: 404 });
  return NextResponse.json(setting, { status: 200 });
}

export async function PUT(req: any, { params }: { params: { id: string } }) {
  const authError = validateToken(req);
  if (authError) return authError;

  const settingId = "67daf4822231c37a8362a38a";

  await connectToDatabase();

  const formData = await req.formData();
    const email = formData.get("email") as string;
    const title = formData.get("title") as string;
    const phone = formData.get("phone") as string;
    const keywords = formData.getAll("keywords") as string[];
    const meta_description = formData.get("meta_description") as string;
    const address_header = formData.get("address_header") as string;
    const address_footer = formData.get("address_footer") as string;
    const direct_link = formData.get("direct_link") as string;
    const imageFileBanner = formData.get("favicon") as File;
    const imageFileCover = formData.get("logo") as File;

  const existingSetting = await Setting.findById(settingId);
  if (!existingSetting) {
    return NextResponse.json({ message: "Services not found" }, { status: 404 });
  }

  let finalImageUrl = existingSetting.favicon; 
  let finalImageCoverUrl = existingSetting.imageCover; 

  if (imageFileBanner) {
    try {
      // Hapus gambar lama jika ada
      if (existingSetting.favicon) {
        const oldImagePath = path.join(process.cwd(), "public", existingSetting.favicon);
        console.log("Menghapus gambar lama:", oldImagePath);
        await fs.access(oldImagePath); // Periksa apakah file ada
        await fs.unlink(oldImagePath); // Hapus file
      }

      // Simpan gambar baru
      const timestamp = Date.now();
      const originalName = imageFileBanner.name.replace(/\.(png|jpg|jpeg|svg|webp)$/i, ""); // Hapus ekstensi
      const fileName = `${timestamp}-${originalName}.webp`; // Simpan sebagai WebP
      const newImagePath = path.join(process.cwd(), "public", "uploads", "settings",fileName);

      // Konversi gambar ke WebP menggunakan Sharp
      const imageByteData = await imageFileBanner.arrayBuffer();
      const buffer = Buffer.from(imageByteData);
      await sharp(buffer)
        .webp({ quality: 80 }) // Kompresi ke WebP dengan kualitas 80%
        .toFile(newImagePath);

      finalImageUrl = `/uploads/settings/${fileName}`; // Path relatif untuk akses publik
      console.log("Gambar baru berhasil disimpan:", finalImageUrl);
    } catch (error) {
      console.error("Gagal menghapus atau mengunggah gambar baru:", error);
    }
  }

  if (imageFileCover) {
    try {
      // Hapus gambar lama jika ada 
      if (existingSetting.logo) {
        const oldImagePath = path.join(process.cwd(), "public", existingSetting.logo);
        console.log("Menghapus gambar lama:", oldImagePath);
        await fs.access(oldImagePath); // Periksa apakah file ada
        await fs.unlink(oldImagePath); // Hapus file
      }

      // Simpan gambar baru
      const timestamp = Date.now();
      const originalNameCover = imageFileCover.name.replace(/\.(png|jpg|jpeg|svg|webp)$/i, ""); // Hapus ekstensi
      const fileNameCover = `${timestamp}-${originalNameCover}.webp`; // Simpan sebagai WebP
      const newImagePathCover = path.join(process.cwd(), "public", "uploads", "settings", fileNameCover);

      // Konversi gambar ke WebP menggunakan Sharp
      const imageByteDataCover = await imageFileCover.arrayBuffer();
      const bufferCover = Buffer.from(imageByteDataCover);
      await sharp(bufferCover)
        .webp({ quality: 80 }) // Kompresi ke WebP dengan kualitas 80%
        .toFile(newImagePathCover);

      finalImageCoverUrl = `/uploads/settings/${fileNameCover}`; // Path relatif untuk akses publik
      console.log("Gambar baru berhasil disimpan:", finalImageCoverUrl);
    } catch (error) {
      console.error("Gagal menghapus atau mengunggah gambar baru:", error);
    }
  }

  

  // Perbarui data Achievement di database
  const updatedSetting = await Setting.findByIdAndUpdate(
    settingId,
    { email, phone, title, keywords, meta_description, address_header, address_footer, direct_link, favicon: finalImageUrl, logo: finalImageCoverUrl },
    { new: true }
  );

  return NextResponse.json(updatedSetting, { status: 200 });
}

export async function POST(request: Request) {
  try {
    const authError = validateToken(request);
    if (authError) return authError;

    const formData = await request.formData();
    const email = formData.get("email") as string;
    const title = formData.get("title") as string;
    const phone = formData.get("phone") as string;
    const keywords = formData.getAll("keywords") as string[];
    const meta_description = formData.get("meta_description") as string;
    const address_header = formData.get("address_header") as string;
    const address_footer = formData.get("address_footer") as string;
    const direct_link = formData.get("direct_link") as string;
    const imageFileBanner = formData.get("logo") as File | null;
    const imageFileCover = formData.get("favicon") as File | null;

    await connectToDatabase();

    let logoPath = null;
    let faviconPath = null;

    const timestamp = Date.now();

    // Proses logo jika ada
    if (imageFileBanner) {
      const originalName = imageFileBanner.name.replace(/\.(png|jpg|jpeg|svg|webp)$/i, "");
      const fileName = `${timestamp}-${originalName}.webp`;
      const imagePath = path.join(process.cwd(), "public", "uploads", "settings", fileName);

      const imageByteData = await imageFileBanner.arrayBuffer();
      const buffer = Buffer.from(imageByteData);
      await sharp(buffer).webp({ quality: 80 }).toFile(imagePath);

      logoPath = `/uploads/settings/${fileName}`;
    }

    // Proses favicon jika ada
    if (imageFileCover) {
      const originalNameCover = imageFileCover.name.replace(/\.(png|jpg|jpeg|svg|webp)$/i, "");
      const fileNameCover = `${timestamp}-${originalNameCover}.webp`;
      const imagePathCover = path.join(process.cwd(), "public", "uploads", "settings", fileNameCover);

      const imageByteDataCover = await imageFileCover.arrayBuffer();
      const bufferCover = Buffer.from(imageByteDataCover);
      await sharp(bufferCover).webp({ quality: 80 }).toFile(imagePathCover);

      faviconPath = `/uploads/settings/${fileNameCover}`;
    }

    // Simpan atau perbarui data di MongoDB
    const updateData: any = {
      email,
      title,
      meta_description,
      phone,
      keywords,
      address_header,
      address_footer,
      direct_link,
    };

    if (logoPath) updateData.logo = logoPath;
    if (faviconPath) updateData.favicon = faviconPath;

    const setting = await Setting.findOneAndUpdate({}, updateData, { upsert: true, new: true });

    return NextResponse.json(setting, { status: 201 });
  } catch (error) {
    console.error("Error creating setting:", error);
    return NextResponse.json({ error: "Failed to create setting" }, { status: 500 });
  }
}