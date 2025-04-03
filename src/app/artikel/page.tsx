import { Metadata } from 'next';
import ArtikelClient from './ArtikelClient';  // Import komponen ArtikelClient untuk menampilkan artikel


interface Article {
  _id: string;
  title: string;
  slug: string;
  author: string;
  date: string;
  created_at: string;
  description: string;
  tags: string[];
  image: string;
  status: boolean;
}
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

  async function fetchWithAuth(url: string) {
    const baseUrl = process.env.NEXT_PUBLIC_API_WEB_URL || "";
  
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

  async function fetchData() {
    const baseUrl = process.env.NEXT_PUBLIC_API_WEB_URL || "";
  
    try {
      const [articlesRes, tagsRes] = await Promise.all([
        fetchWithAuth(`/api/articles?page=all`),
        fetchWithAuth(`/api/articles?tags`),
      ]);
  
      // Pastikan data yang diambil tidak undefined/null
      const articles = articlesRes.articles || [];
      const tags = tagsRes.tags || [];
  
      // Filter & Urutkan Artikel
      const filteredArticles = articles
        .filter((article: Article) => article.status === true)
        .sort((a: Article, b: Article) => {
          const dateA = new Date(a.date);
          const dateB = new Date(b.date);
          const createdAtA = new Date(a.created_at);
          const createdAtB = new Date(b.created_at);
          return dateB.getTime() - dateA.getTime() || createdAtB.getTime() - createdAtA.getTime();
        });
  
      return { tags, articles: filteredArticles, baseUrl };
    } catch (error) {
      console.error("Error fetching data:", error);
      return { tags: [], articles: [], baseUrl };
    }
  }  

export default async function Page() {
  const { tags, articles } = await fetchData();
  return <ArtikelClient 
            tags={tags}
            articles={articles}
          />;
}
