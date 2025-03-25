// lib/auth.js
import { NextResponse } from "next/server";

const allowedTokens = [process.env.API_SECRET_KEY]; // Bisa diperluas jika ada beberapa token yang diizinkan

export function validateToken(req) {
  const authHeader = req.headers.get("Authorization");
  const token = authHeader?.split(" ")[1]; // Ambil token setelah "Bearer"

  if (!token) {
    return new NextResponse(JSON.stringify({ message: "Unauthorized" }), { status: 401 });
  }

  if (!allowedTokens.includes(token)) {
    return new NextResponse(JSON.stringify({ message: "Forbidden: Access Denied" }), { status: 403 });
  }

  return null; // Jika token valid, lanjutkan
}