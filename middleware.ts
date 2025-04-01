import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(req: NextRequest) {
  const token = req.cookies.get("token")?.value;

  // Cegah redirect infinite loop
  if (req.nextUrl.pathname === "/dashboard/login") {
    return NextResponse.next();
  }

  if (!token) {
    return NextResponse.redirect(new URL("/dashboard/login", req.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/dashboard/:path*",           // Semua route dashboard
    "!/dashboard/login",           // Kecualikan /dashboard/login
  ],
};