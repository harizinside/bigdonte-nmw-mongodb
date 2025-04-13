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

interface Settings {
  logo: string;
  title: string;
}

interface ArticlesPage {
  image: string;
  headline: string;
  title: string;
  description: string;
  keywords: string[];
}

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

async function fetchSettings(): Promise<Settings> {
  const baseUrl = process.env.NEXT_PUBLIC_API_WEB_URL || "";
  const response = await fetch(`${baseUrl}/api/settings`, {
    method: "GET",
    headers: {
      Authorization: `Bearer ${process.env.NEXT_PUBLIC_API_SECRET_KEY}`,
    },
    cache: "no-store",
  });

  if (!response.ok) {
    throw new Error("Gagal mengambil data faq");
  }

  const data = await response.json();
  return data;
}

async function fetchArticlePage(): Promise<ArticlesPage> {
  const baseUrl = process.env.NEXT_PUBLIC_API_WEB_URL || "";
  const response = await fetch(`${baseUrl}/api/articlesPage`, {
    method: "GET",
    headers: {
      Authorization: `Bearer ${process.env.NEXT_PUBLIC_API_SECRET_KEY}`,
    },
    cache: "no-store",
  });

  if (!response.ok) { 
    throw new Error("Gagal mengambil data article");
  }

  const data = await response.json();
  return data;
}

// Generate metadata for the page
export async function generateMetadata(): Promise<Metadata> {
    const articlesPage = await fetchArticlePage();
  
    const baseUrl = process.env.NEXT_PUBLIC_API_WEB_URL;
  
    return {
      title: `${articlesPage.title}`,
      description:
        `${articlesPage.description}`,
      keywords: (articlesPage.keywords?.length
        ? articlesPage.keywords
        : ["nmw clinic", "nmw", "nmw website", "nmw artikel", "nmw clinic artikel"]
      ).join(", "),
      openGraph: {
        title: `${articlesPage.title}`,
        description:
          `${articlesPage.description}`,
        type: "website",
        url: `${process.env.NEXT_PUBLIC_API_WEB_URL}/artikel`,
        images: [
          {
            url: `${baseUrl}${articlesPage.image}`,
            width: 800,
            height: 600,
            alt:  `${articlesPage.title}`,
          },
        ],
      },
      twitter: {
        card: "summary_large_image",
        title: `${articlesPage.title}`,
        description:
          `${articlesPage.description}`,
        images: [`${baseUrl}${articlesPage.image}`],
      },
      alternates: {
        canonical: `${process.env.NEXT_PUBLIC_API_WEB_URL}/artikel`,
      },
    };
}

export default async function Page() {
  const { tags, articles } = await fetchData();
  const settings = await fetchSettings();
  const articlesPage = await fetchArticlePage();
  return <ArtikelClient 
            tags={tags}
            articles={articles}
            settings={settings}
            articlesPage={articlesPage}
          />;
}
