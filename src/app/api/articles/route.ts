import { NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/mongodb";
import Article from "@/models/articles";
import { validateToken } from "@/lib/auth";
import path from "path";
import sharp from "sharp";
import mongoose from "mongoose";

export async function GET(req: { url: string | URL; }) {
  const authError = validateToken(req);
  if (authError) return authError;
  await connectToDatabase();
  try {
    // Ambil query parameter `page`, default ke 1 jika tidak ada
    const { searchParams } = new URL(req.url);
    const page = parseInt(searchParams.get("page") || "1", 10);
    const limit = 15; // Jumlah data per halaman

    // Hitung total data
    const totalArticles = await Article.countDocuments();
    
    // Ambil data dengan pagination (skip & limit)
    const articles = await Article.find({})
      .skip((page - 1) * limit) // Lewati data sesuai halaman
      .limit(limit) // Batasi ke 15 data per halaman
      .sort({ createdAt: -1 }); // Urutkan dari terbaru

    // Hitung total halaman
    const totalPages = Math.ceil(totalArticles / limit);

    return NextResponse.json({
      articles,
      currentPage: page,
      totalPages,
      totalArticles,
    }, { status: 200 });

  } catch (error) {
    console.error("❌ Error fetching article:", error);
    return NextResponse.json({ message: "Gagal mengambil data article." }, { status: 500 });
  }
}

// export async function POST(request: Request) {
//   try {
//     const authError = validateToken(request);
//     if (authError) return authError;

//     const formData = await request.formData();
//     const title = formData.get("title") as string;
//     const slug = formData.get("slug") as string;
//     const imageSourceName = formData.get("imageSourceName") as string;
//     const imageSourceLink = formData.get("imageSourceLink") as string;
//     const date = formData.get("date") as string;
//     const description = formData.get("description") as string;
//     const author = formData.get("author") as string;
//     const editor = formData.get("editor") as string;
//     const sourceLink = formData.get("sourceLink") as string;
//     const doctorId = formData.get("doctorId") as string;
//     const serviceId = formData.get("serviceId") as string;
//     const products = formData.getAll("products") as string[];
//     const tags = formData.getAll("tags") as string[];
//     const imageFile = formData.get("image") as File; 

//     if (!title || !imageSourceName || !slug || !imageSourceLink || !date || !description || !author || !editor || !sourceLink || products.length === 0 || tags.length === 0 || !imageFile) {
//       return NextResponse.json({ error: "All fields are required" }, { status: 400 });
//     }

//     const idDoctorObjectId = mongoose.Types.ObjectId.isValid(doctorId)
//       ? new mongoose.Types.ObjectId(doctorId)
//       : null;

//     const idServiceObjectId = mongoose.Types.ObjectId.isValid(serviceId)
//       ? new mongoose.Types.ObjectId(serviceId)
//       : null;

//     const timestamp = Date.now();
//     const originalName = imageFile.name.replace(/\.(png|jpg|jpeg|svg|webp)$/i, ""); // Hapus ekstensi
//     const imageFileName = `${timestamp}-${originalName}.webp`;

//     const uploadsDir = path.join(process.cwd(), "public", "uploads", "articles");

//     const imagePath = path.join(uploadsDir, imageFileName);

//     // Konversi gambar ke WebP menggunakan Sharp
//     const imageBuffer = Buffer.from(await imageFile.arrayBuffer());
//     await sharp(imageBuffer).webp({ quality: 80 }).toFile(imagePath);

//     // Simpan ke MongoDB
//     await connectToDatabase();
//     const newArticle = new Article({
//       title,
//       slug,
//       imageSourceName,
//       imageSourceLink,
//       date,
//       description,
//       author,
//       editor,
//       sourceLink,
//       products,
//       tags,
//       doctorId: idDoctorObjectId,
//       serviceId: idServiceObjectId,
//       image: `/uploads/articles/${imageFileName}`, // Path relatif untuk akses publik
//     });

//     await newArticle.save();

//     return NextResponse.json(newArticle, { status: 201 });
//   } catch (error) {
//     console.error("Error creating article:", error);
//     return NextResponse.json({ error: "Failed to create article" }, { status: 500 });
//   }
// }

export async function POST(request: Request) {
  try {
    const authError = validateToken(request);
    if (authError) return authError;

    const formData = await request.formData();
    const title = formData.get("title") as string;
    const slug = formData.get("slug") as string;
    const imageSourceName = formData.get("imageSourceName") as string;
    const imageSourceLink = formData.get("imageSourceLink") as string;
    const date = formData.get("date") as string;
    const description = formData.get("description") as string;
    const author = formData.get("author") as string;
    const editor = formData.get("editor") as string;
    const sourceLink = formData.get("sourceLink") as string;
    const doctorId = formData.get("doctorId") as string;
    const serviceId = formData.get("serviceId") as string;
    const products = formData.getAll("products") as string[]; 
    const tags = formData.getAll("tags") as string[];
    const imageFile = formData.get("image") as File;
    
    if (
      !title ||
      !slug ||
      !imageSourceName ||
      !imageSourceLink ||
      !date ||
      !description ||
      !author ||
      !editor ||
      !sourceLink ||
      products.length === 0 ||
      tags.length === 0 ||
      !imageFile
    ) {
      return NextResponse.json({ error: "All fields are required" }, { status: 400 });
    }

    // Validasi `ObjectId` untuk doctorId dan serviceId
    const idDoctorObjectId = mongoose.Types.ObjectId.isValid(doctorId) ? new mongoose.Types.ObjectId(doctorId) : null;
    const idServiceObjectId = mongoose.Types.ObjectId.isValid(serviceId) ? new mongoose.Types.ObjectId(serviceId) : null;
    const idProductsObjectId = products.map((productId) =>
      mongoose.Types.ObjectId.isValid(productId) ? new mongoose.Types.ObjectId(productId) : null
    ).filter(Boolean);

    // Proses upload gambar
    const timestamp = Date.now();
    const originalName = imageFile.name.replace(/\.(png|jpg|jpeg|svg|webp)$/i, ""); // Hapus ekstensi
    const imageFileName = `${timestamp}-${originalName}.webp`;

    const uploadsDir = path.join(process.cwd(), "public", "uploads", "articles");

    const imagePath = path.join(uploadsDir, imageFileName);

    // Konversi gambar ke WebP menggunakan Sharp
    const imageBuffer = Buffer.from(await imageFile.arrayBuffer());
    await sharp(imageBuffer).webp({ quality: 80 }).toFile(imagePath);    

    // Simpan ke MongoDB
    await connectToDatabase();
    const newArticle = new Article({
      title,
      slug,
      imageSourceName,
      imageSourceLink,
      date,
      description,
      author,
      editor,
      sourceLink,
      tags,
      products: idProductsObjectId,
      doctorId: idDoctorObjectId,
      serviceId: idServiceObjectId,
      image: `/uploads/articles/${imageFileName}`,
    });

    await newArticle.save();

    return NextResponse.json(newArticle, { status: 201 });
  } catch (error) {
    console.error("Error creating article:", error);
    return NextResponse.json({ error: "Failed to create article" }, { status: 500 });
  }
}