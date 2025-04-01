// app/katalog/metadata.ts (Server Component)

import { Metadata } from "next";
import KatalogClient from "./KatalogClient";

export const metadata: Metadata = {
  title: "Katalog | NMW Aesthetic Clinic",
  description: "Lihat dan download katalog NMW Aesthetic Clinic",
  keywords: [
    "katalog NMW Clinic",
    "produk kecantikan",
    "perawatan kulit",
    "skincare terbaik",
    "produk perawatan wajah",
  ],
  openGraph: {
    title: "Katalog NMW Aesthetic Clinic",
    description: "Lihat dan download katalog NMW Aesthetic Clinic",
    type: "website",
    url: `${process.env.NEXT_PUBLIC_API_WEB_URL}/katalog`,
    images: [
      {
        url: `${process.env.NEXT_PUBLIC_API_WEB_URL}/images/catalogue-banner.webp`,
        width: 800,
        height: 600,
        alt: "Katalog NMW Aesthetic Clinic",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Katalog NMW Aesthetic Clinic",
    description: "Lihat dan download katalog NMW Aesthetic Clinic",
    images: [`${process.env.NEXT_PUBLIC_API_WEB_URL}/images/catalogue-banner.webp`],
  },
  alternates: {
    canonical: `${process.env.NEXT_PUBLIC_API_WEB_URL}/katalog`,
  },
};

export default function KatalogPage() {
  return <KatalogClient />;
}