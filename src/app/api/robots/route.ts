import { NextResponse } from "next/server";

const baseUrl = process.env.NEXT_PUBLIC_API_WEB_URL || "https://example.com"; // Ganti dengan default baseUrl jika tidak ada

export async function GET() {
  const robotsTxt = `User-agent: *
Allow: /

Sitemap: ${baseUrl}/sitemap.xml`;

  return new NextResponse(robotsTxt, {
    headers: { "Content-Type": "text/plain" },
  });
}