import { Metadata } from "next";
import CabangClient from "./CabangClient";

const baseUrl = process.env.NEXT_PUBLIC_API_WEB_URL;

export const metadata: Metadata = {
  title: "Cabang | NMW Aesthetic Clinic",
  description: "Nikmati perawatan kecantikan dan kesehatan kulit terbaik dari NMW Aesthetic Clinic di berbagai lokasi strategis",
  keywords: [
        "cabang NMW Clinic",
        "klinik kecantikan terdekat",
        "dokter kecantikan profesional",
        "perawatan kulit NMW Clinic",
        "klinik estetika terbaik",
        "klinik perawatan wajah",
        "dokter spesialis estetika",
        "klinik dermatologi",
        "perawatan kecantikan lengkap",
        "dokter kulit terbaik",
    ],
  openGraph: {
    title: "Cabang NMW Aesthetic Clinic",
    description: "Nikmati perawatan kecantikan dan kesehatan kulit terbaik dari NMW Aesthetic Clinic di berbagai lokasi strategis",
    type: "website",
    url: `${baseUrl}/cabang`,
    images: [
      {
        url: `${baseUrl}/images/cabang-banner.webp`,
        width: 800,
        height: 600,
        alt: "Cabang NMW Aesthetic Clinic",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Cabang NMW Aesthetic Clinic",
    description: "Nikmati perawatan kecantikan dan kesehatan kulit terbaik dari NMW Aesthetic Clinic di berbagai lokasi strategis",
    images: [`${baseUrl}/images/cabang-banner.webp`],
  },
  alternates: {
    canonical: `${baseUrl}/cabang`,
  },
};

export default function CabangPage() {
  return <CabangClient />;
}