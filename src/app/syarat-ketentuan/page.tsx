// app/penghargaan/page.tsx
import Image from "next/image";
import Link from "next/link";
import styles from "@/css/Kebijakan.module.css";
import banner from "@/css/Banner.module.css";
import breadcrumb from "@/css/Breadcrumb.module.css";
import { Metadata } from "next";

interface Kebijakan {
  _id: string;
  termsCondition: string;
}

interface Settings {
  logo: string;
  title: string;
}

interface TermsPage {
  image: string;
  headline: string;
  title: string;
  description: string;
  keywords: string[];
}

// Fungsi server untuk fetch data
async function fetchKebijakan(): Promise<Kebijakan[]> {
  const baseUrl = process.env.NEXT_PUBLIC_API_WEB_URL || "";
  const response = await fetch(`${baseUrl}/api/legality`, {
    method: "GET",
    headers: {
      Authorization: `Bearer ${process.env.NEXT_PUBLIC_API_SECRET_KEY}`,
    },
    cache: "no-store",
  });

  if (!response.ok) {
    throw new Error("Gagal mengambil data penghargaan");
  }

  const data = await response.json();
  return data.termsCondition;
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

async function fetchTermPage(): Promise<TermsPage> {
  const baseUrl = process.env.NEXT_PUBLIC_API_WEB_URL || "";
  const response = await fetch(`${baseUrl}/api/termsPage`, {
    method: "GET",
    headers: {
      Authorization: `Bearer ${process.env.NEXT_PUBLIC_API_SECRET_KEY}`,
    },
    cache: "no-store",
  });

  if (!response.ok) { 
    throw new Error("Gagal mengambil data terms page");
  }

  const data = await response.json();
  return data;
}

export async function generateMetadata(): Promise<Metadata> {
    const termsPage = await fetchTermPage();
  
    const baseUrl = process.env.NEXT_PUBLIC_API_WEB_URL;
  
    return {
    title: `${termsPage.title}`,
    description:
      `${termsPage.description}`,
    keywords: [
      `${termsPage.keywords.join(", ")}`,
    ],
    openGraph: {
      title: `${termsPage.title}`,
      description:
        `${termsPage.description}`,
      type: "website",
      url: `${process.env.NEXT_PUBLIC_API_WEB_URL}/syarat-ketentuan`,
      images: [
        {
          url: `${baseUrl}${termsPage.image}`,
          width: 800,
          height: 600,
          alt: `${termsPage.title}`,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: `${termsPage.title}`,
      description:
        `${termsPage.description}`,
      images: [`${baseUrl}${termsPage.image}`,],
    },
    alternates: {
      canonical: `${process.env.NEXT_PUBLIC_API_WEB_URL}/syarat-ketentuan`,
    },
  };
}

// Fungsi server component
export default async function KebijakanPage() {
  // Fetch data server-side
  const termsCondition = await fetchKebijakan();
  const termsPage = await fetchTermPage();
  const settings = await fetchSettings(); 

  const baseUrl = process.env.NEXT_PUBLIC_API_WEB_URL || "";
  const schemaData = {
    "@context": "https://schema.org",
    "@type": "WebPage",
    name: `${termsPage.title}`, 
    description: `${termsPage.description}`,
    url: `${baseUrl}/syarat-ketentuan`,
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
      "@id": `${baseUrl}/syarat-ketentuan`
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
          name: `${termsPage.title}`,
          item: `${baseUrl}/syarat-ketentuan`
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
        <Image priority width={800} height={800}
          src={termsPage.image}
          alt={termsPage.title}
        />
      </div>
      <div className={breadcrumb.breadcrumb}>
          <h5><Link href={'/'}>Home</Link> / <span><Link href={'/syarat-ketentuan'}>Syarat Ketentuan</Link></span></h5>
      </div>
      <h1 className={styles.heading_hide}>{termsPage.headline}</h1>
      <div className={styles.container}>
        <div className={`${styles.heading_section}`}>
          <h2>
            <span>Syarat</span> & Ketentuan
          </h2>
        </div>
         <div className={styles.kebijakan_layout}>
              <div dangerouslySetInnerHTML={{ __html: termsCondition }} />
          </div>
      </div>
    </div>
  );
}
