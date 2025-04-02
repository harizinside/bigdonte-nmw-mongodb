import { Metadata } from 'next';
import ArtikelClient from './ArtikelClient';  // Import komponen ArtikelClient untuk menampilkan artikel

// Generate metadata for the page
export const metadata: Metadata = {
    title: "Artikel | NMW Aesthetic Clinic",
    description: "Artikel terkait layanan estetika dan perawatan kulit dari NMW Aesthetic Clinic.",
    keywords: [
        "Artikel NMW Aesthetic Clinic",
        "Perawatan Estetika",
        "Layanan Kecantikan",
        "Tips Kecantikan",
        "Perawatan Kulit Wajah",
        "Perawatan Tubuh",
        "Kecantikan Wanita",
        "Artikel Kecantikan Terpercaya",
        "NMW Estetika",
        "Klinik Kecantikan",
        "Perawatan Kulit",
        "Produk Perawatan Wajah",
        "Skincare Terbaik",
        "Artikel Kesehatan Kulit",
        "NMW Aesthetic Clinic Blog",
        "Artikel Terbaru Kecantikan",
      ],
    openGraph: {
      title: "Artikel | NMW Aesthetic Clinic",
      description: "Artikel terkait layanan estetika dan perawatan kulit dari NMW Aesthetic Clinic.",
      type: "website",
      url: `${process.env.NEXT_PUBLIC_API_WEB_URL}/artikel`,
      images: [
        {
          url: `${process.env.NEXT_PUBLIC_API_WEB_URL}/images/article_image_page.png`,
          width: 800,
          height: 600,
          alt: "Artikel | NMW Aesthetic Clinic",
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: "Artikel | NMW Aesthetic Clinic",
      description: "Artikel terkait layanan estetika dan perawatan kulit dari NMW Aesthetic Clinic.",
      images: [`${process.env.NEXT_PUBLIC_API_WEB_URL}/images/article_image_page.png`],
    },
    alternates: {
      canonical: `${process.env.NEXT_PUBLIC_API_WEB_URL}/artikel`,
    },
  };

export default function Page() {
  return <ArtikelClient />;
}
