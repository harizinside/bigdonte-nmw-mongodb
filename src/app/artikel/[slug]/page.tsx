
import { Metadata } from "next";
import { notFound } from "next/navigation";
import ArtikelDetailClient from "./ArtikelDetailClient";

interface Article {
  title: string;
  excerpt: string;
  description: string;
  slug: string;
  image: string;
  author: string;
  date: string;
  editor: string;
  sourceLink: string;
  doctorId: number;
  serviceId: number;
  products: string[];
  tags: string[];
}

interface Settings {
  logo: string;
  title: string;
}

interface ArticlesPage {
  title: string;
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

async function getArticle(slug: string): Promise<Article | null> {
  const baseUrl = process.env.NEXT_PUBLIC_API_WEB_URL;
  const response = await fetch(`${baseUrl}/api/articles/${slug}`, {
    method: "GET",
    headers: {
      Authorization: `Bearer ${process.env.NEXT_PUBLIC_API_SECRET_KEY}`,
    },
    cache: "no-store",
  });
  if (!response.ok) return null;
  return response.json();
}

export async function generateMetadata({ params }: { params: { slug: string } }): Promise<Metadata> {
  const article = await getArticle(params.slug);
  if (!article) notFound();

  const baseUrl = process.env.NEXT_PUBLIC_API_WEB_URL;

  const plainText = article?.excerpt.replace(/<\/?[^>]+(>|$)/g, "") || "";

  return {
    title: `${article.title}`,
    description: `${plainText}`,
    keywords: (article.tags?.length
      ? article.tags
      : ["nmw artikel", "nmw clinic", "nmw", "nmw website", "nmw artikel", "nmw clinic artikel"]
    ).join(", "),
    openGraph: {
      title: article.title,
      description: `${plainText}`,
      type: "website",
      url: `${baseUrl}/artikel/${article.slug}`,
      images: [
        {
          url: `${baseUrl}${article.image}`,
          width: 1200,
          height: 630,
          alt: article.title,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      site: "@nmwclinic",
      title: article.title,
      description: `${plainText}`,
      images: `${baseUrl}${article.image}`,
    },
    alternates: {
      canonical: `${baseUrl}/artikel/${article.slug}`,
    },
  };
}

export default async function ArtikelDetailPage({ params }: { params: { slug: string } }) {
  const article = await getArticle(params.slug);
  const settings = await fetchSettings();
  const articlesPage = await fetchArticlePage();
  if (!article) notFound();

  return (
    <ArtikelDetailClient
      slug={params.slug}
      settings={settings}
      articlesPage={articlesPage}
      doctorId={article.doctorId}
      serviceId={article.serviceId}
      products={article.products}
    />
  );
}
