
import { Metadata } from "next";
import { notFound } from "next/navigation";
import ArtikelDetailClient from "./ArtikelDetailClient";

interface Article {
  title: string;
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

  const plainText = article?.description.replace(/<\/?[^>]+(>|$)/g, "") || "";
  const truncatedText = plainText.length > 156 ? plainText.slice(0, 156) + "..." : plainText;

  const keywords = article.tags ? article.tags.map((tag: string) => tag.trim()) : [];

  return {
    title: `${article.title} | NMW Aesthetic Clinic`,
    description: `${truncatedText}`,
    keywords,
    openGraph: {
      title: article.title,
      description: `${truncatedText}`,
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
      description: `${truncatedText}`,
      images: `${baseUrl}${article.image}`,
    },

    alternates: {
      canonical: `${baseUrl}/artikel/${article.slug}`,
    },
  };
}

export default async function ArtikelDetailPage({ params }: { params: { slug: string } }) {
  const article = await getArticle(params.slug);
  if (!article) notFound();

  return (
    <ArtikelDetailClient
      slug={params.slug}
      doctorId={article.doctorId}
      serviceId={article.serviceId}
      products={article.products}
    />
  );
}
