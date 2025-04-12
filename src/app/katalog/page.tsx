import { Metadata } from "next";
import KatalogClient from "./KatalogClient";
import Image from "next/image";
import Link from "next/link";
import styles from "@/css/Catalog.module.css";
import banner from "@/css/Banner.module.css";
import breadcrumb from "@/css/Breadcrumb.module.css";

interface CatalogItem {
  _id: number;
  title: string;
  date: string;
  image: string;
  document: string;
}

interface Settings {
  logo: string;
  title: string;
}

interface CatalogsPage {
  image: string;
  headline: string;
  title: string;
  description: string;
  keywords: string[];
}

async function fetchCatalog(): Promise<CatalogItem[]> {
  const baseUrl = process.env.NEXT_PUBLIC_API_WEB_URL || "";
  const response = await fetch(`${baseUrl}/api/catalogs?page=all`, {
    method: "GET",
    headers: {
      Authorization: `Bearer ${process.env.NEXT_PUBLIC_API_SECRET_KEY}`,
    },
    cache: "no-store",
  });

  if (!response.ok) {
    throw new Error("Gagal mengambil data katalog");
  }

  const data = await response.json();
  return data.catalogs;
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
    throw new Error("Gagal mengambil data katalog");
  }

  const data = await response.json();
  return data;
}

async function fetchCatalogPage(): Promise<CatalogsPage> {
  const baseUrl = process.env.NEXT_PUBLIC_API_WEB_URL || "";
  const response = await fetch(`${baseUrl}/api/catalogsPage`, {
    method: "GET",
    headers: {
      Authorization: `Bearer ${process.env.NEXT_PUBLIC_API_SECRET_KEY}`,
    },
    cache: "no-store",
  });

  if (!response.ok) { 
    throw new Error("Gagal mengambil data katalog");
  }

  const data = await response.json();
  return data;
}

export async function generateMetadata(): Promise<Metadata> {
    const catalogsPage = await fetchCatalogPage();
  
    const baseUrl = process.env.NEXT_PUBLIC_API_WEB_URL;
  
    return {
      title: `${catalogsPage.title}`,
      description: `${catalogsPage.description}`,
      keywords: [
        `${catalogsPage.keywords.join(", ")}`,
      ],
      openGraph: {
        title: `${catalogsPage.title}`,
        description: `${catalogsPage.description}`,
        type: "website",
        url: `${process.env.NEXT_PUBLIC_API_WEB_URL}/katalog`,
        images: [
          {
            url: `${baseUrl}${catalogsPage.image}`,
            width: 800,
            height: 600,
            alt: `${catalogsPage.title}`,
          },
        ],
      },
      twitter: {
        card: "summary_large_image",
        title: `${catalogsPage.title}`,
        description: `${catalogsPage.description}`,
        images: [`${baseUrl}${catalogsPage.image}`],
      },
      alternates: {
        canonical: `${process.env.NEXT_PUBLIC_API_WEB_URL}/katalog`,
      },
    }
};

export default async function KatalogPage() {
  // Fetch data server-side
  const catalogs = await fetchCatalog();
  const settings = await fetchSettings(); 
  const catalogsPage = await fetchCatalogPage(); 

  const baseUrl = process.env.NEXT_PUBLIC_API_WEB_URL || "";
  const schemaData = {
    "@context": "https://schema.org",
    "@type": "WebPage",
    name: `${catalogsPage.title}`, 
    description: `${catalogsPage.description}`,
    url: `${baseUrl}/katalog`,
    publisher: {
      "@type": "Organization",
      name: `${settings.title}`,
      logo: {
        "@type": "ImageObject",
        url: `${baseUrl}${settings.logo}`
      }
    },
    mainEntityOfPage: {
      "@type": "WebPage",
      "@id": `${baseUrl}/katalog`
    },
    breadcrumb: {
      "@type": "BreadcrumbList",
      itemListElement: [
        {
          "@type": "ListItem",
          position: 1,
          name: `${settings.title}`,
          item: `${baseUrl}`
        },
        {
          "@type": "ListItem",
          position: 2,
          name: `${catalogsPage.title}`,
          item: `${baseUrl}/katalog`
        }
      ]
    }
  };
  
  return (
    <div>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(schemaData),
        }}
      />
      <div className={banner.banner}>
        <Image
          priority
          width={900}
          height={900}
          src={`${catalogsPage.image}`}
          alt={`${catalogsPage.title}`}
        />
      </div>
      <div className={breadcrumb.breadcrumb}>
        <h5>
          <Link href="/">Home</Link> / <span>Katalog</span>
        </h5>
      </div>

      <h1 className={styles.heading_hide}>
        {catalogsPage.headline}
      </h1>

      <div className={styles.container}>
        <div className={styles.heading_section}>
          <h2>
            <span>Katalog</span> Harga
          </h2>
        </div>
        <KatalogClient catalogs={catalogs} />
      </div>
    </div>
  );
}