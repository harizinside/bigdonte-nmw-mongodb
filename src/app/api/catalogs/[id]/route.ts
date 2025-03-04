import { connectToDatabase } from "@/lib/mongodb";
import Catalog from "@/models/catalogs";
import { NextResponse } from "next/server";
import cloudinary from "@/lib/cloudinary";

// GET: Get catalog by ID
export async function GET(req: any, { params }: { params: { id: string } }) {
  await connectToDatabase();
  const catalog = await Catalog.findById(params.id);
  if (!catalog) {
    return NextResponse.json({ message: "Catalog not found" }, { status: 404 });
  }
  return NextResponse.json(catalog, { status: 200 });
}

// PUT: Update catalog
export async function PUT(req: any, { params }: { params: { id: string } }) {
  await connectToDatabase();
  const { title, date, image, document } = await req.json();

  const existingCatalog = await Catalog.findById(params.id);
  if (!existingCatalog) {
    return NextResponse.json({ message: "Catalog not found" }, { status: 404 });
  }

  let finalImageUrl = existingCatalog.image;
  let finalDocumentUrl = existingCatalog.document;

  // Handle update image
  if (image && existingCatalog.image !== image) {
    try {
      const oldImageUrl = existingCatalog.image;
      const imagePublicId = oldImageUrl.match(/\/v\d+\/catalogs\/([^/.]+)/)?.[1];
      if (imagePublicId) {
        await cloudinary.uploader.destroy(`catalogs/${imagePublicId}`);
      }
      finalImageUrl = image.replace("/upload/", "/upload/f_webp,q_auto/");
    } catch (error) {
      console.error("Error deleting old image:", error);
    }
  }

  // Handle update document (PDF)
  if (document && existingCatalog.document !== document) {
    try {
      const oldDocumentUrl = existingCatalog.document;
      const documentPublicId = oldDocumentUrl.match(/\/v\d+\/catalogs\/([^/.]+)/)?.[1];
      if (documentPublicId) {
        await cloudinary.uploader.destroy(`catalogs/${documentPublicId}`, { resource_type: "raw" });
      }
      finalDocumentUrl = document; // Simpan URL dokumen baru
    } catch (error) {
      console.error("Error deleting old document:", error);
    }
  }

  const updatedCatalog = await Catalog.findByIdAndUpdate(
    params.id,
    { title, date, image: finalImageUrl, document: finalDocumentUrl },
    { new: true }
  );

  return NextResponse.json(updatedCatalog, { status: 200 });
}

// DELETE: Delete catalog
export async function DELETE(req: Request, { params }: { params: { id: string } }) {
  await connectToDatabase();

  console.log("Deleting catalog with ID:", params.id);
  const catalog = await Catalog.findById(params.id);
  if (!catalog) {
    return NextResponse.json({ message: "Catalog not found" }, { status: 404 });
  }

  // Delete image from Cloudinary
  if (catalog.image) {
    try {
      const imagePublicId = catalog.image.match(/\/v\d+\/catalogs\/([^/.]+)/)?.[1];
      if (imagePublicId) {
        await cloudinary.uploader.destroy(`catalogs/${imagePublicId}`);
      }
    } catch (error) {
      console.error("Error deleting image from Cloudinary:", error);
    }
  }

  // Delete document (PDF) from Cloudinary
  if (catalog.document) {
    try {
      const documentPublicId = catalog.document.match(/\/v\d+\/catalogs\/([^/.]+)/)?.[1];
      if (documentPublicId) {
        await cloudinary.uploader.destroy(`catalogs/${documentPublicId}`, { resource_type: "raw" });
      }
    } catch (error) {
      console.error("Error deleting document from Cloudinary:", error);
    }
  }

  // Delete catalog from database
  await Catalog.findByIdAndDelete(params.id);
  console.log("Catalog successfully deleted.");
  return NextResponse.json({ message: "Catalog deleted successfully" }, { status: 200 });
}
