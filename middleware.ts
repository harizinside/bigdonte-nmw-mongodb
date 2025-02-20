// middleware.ts
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(request: NextRequest) {
  const token = request.cookies.get("token")?.value;
  const { pathname } = request.nextUrl;

  // Jika user mengakses halaman login atau API, biarkan lewat
  if (pathname.startsWith("/auth/signin") || pathname.startsWith("/api")) {
    return NextResponse.next();
  }

  // Jika token tidak ada dan user mencoba mengakses halaman "/" atau lainnya,
  // redirect ke halaman auth/signin.
  if (!token && pathname === "/") {
    return NextResponse.redirect(new URL("/auth/signin", request.url));
  }

  // Jika token ada atau route tidak dilindungi, teruskan request
  return NextResponse.next();
}

export const config = {
  // Gunakan matcher untuk menentukan route yang ingin dilindungi.
  matcher: ["/"],
};
