"use client";

import { useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import { notFound } from 'next/navigation';
import { FaCalendar } from 'react-icons/fa';
import Image from 'next/image';
import banner from '@/css/Banner.module.css';
import styles from '@/css/Promo.module.css';
import loadingStyles from "@/css/Loading.module.css";

interface Promo {
  title: string;
  slug: string;
  image: string;
  start_date: string;
  end_date: string;
  sk: string;
}

interface Props {
  slug: string;
}

export default function PromoClient({ slug }: Props) {
  const [promo, setPromo] = useState<Promo | null>(null);
  const searchParams = useSearchParams();
  const title = searchParams.get('title');
  const baseUrl = process.env.NEXT_PUBLIC_API_WEB_URL;

  useEffect(() => {
    const fetchPromo = async () => {
      try {
        const baseUrl = process.env.NEXT_PUBLIC_API_WEB_URL;
        const response = await fetch(`${baseUrl}/api/promos/${slug}`, {
          method: "GET",
          headers: {
            Authorization: `Bearer ${process.env.NEXT_PUBLIC_API_SECRET_KEY}`,
          },
        });

        if (!response.ok) throw new Error("Promo not found");
        const data: Promo = await response.json();
        setPromo(data);
      } catch (error) {
        notFound();
      }
    };

    fetchPromo();
  }, [slug]);

  function formatDate(date: string): string {
    const months = [
      'Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni',
      'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember'
    ];
    const dateObj = new Date(date);
    return `${dateObj.getDate()} ${months[dateObj.getMonth()]} ${dateObj.getFullYear()}`;
  }

  // Loading state
    if (!promo) {
        return (
            <div className={loadingStyles.box}>
                <div className={loadingStyles.content}>
                    <Image src="/images/logo.svg" alt="Loading" width={500} height={500} priority />
                </div>
            </div>
        );
    }

  const schemaData = {
    "@context": "https://schema.org",
    "@type": "WebPage",
    name: `Promo - NMW Aesthetic Clinic`,
    description: `Dapatkan promo terbaik dari NMW Aesthetic Clinic untuk perawatan kecantikan dan kesehatan kulit Anda. Nikmati penawaran spesial untuk layanan medis, perawatan wajah, dan perawatan tubuh dengan harga terbaik. Jangan lewatkan promo eksklusif yang dirancang khusus untuk memenuhi kebutuhan kecantikan Anda!`,
    url: `${baseUrl}/${promo.slug}`,
    publisher: {
      "@type": "Organization",
      name: "NMW Aesthetic Clinic",
      logo: {
        "@type": "ImageObject",
        url: `${baseUrl}${promo.image}`
      }
    },
    mainEntityOfPage: {
      "@type": "WebPage",
      "@id": `${baseUrl}/promo/${promo.slug}`
    },
    breadcrumb: {
      "@type": "BreadcrumbList",
      itemListElement: [
        {
          "@type": "ListItem",
          position: 1,
          name: "Home",
          item: `${baseUrl}`
        },
        {
          "@type": "ListItem",
          position: 2,
          name: "Promo",
          item: `${baseUrl}/promo/${promo.slug}`
        }
      ]
    }
  };

  return (
    <div>
         <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(schemaData) }}
      />
      <div className={banner.banner}>
        <Image src={promo.image} alt={promo.title} width={1200} height={600} />
      </div>
      <div className={styles.section_1}>
        <div className={styles.section_1_heading}>
          <h1>
            <span>{promo.title.split(' ')[0]} </span>
            {promo.title.split(' ').slice(1).join(' ')}
          </h1>
          {promo.start_date && promo.end_date && (
            <div className={styles.date}>
              <FaCalendar />
              <p>{formatDate(promo.start_date)} - {formatDate(promo.end_date)}</p>
            </div>
          )}
        </div>
        <div className={styles.section_1_content}>
          <div className={styles.section_1_content_heading}>
            <h3>Syarat & Ketentuan</h3>
          </div>
          <div dangerouslySetInnerHTML={{ __html: promo.sk }} />
        </div>
      </div>
    </div>
  );
}
