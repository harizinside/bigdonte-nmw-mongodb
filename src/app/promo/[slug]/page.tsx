import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import PromoClient from './PromoClient';

interface Promo {
  title: string;
  description: string;
  slug: string;
  image: string;
  start_date: string;
  end_date: string;
  sk: string;
  keywords: string[];
}

interface Settings {
  logo: string;
  title: string;
}

async function getPromo(slug: string): Promise<Promo | null> {
  const baseUrl = process.env.NEXT_PUBLIC_API_WEB_URL;
  const response = await fetch(`${baseUrl}/api/promos/${slug}`, {
    method: "GET",
    headers: {
      Authorization: `Bearer ${process.env.NEXT_PUBLIC_API_SECRET_KEY}`,
    },
    cache: "no-store",
  });
  if (!response.ok) return null;
  return response.json();
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
    throw new Error("Gagal mengambil data achievement");
  }

  const data = await response.json();
  return data;
}

export async function generateMetadata({ params }: { params: { slug: string } }): Promise<Metadata> {
    const promo = await getPromo(params.slug);
    if (!promo) notFound();
  
    const baseUrl = process.env.NEXT_PUBLIC_API_WEB_URL;
  
    const stripHtml = (html: string) => html.replace(/<[^>]+>/g, "");

    return {
      title: `${promo.title}`,
      description: stripHtml(promo.description),
      keywords: [`${promo.keywords.join(", ")}`],
      openGraph: {
        title: `${promo.title}`,
        description: stripHtml(promo.description),
        type: "website",
        url: `${baseUrl}/promo/${promo.slug}`,
        images: [
          {
            url: `${baseUrl}${promo.image}`,
            width: 1200,
            height: 630,
            alt: `${promo.title}`,
          },
        ],
      },
  
      twitter: {
        card: "summary_large_image",
        site: "@nmwclinic",
        title: `${promo.title}`,
        description: stripHtml(promo.description),
        images: `${baseUrl}${promo.image}`,
      },
  
      alternates: {
        canonical: `${baseUrl}/promo/${promo.slug}`,
      },
    };
  }
  

  export default async function PromoPage({ params }: { params: { slug: string } }) {
    const settings = await fetchSettings();
  return <PromoClient slug={params.slug} settings={settings} />;
}
