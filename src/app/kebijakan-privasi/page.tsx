// app/penghargaan/page.tsx
import Image from "next/image";
import Link from "next/link";
import styles from "@/css/Kebijakan.module.css";
import not from "@/css/Not.module.css";
import banner from "@/css/Banner.module.css";
import breadcrumb from "@/css/Breadcrumb.module.css";
import { Metadata } from "next";

interface Kebijakan {
  _id: string;
  privacyPolicy: string;
}

interface Settings {
  logo: string;
  title: string;
}

interface PrivacyPage {
  image: string;
  headline: string;
  title: string;
  description: string;
  keywords: string[];
}

// Fungsi server untuk fetch data
async function fetchTerms(): Promise<Kebijakan[]> {
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
  return data.privacyPolicy;
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

async function fetchPrivacyPage(): Promise<PrivacyPage> {
  const baseUrl = process.env.NEXT_PUBLIC_API_WEB_URL || "";
  const response = await fetch(`${baseUrl}/api/privacyPage`, {
    method: "GET",
    headers: {
      Authorization: `Bearer ${process.env.NEXT_PUBLIC_API_SECRET_KEY}`,
    },
    cache: "no-store",
  });

  if (!response.ok) { 
    throw new Error("Gagal mengambil data privacy page");
  }

  const data = await response.json();
  return data;
}

export async function generateMetadata(): Promise<Metadata> {
    const privacyPage = await fetchPrivacyPage();
  
    const baseUrl = process.env.NEXT_PUBLIC_API_WEB_URL;
  
    return {
    title: `${privacyPage.title}`,
    description:
      `${privacyPage.description}`,
    keywords: [
      `${privacyPage.keywords.join(", ")}`,
    ],
    openGraph: {
      title: `${privacyPage.title}`,
      description:
        `${privacyPage.description}`,
      type: "website",
      url: `${process.env.NEXT_PUBLIC_API_WEB_URL}/kebijakan-privasi`,
      images: [
        {
          url: `${baseUrl}${privacyPage.image}`,
          width: 800,
          height: 600,
          alt: `${privacyPage.title}`,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: `${privacyPage.title}`,
      description:
        `${privacyPage.description}`,
      images: [`${baseUrl}${privacyPage.image}`,],
    },
    alternates: {
      canonical: `${process.env.NEXT_PUBLIC_API_WEB_URL}/kebijakan-privasi`,
    },
  };
}

// Fungsi server component
export default async function TermsPage() {
  // Fetch data server-side
  const privacyPolicy = await fetchTerms();
  const privacyPage = await fetchPrivacyPage();
  const settings = await fetchSettings(); 

  const baseUrl = process.env.NEXT_PUBLIC_API_WEB_URL || "";
  const schemaData = {
    "@context": "https://schema.org",
    "@type": "WebPage",
    name: `${privacyPage.title}`, 
    description: `${privacyPage.description}`,
    url: `${baseUrl}/kebijakan-privasi`,
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
      "@id": `${baseUrl}/kebijakan-privasi`
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
          name: `${privacyPage.title}`,
          item: `${baseUrl}/kebijakan-privasi`
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
            src={privacyPage.image}
            alt={privacyPage.title}
          />
      </div>
      <div className={breadcrumb.breadcrumb}>
          <h5><Link href={'/'}>Home</Link> / <span><Link href={'/kebijakan-privasi'}>Kebijakan Privasi</Link></span></h5>
      </div>
      <h1 className={styles.heading_hide}>{privacyPage.headline}</h1>
      <div className={styles.container}>
        <div className={`${styles.heading_section}`}>
          <h2>
            <span>Kebijakan</span> Privasi
          </h2>
        </div>
        <div className={styles.kebijakan_layout}>
            <div dangerouslySetInnerHTML={{ __html: privacyPolicy }} />
        </div>

      </div>
    </div>
  );
}
