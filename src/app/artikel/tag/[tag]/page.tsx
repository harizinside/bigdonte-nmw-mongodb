import { Metadata } from "next";
import TagClient from "./TagClient";
import { notFound } from 'next/navigation';

interface TagPageProps {
    params: {
      tag: string;
    };
  }

  export async function generateMetadata({
    params,
  }: {
    params: { tag: string };
  }): Promise<Metadata> {
    const { tag } = params;
  
    if (!tag) {
      notFound(); // Menangani jika tag tidak ditemukan
    }
  
    // Return metadata
    return {
      title: `Tag ${tag} | NMW Aesthetic Clinic`,
      description: `Lihat artikel-artikel terkait tag ${tag} di NMW Aesthetic Clinic`,
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
        title: `Tag ${tag} | NMW Aesthetic Clinic`,
        description: `Lihat artikel-artikel terkait tag ${tag} di NMW Aesthetic Clinic`,
        type: "website",
        url: `${process.env.NEXT_PUBLIC_API_WEB_URL}/artikel/tag/${tag}`,
        images: [
          {
            url: `${process.env.NEXT_PUBLIC_API_WEB_URL}/images/article_image_page.png`,
            width: 800,
            height: 600,
            alt: `Tag ${tag} - NMW Aesthetic Clinic`,
          },
        ],
      },
      twitter: {
        card: "summary_large_image",
        title: `Tag ${tag} | NMW Aesthetic Clinic`,
        description: `Lihat artikel-artikel terkait tag ${tag} di NMW Aesthetic Clinic`,
        images: [`${process.env.NEXT_PUBLIC_API_WEB_URL}/images/article_image_page.png`],
      },
      alternates: {
        canonical: `${process.env.NEXT_PUBLIC_API_WEB_URL}/artikel/tag/${tag}`,
      },
    };
  }
  

export default function TagPage({ params }: TagPageProps) {
    const { tag } = params; // Ambil parameter tag dari URL path
    return <TagClient tag={tag} />;
  }