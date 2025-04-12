import { Metadata } from "next";
import HomeClient from "./HomeClient";

async function fetchWithAuth(url: string) {
  const baseUrl = process.env.NEXT_PUBLIC_API_WEB_URL || "";

  const response = await fetch(`${baseUrl}${url}`, {
    method: "GET",
    headers: {
      Authorization: `Bearer ${process.env.NEXT_PUBLIC_API_SECRET_KEY}`,
    },
    cache: "no-store",
  });

  if (!response.ok) {
    throw new Error(`Gagal mengambil data dari ${url}`);
  }

  return response.json();
}


async function fetchData() {
  const baseUrl = process.env.NEXT_PUBLIC_API_WEB_URL || "";

  const [settingsRes, promoRes, servicesRes, articlesRes] = await Promise.all([
    fetchWithAuth(`/api/settings`),
    fetchWithAuth(`/api/promos`),
    fetchWithAuth(`/api/services`),
    fetchWithAuth(`/api/articles`),
  ]);

  return {
    promos: promoRes.promos || [],
    services: servicesRes.services.slice(0, 6) || [],
    articles: articlesRes.articles.slice(0, 3) || [],
    settings: settingsRes || { phone: "", logo: "", favicon: "", title: "", address_footer: "", meta_description: "" },
    baseUrl,
  };
}

export async function generateMetadata(): Promise<Metadata> {
  const { settings, baseUrl } = await fetchData();

  return{
    title: `${settings.title}`,
    description: `${settings.meta_description}`,
    keywords: [
      "NMW Aesthetic Clinic",
      "Klinik kecantikan terbaik",
      "Perawatan wajah premium",
      "Skincare profesional",
      "Facial treatment berkualitas",
      "Laser treatment aman",
      "Anti-aging dan rejuvenasi",
      "Perawatan kulit glowing",
      "Dokter kecantikan berpengalaman",
      "Perawatan kulit berjerawat",
      "Produk skincare eksklusif",
      "Klinik estetika terpercaya",
      "Lifting & tightening wajah",
      "Treatment kulit sensitif",
      "Konsultasi kecantikan gratis",
      "Perawatan wajah glowing alami",
    ],    
    openGraph: {
      title: `${settings.title}`,
      description: `${settings.meta_description}`,
      type: "website",
      url: `${baseUrl}`,
      images: [
        {
          url: `${baseUrl}${settings.logo}`,
          width: 800,
          height: 600,
          alt: `${settings.title}`,
        },
      ],
    },
    twitter: {
      card: "summary_large_image", 
      title: `${settings.title}`,
      description: `${settings.meta_description}`,
      images: [`${baseUrl}${settings.logo}`],
    },
    alternates: {
      canonical: `${baseUrl}`,
    },
  }
};

export default async function Home() {
  const { settings, promos, services, articles } = await fetchData();

  return <HomeClient 
    settings={settings}
    promos={promos}
    services={services}
    articles={articles}
  />;
}