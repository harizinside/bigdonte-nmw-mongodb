import { NextResponse } from "next/server";

const baseUrl = process.env.NEXT_PUBLIC_API_WEB_URL || "";

async function fetchWithAuth(url: string) {
  const response = await fetch(`${baseUrl}${url}`, {
    method: "GET",
    headers: {
      Authorization: `Bearer ${process.env.NEXT_PUBLIC_API_SECRET_KEY}`,
    },
  });

  if (!response.ok) {
    throw new Error(`Gagal mengambil data dari ${url}`);
  }

  return response.json();
}

// Export khusus untuk method GET
export async function GET() {
  try {
    const [articlesRes, servicesRes, promosRes] = await Promise.all([
      fetchWithAuth(`/api/articles?page=all`),
      fetchWithAuth(`/api/services?page=all`),
      fetchWithAuth(`/api/promos?page=all`),
    ]);

    const articles = articlesRes.articles || [];
    const services = servicesRes.services || [];
    const promos = promosRes.promos || [];

    // Halaman Statis
    const staticPages = [
      "/dokter-kami",
      "/penghargaan",
      "/cabang",
      "/faq",
      "/katalog",
      "/kebijakan-privasi",
      "/syarat-ketentuan",
    ];

    // Buat XML sitemap
    const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
      <urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
        
        <!-- Homepage -->
        <url>
          <loc>${baseUrl}</loc>
          <priority>1.0</priority>
        </url>

        <!-- Halaman Statis -->
        ${staticPages
          .map(
            (page) => `
          <url>
            <loc>${baseUrl}${page}</loc>
            <priority>0.5</priority>
          </url>`
          )
          .join("")}

        <!-- Artikel -->
        ${articles
          .map((article: { slug: string; updated_at?: string }) => `
          <url>
            <loc>${baseUrl}/artikel/${article.slug}</loc>
            <lastmod>${article.updated_at ? new Date(article.updated_at).toISOString() : new Date().toISOString()}</lastmod>
            <priority>0.8</priority>
          </url>`
          )
          .join("")}

        <!-- Layanan -->
        ${services
          .map((service: { slug: string; updated_at?: string }) => `
          <url>
            <loc>${baseUrl}/layanan/${service.slug}</loc>
            <lastmod>${service.updated_at ? new Date(service.updated_at).toISOString() : new Date().toISOString()}</lastmod>
            <priority>0.7</priority>
          </url>`
          )
          .join("")}

        <!-- Promo -->
        ${promos
          .map((promo: { slug: string; updated_at?: string }) => `
          <url>
            <loc>${baseUrl}/promo/${promo.slug}</loc>
            <lastmod>${promo.updated_at ? new Date(promo.updated_at).toISOString() : new Date().toISOString()}</lastmod>
            <priority>0.6</priority>
          </url>`
          )
          .join("")}

      </urlset>`;

    return new NextResponse(sitemap, {
      headers: { "Content-Type": "application/xml" },
    });
  } catch (error) {
    console.error("Error generating sitemap:", error);
    return new NextResponse(
      JSON.stringify({ error: "Gagal menghasilkan sitemap" }),
      { status: 500, headers: { "Content-Type": "application/json" } }
    );
  }
}
