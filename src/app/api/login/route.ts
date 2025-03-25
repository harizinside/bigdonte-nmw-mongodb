// app/api/login/route.ts
import { NextResponse } from "next/server";

export async function POST(request: Request) {
  try {
    const body = await request.json();

    // Kirim request ke API eksternal
    const externalResponse = await fetch("https://nmw.prahwa.net/api/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });

    if (!externalResponse.ok) {
      return NextResponse.json(
        { error: "Login gagal" },
        { status: externalResponse.status }
      );
    }

    const data = await externalResponse.json();

    // Buat response dan set cookie token (misal, httpOnly agar tidak mudah diakses JavaScript)
    const response = NextResponse.json(data);
    response.cookies.set("token", data.token, {
      httpOnly: true, // hanya server yang bisa baca cookie ini
      path: "/", // berlaku untuk seluruh aplikasi
      // secure: true, // aktifkan pada production
      // maxAge: 60 * 60 * 24, // misalnya 1 hari
    });
    return response;
  } catch (error) {
    console.error("Error saat login:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}