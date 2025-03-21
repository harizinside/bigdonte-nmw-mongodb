import { connectToDatabase } from "@/lib/mongodb";
import Catalog from "@/models/catalogs";
import { NextResponse } from "next/server";
import cloudinary from "@/lib/cloudinary";
import { validateToken } from "@/lib/auth";
import path from "path";
import fs from "fs/promises";
import sharp from "sharp";
import { writeFile } from "fs/promises";

// GET: Get catalog by ID
export async function GET(req: any, { params }: { params: { id: string } }) {
   const authError = validateToken(req);
    if (authError) return authError;
  await connectToDatabase();
  const catalog = await Catalog.findById(params.id);
  if (!catalog) {
    return NextResponse.json({ message: "Catalog not found" }, { status: 404 });
  }
  return NextResponse.json(catalog, { status: 200 });
}

export async function PUT(req: any, { params }: { params: { id: string } }) {
  const authError = validateToken(req);
  if (authError) return authError;

  await connectToDatabase();

  const formData = await req.formData();
  const title = formData.get("title") as string;
  const date = formData.get("date") as string;
  const imageFile = formData.get("image") as File;
  const documentFile = formData.get("document") as File;

  const existingCatalog = await Catalog.findById(params.id);
  if (!existingCatalog) {
    return NextResponse.json({ message: "Catalog not found" }, { status: 404 });
  }

  let finalImageUrl = existingCatalog.image; // Gunakan gambar lama jika tidak ada perubahan
  let finalDocumentUrl = existingCatalog.document; // Gunakan dokumen lama jika tidak ada perubahan

  if (imageFile) {
    try {
      // Hapus gambar lama jika ada
      if (existingCatalog.image) {
        const oldImagePath = path.join(process.cwd(), "public", existingCatalog.image);
        await fs.access(oldImagePath).then(() => fs.unlink(oldImagePath)).catch(() => {});
      }

      // Simpan gambar baru
      const timestamp = Date.now();
      const originalName = imageFile.name.replace(/\.(png|jpg|jpeg|svg|webp)$/i, ""); // Hapus ekstensi
      const fileName = `${timestamp}-${originalName}.webp`;
      const newImagePath = path.join(process.cwd(), "public", "uploads", "catalogs",fileName);

      // Konversi gambar ke WebP menggunakan Sharp
      const imageByteData = await imageFile.arrayBuffer();
      const buffer = Buffer.from(imageByteData);
      await sharp(buffer).webp({ quality: 80 }).toFile(newImagePath);

      finalImageUrl = `/uploads/catalogs/${fileName}`; // Path relatif untuk akses publik
    } catch (error) {
      console.error("Gagal menghapus atau mengunggah gambar baru:", error);
    }
  }

  if (documentFile) {
    try {
      // Hapus dokumen lama jika ada
      if (existingCatalog.document) {
        const oldDocumentPath = path.join(process.cwd(), "public", existingCatalog.document);
        await fs.access(oldDocumentPath).then(() => fs.unlink(oldDocumentPath)).catch(() => {});
      }

      // Simpan dokumen baru
      const timestamp = Date.now();
      const documentFileName = `${timestamp}-${documentFile.name}`;
      const documentPath = path.join(process.cwd(), "public", "uploads", "catalogs", documentFileName);

      const documentBuffer = new Uint8Array(await documentFile.arrayBuffer());
      await writeFile(documentPath, documentBuffer);
      finalDocumentUrl = `/uploads/catalogs/${documentFileName}`;
    } catch (error) {
      console.error("Gagal menghapus atau mengunggah dokumen baru:", error);
    }
  }

  // Perbarui data Catalog di database
  const updatedCatalog = await Catalog.findByIdAndUpdate(
    params.id,
    { title, document: finalDocumentUrl, date, image: finalImageUrl },
    { new: true }
  );

  return NextResponse.json(updatedCatalog, { status: 200 });
}


// DELETE: Delete catalog
// export async function DELETE(req: Request, { params }: { params: { id: string } }) {
//    const authError = validateToken(req);
//     if (authError) return authError;
//   await connectToDatabase();

//   console.log("Deleting catalog with ID:", params.id);
//   const catalog = await Catalog.findById(params.id);
//   if (!catalog) {
//     return NextResponse.json({ message: "Catalog not found" }, { status: 404 });
//   }

//   // Delete image from Cloudinary
//   if (catalog.image) {
//     try {
//       const imagePublicId = catalog.image.match(/\/v\d+\/catalogs\/([^/.]+)/)?.[1];
//       if (imagePublicId) {
//         await cloudinary.uploader.destroy(`catalogs/${imagePublicId}`);
//       }
//     } catch (error) {
//       console.error("Error deleting image from Cloudinary:", error);
//     }
//   }

//   // Delete document (PDF) from Cloudinary
//   if (catalog.document) {
//     try {
//       const documentPublicId = catalog.document.match(/\/v\d+\/catalogs\/([^/.]+)/)?.[1];
//       if (documentPublicId) {
//         await cloudinary.uploader.destroy(`catalogs/${documentPublicId}`, { resource_type: "raw" });
//       }
//     } catch (error) {
//       console.error("Error deleting document from Cloudinary:", error);
//     }
//   }

//   // Delete catalog from database
//   await Catalog.findByIdAndDelete(params.id);
//   console.log("Catalog successfully deleted.");
//   return NextResponse.json({ message: "Catalog deleted successfully" }, { status: 200 });
// }

export async function DELETE(req: Request, { params }: { params: { id: string } }) {
  const authError = validateToken(req);
  if (authError) return authError;

  await connectToDatabase();

  console.log("Menghapus catalog dengan ID:", params.id);

  // Cari catalog berdasarkan ID
  const catalog = await Catalog.findById(params.id);
  if (!catalog) {
    console.log("catalog tidak ditemukan di database.");
    return NextResponse.json({ message: "catalog not found" }, { status: 404 });
  }

  // Jika ada gambar, hapus dari folder uploads
  if (catalog.image) {
    try {
      const imagePath = path.join(process.cwd(), "public", catalog.image); // Path lengkap ke file gambar
      console.log("Menghapus gambar dari folder uploads:", imagePath);

      // Periksa apakah file ada sebelum menghapus
      await fs.access(imagePath);
      await fs.unlink(imagePath); // Hapus file
    } catch (error) {
      console.error("Gagal menghapus gambar dari folder uploads:", error);
    }
  }

  if (catalog.document) {
    try {
      const documentPath = path.join(process.cwd(), "public", catalog.document); 
      console.log("Menghapus document dari folder uploads:", documentPath);

      // Periksa apakah file ada sebelum menghapus
      await fs.access(documentPath);
      await fs.unlink(documentPath); // Hapus file
    } catch (error) {
      console.error("Gagal menghapus document dari folder uploads:", error);
    }
  }

  // Hapus Catalog dari database
  await Catalog.findByIdAndDelete(params.id);

  console.log("Catalog berhasil dihapus.");
  return NextResponse.json({ message: "Catalog deleted successfully" }, { status: 200 });
}
