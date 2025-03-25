import { NextRequest, NextResponse } from "next/server";
import User from "@/models/user";
import { connectToDatabase } from "@/lib/mongodb";
import { comparePassword } from "@/utils/auth";
import { generateToken } from "@/utils/jwt";

export async function POST(req: NextRequest) {
  try {
    await connectToDatabase();

    const { email, password } = await req.json();
    const user = await User.findOne({ email });

    if (!user || !(await comparePassword(password, user.password))) {
      return NextResponse.json({ message: "Email atau password salah" }, { status: 401 });
    }

    const token = generateToken(user._id);
    const response = NextResponse.json({ message: "Login berhasil", userId: user._id }, { status: 200 });

    console.log("User login dengan token:", token);

    // **Perbaikan**: Pastikan cookie dapat diakses dari frontend
    response.headers.set(
      "Set-Cookie",
      `token=${token}; Path=/; HttpOnly; Secure; SameSite=Lax; Max-Age=${7 * 24 * 60 * 60}`
    );

    

    return response;
  } catch (error) {
    console.error("Login Error:", error);
    return NextResponse.json({ message: "Terjadi kesalahan server" }, { status: 500 });
  }
}