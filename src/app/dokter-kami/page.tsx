import { Metadata } from "next";
import DokterClient from "./DokterClient";

const baseUrl = process.env.NEXT_PUBLIC_API_WEB_URL;

export const metadata: Metadata = {
  title: "Dokter Kami | NMW Aesthetic Clinic",
  description: "Kenali tim dokter profesional di NMW Aesthetic Clinic yang siap memberikan perawatan terbaik untuk kesehatan Anda",
  keywords: [
        "dokter kecantikan",
        "dokter kulit",
        "dokter spesialis estetika",
        "ahli perawatan kulit",
        "konsultasi kecantikan",
        "dokter anti-aging",
        "dokter bedah plastik",
        "dokter perawatan wajah",
        "dokter ahli dermatologi",
        "spesialis kulit dan kecantikan",
        "tim medis NMW Clinic",
        "dokter profesional",
        "layanan medis terbaik",
        "konsultasi perawatan kulit",
        "dokter klinik kecantikan",
        "ahli kesehatan kulit",
        "spesialis estetika medis",
        "dokter terpercaya",
        "dokter perawatan tubuh",
        "konsultasi dokter estetika",
        "dokter bedah estetika",
        "dokter terbaik NMW Clinic"
    ],
  openGraph: {
    title: "Dokter NMW Aesthetic Clinic",
    description: "Kenali tim dokter profesional di NMW Aesthetic Clinic yang siap memberikan perawatan terbaik untuk kesehatan Anda",
    type: "website",
    url: `${baseUrl}/dokter-kami`,
    images: [
      {
        url: `${baseUrl}/images/dokter_banner.webp`,
        width: 800,
        height: 600,
        alt: "Dokter NMW Aesthetic Clinic",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Dokter NMW Aesthetic Clinic",
    description: "Kenali tim dokter profesional di NMW Aesthetic Clinic yang siap memberikan perawatan terbaik untuk kesehatan Anda",
    images: [`${baseUrl}/images/dokter_banner.webp`],
  },
  alternates: {
    canonical: `${baseUrl}/dokter-kami`,
  },
};

export default function DokterPage() {
  return <DokterClient />;
}