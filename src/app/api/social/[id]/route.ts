import { connectToDatabase } from "@/lib/mongodb";
import Social from "@/models/socialMedia";
import { NextResponse } from "next/server";
import cloudinary from "@/lib/cloudinary"; 
import { validateToken } from "@/lib/auth";
import path from "path";
import fs from "fs/promises";
import sharp from "sharp";
import mongoose from "mongoose";

// GET: Get doctor by ID
export async function GET(req: any, { params }: any) {
  const authError = validateToken(req);
  if (authError) return authError;

  await connectToDatabase();
  const social = await Social.findById(params.id);
  if (!social) return NextResponse.json({ message: "social not found" }, { status: 404 });
  return NextResponse.json(social, { status: 200 });
}

export async function PUT(req: any, { params }: { params: { id: string } }) {
  const authError = validateToken(req);
  if (authError) return authError;

  await connectToDatabase();

  const formData = await req.formData();
  const title = formData.get("title") as string;
  const link = formData.get("link") as string;
  const icon = formData.get("icon") as string;

  const existingDoctor = await Social.findById(params.id);
  if (!existingDoctor) {
    return NextResponse.json({ message: "Doctor not found" }, { status: 404 });
  }

  // Perbarui data social di database
  const updatedSocial = await Social.findByIdAndUpdate(
    params.id,
    { title, link, icon},
    { new: true }
  );

  return NextResponse.json(updatedSocial, { status: 200 });
}

export async function DELETE(req: Request, { params }: { params: { id: string } }) {
  const authError = validateToken(req);
  if (authError) return authError;

  await connectToDatabase();

  // Cari social berdasarkan ID
  const social = await Social.findById(params.id);
  if (!social) {
    console.log("social tidak ditemukan di database.");
    return NextResponse.json({ message: "social not found" }, { status: 404 });
  }

  // Hapus social dari database
  await Social.findByIdAndDelete(params.id);

  console.log("Social berhasil dihapus.");
  return NextResponse.json({ message: "Social deleted successfully" }, { status: 200 });
}