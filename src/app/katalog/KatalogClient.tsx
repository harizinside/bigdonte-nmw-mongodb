"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import styles from "@/css/Catalog.module.css";
import banner from "@/css/Banner.module.css";
import breadcrumb from "@/css/Breadcrumb.module.css";
import loadingStyles from "@/css/Loading.module.css";

interface CatalogItem {
  _id: number;
  title: string;
  date: string;
  image: string;
  document: string;
}

const KatalogClient = () => {
  const [catalogs, setCatalogs] = useState<CatalogItem[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const baseUrl = process.env.NEXT_PUBLIC_API_WEB_URL;

  useEffect(() => {
    const fetchCatalogs = async () => {
      try {
        const response = await fetch(`/api/catalogs?page=all`, {
          method: "GET",
          headers: {
            "Authorization": `Bearer ${process.env.NEXT_PUBLIC_API_SECRET_KEY}`,
            "Content-Type": "application/json",
          },
          cache: "no-store",
        });
        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }

        const result = await response.json();
        setCatalogs(result.catalogs);
      } catch (error) {
        console.error("Error fetching catalog:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchCatalogs();
  }, []);

  // ✅ Schema JSON-LD
  const schemaData = {
    "@context": "https://schema.org",
    "@type": "WebPage",
    name: "Katalog - NMW Aesthetic Clinic",
    description: "Lihat dan download katalog NMW Aesthetic Clinic",
    url: `${baseUrl}/katalog`,
    publisher: {
      "@type": "Organization",
      name: "NMW Aesthetic Clinic",
      logo: {
        "@type": "ImageObject",
        url: `${baseUrl}/images/catalogue-banner.webp`
      }
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
          name: "Katalog",
          item: `${baseUrl}/katalog`
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
        <Image
          priority
          width={900}
          height={900}
          src="/images/catalogue-banner.webp"
          alt="Katalog NMW Aesthetic Clinic"
        />
      </div>
      <div className={breadcrumb.breadcrumb}>
        <h5>
          <Link href="/">Home</Link> / <span>Katalog</span>
        </h5>
      </div>

      <h1 className={styles.heading_hide}>
        Selamat Datang di Halaman Katalog Pada Website NMW Aesthetic Clinic
      </h1>

      <div className={styles.container}>
        <div className={styles.heading_section}>
          <h2>
            <span>Katalog</span> Harga
          </h2>
        </div>
        <div className={styles.box_galeri_layout}>
          {catalogs.map((catalog) => (
            <div className={styles.box_galeri} key={catalog._id}>
              <div className={styles.box_galeri_image}>
                <Image
                  priority
                  width={500}
                  height={500}
                  src={catalog.image}
                  alt={catalog.title}
                />
              </div>
              <div className={styles.box_galeri_content}>
                <div className={styles.box_galeri_heading}>
                    <h3>{catalog.title}</h3>
                </div>
                <div className={styles.box_galeri_text}>
                    <p>Terakhir Diperbaharui</p>
                    <p>{new Date(catalog.date).toLocaleDateString('id-ID', { day: '2-digit', month: 'long', year: 'numeric' })}</p>
                </div>
              </div>
              <div className={styles.box_galeri_button}>
                <Link href={catalog.document} target="_blank">
                  <button>Unduh</button>
                </Link>
              </div>
            </div>
          ))}
        </div>
      </div>

      {loading && (
        <div className={loadingStyles.box}>
          <div className={loadingStyles.content}>
            <Image
              priority
              width={500}
              height={500}
              src="/images/logo.svg"
              alt="Loading"
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default KatalogClient;