import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import PromoClient from './PromoClient';

interface Promo {
  title: string;
  slug: string;
  image: string;
  start_date: string;
  end_date: string;
  sk: string;
}

async function getPromo(slug: string): Promise<Promo | null> {
  const baseUrl = process.env.NEXT_PUBLIC_API_WEB_URL;
  const response = await fetch(`${baseUrl}/api/promos/${slug}`, {
    method: "GET",
    headers: {
      Authorization: `Bearer ${process.env.NEXT_PUBLIC_API_SECRET_KEY}`,
    },
  });
  if (!response.ok) return null;
  return response.json();
}

export async function generateMetadata({ params }: { params: { slug: string } }): Promise<Metadata> {
    const promo = await getPromo(params.slug);
    if (!promo) notFound();
  
    const baseUrl = process.env.NEXT_PUBLIC_API_WEB_URL;
  
    return {
      title: `${promo.title} | NMW Aesthetic Clinic`,
      description: "Dapatkan promo terbaik dari NMW Aesthetic Clinic!",
      keywords: ['promo kecantikan', 'diskon layanan medis', 'promo perawatan kulit'],
  
      // ✅ Open Graph Meta
      openGraph: {
        title: promo.title,
        description: "Dapatkan promo terbaik dari NMW Aesthetic Clinic!",
        type: "website",
        url: `${baseUrl}/promo/${promo.slug}`,
        images: [
          {
            url: promo.image,
            width: 1200,
            height: 630,
            alt: promo.title,
          },
        ],
      },
  
      // ✅ Twitter Meta
      twitter: {
        card: "summary_large_image",
        site: "@nmwclinic",
        title: promo.title,
        description: "Dapatkan promo terbaik dari NMW Aesthetic Clinic!",
        images: promo.image,
      },
  
      // ✅ Canonical URL
      alternates: {
        canonical: `${baseUrl}/promo/${promo.slug}`,
      },
    };
  }
  

export default function PromoPage({ params }: { params: { slug: string } }) {
  return <PromoClient slug={params.slug} />;
}
