import { NextRequest, NextResponse } from "next/server";
import { verifyToken } from "@/utils/jwt";
import * as cookie from "cookie"; // ✅ Import dengan cara yang benar

export async function GET(req: NextRequest) {
  try {
    // Ambil cookie dari request header
    const cookies = cookie.parse(req.headers.get("cookie") || "");
    const token = cookies.token;

    if (!token) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    // Verifikasi token
    const decoded = verifyToken(token);

    return NextResponse.json({
      message: "Welcome to Dashboard",
      userId: decoded.userId,
    });
  } catch (error) {
    return NextResponse.json({ message: "Invalid token" }, { status: 401 });
  }
}