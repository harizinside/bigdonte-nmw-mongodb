import { Metadata } from "next";
import HomeClient from "./HomeClient";
import { notFound } from "next/navigation";

interface Setting {
  logo: string;
  favicon: string;
  title: string;
  meta_description: string;
}

async function getSetting(): Promise<Setting | null> {
  const baseUrl = process.env.NEXT_PUBLIC_API_WEB_URL;
  const response = await fetch(`${baseUrl}/api/settings`, {
    method: "GET",
    headers: {
      Authorization: `Bearer ${process.env.NEXT_PUBLIC_API_SECRET_KEY}`,
    },
  });
  if (!response.ok) return null;
  return response.json();
}

export async function generateMetadata(): Promise<Metadata> {
  const settings = await getSetting();
  if (!settings) notFound();

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
      url: `${process.env.NEXT_PUBLIC_API_WEB_URL}`,
      images: [
        {
          url: `${process.env.NEXT_PUBLIC_API_WEB_URL}${settings.logo}`,
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
      images: [`${process.env.NEXT_PUBLIC_API_WEB_URL}${settings.logo}`],
    },
    alternates: {
      canonical: `${process.env.NEXT_PUBLIC_API_WEB_URL}`,
    },
  }
};

export default function Home() {
  return <HomeClient />;
}