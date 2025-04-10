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
    cache: "no-store",
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
      description: "Dapatkan promo terbaik dari NMW Aesthetic Clinic untuk perawatan kecantikan dan kesehatan kulit Anda. Nikmati penawaran spesial untuk layanan medis, perawatan wajah, dan perawatan tubuh dengan harga terbaik. Jangan lewatkan promo eksklusif yang dirancang khusus untuk memenuhi kebutuhan kecantikan Anda!",
      keywords: ['promo kecantikan', 'diskon layanan medis', 'promo perawatan kulit'],
  
      openGraph: {
        title: promo.title,
        description: "Dapatkan promo terbaik dari NMW Aesthetic Clinic untuk perawatan kecantikan dan kesehatan kulit Anda. Nikmati penawaran spesial untuk layanan medis, perawatan wajah, dan perawatan tubuh dengan harga terbaik. Jangan lewatkan promo eksklusif yang dirancang khusus untuk memenuhi kebutuhan kecantikan Anda!",
        type: "website",
        url: `${baseUrl}/promo/${promo.slug}`,
        images: [
          {
            url: `${baseUrl}/${promo.image}`,
            width: 1200,
            height: 630,
            alt: promo.title,
          },
        ],
      },
  
      twitter: {
        card: "summary_large_image",
        site: "@nmwclinic",
        title: promo.title,
        description: "Dapatkan promo terbaik dari NMW Aesthetic Clinic untuk perawatan kecantikan dan kesehatan kulit Anda. Nikmati penawaran spesial untuk layanan medis, perawatan wajah, dan perawatan tubuh dengan harga terbaik. Jangan lewatkan promo eksklusif yang dirancang khusus untuk memenuhi kebutuhan kecantikan Anda!",
        images: `${baseUrl}/${promo.image}`,
      },
  
      alternates: {
        canonical: `${baseUrl}/promo/${promo.slug}`,
      },
    };
  }
  

export default function PromoPage({ params }: { params: { slug: string } }) {
  return <PromoClient slug={params.slug} />;
}
