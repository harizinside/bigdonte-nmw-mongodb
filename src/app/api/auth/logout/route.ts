import { NextResponse } from "next/server";
import * as cookie from "cookie";

export async function POST() {
  const response = NextResponse.json({ message: "Logout berhasil" });

  response.headers.set(
    "Set-Cookie",
    cookie.serialize("token", "", {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      expires: new Date(0),
      path: "/",
    })
  );

  return response;
}
