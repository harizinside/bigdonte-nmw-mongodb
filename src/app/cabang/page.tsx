import { Metadata } from "next";
import CabangClient from "./CabangClient";
import Image from "next/image";
import Link from "next/link";
import styles from "@/css/Catalog.module.css";
import banner from "@/css/Banner.module.css";
import breadcrumb from "@/css/Breadcrumb.module.css";

interface BranchItem {
  _id: number;
  name: string;
  address: string;
  phone: string;
  image: string;
  operasional: string[];
  location: string;
}

interface Settings {
  logo: string;
  title: string;
}

interface BranchsPage {
  image: string;
  headline: string;
  title: string;
  description: string;
  keywords: string[];
}

async function fetchBranch(): Promise<BranchItem[]> {
  const baseUrl = process.env.NEXT_PUBLIC_API_WEB_URL || "";
  const response = await fetch(`${baseUrl}/api/branches?page=all`, {
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
  return data.branches.reverse();
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

async function fetchBranchPage(): Promise<BranchsPage> {
  const baseUrl = process.env.NEXT_PUBLIC_API_WEB_URL || "";
  const response = await fetch(`${baseUrl}/api/branchsPage`, {
    method: "GET",
    headers: {
      Authorization: `Bearer ${process.env.NEXT_PUBLIC_API_SECRET_KEY}`,
    },
    cache: "no-store",
  });

  if (!response.ok) { 
    throw new Error("Gagal mengambil data branch");
  }

  const data = await response.json();
  return data;
}

export async function generateMetadata(): Promise<Metadata> {
    const branchsPage = await fetchBranchPage();
  
    const baseUrl = process.env.NEXT_PUBLIC_API_WEB_URL;
  
    return {
      title: `${branchsPage.title}`,
      description: `${branchsPage.description}`,
      keywords: [
        `${branchsPage.keywords.join(", ")}`,
      ],
      openGraph: {
        title: `${branchsPage.title}`,
        description: `${branchsPage.description}`,
        type: "website",
        url: `${process.env.NEXT_PUBLIC_API_WEB_URL}/cabang`,
        images: [
          {
            url: `${baseUrl}${branchsPage.image}`,
            width: 800,
            height: 600,
            alt: `${branchsPage.title}`,
          },
        ],
      },
      twitter: {
        card: "summary_large_image",
        title: `${branchsPage.title}`,
        description: `${branchsPage.description}`,
        images: [`${baseUrl}${branchsPage.image}`],
      },
      alternates: {
        canonical: `${process.env.NEXT_PUBLIC_API_WEB_URL}/cabang`,
      },
    }
};

export default async function CabangPage() {
  // Fetch data server-side
  const branchs = await fetchBranch();
  const settings = await fetchSettings(); 
  const branchsPage = await fetchBranchPage(); 

  const baseUrl = process.env.NEXT_PUBLIC_API_WEB_URL || "";
  const schemaData = {
    "@context": "https://schema.org",
    "@type": "WebPage",
    name: `${branchsPage.title}`, 
    description: `${branchsPage.description}`,
    url: `${baseUrl}/cabang`,
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
      "@id": `${baseUrl}/cabang`
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
          name: `${branchsPage.title}`,
          item: `${baseUrl}/cabang`
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
                src={`${branchsPage.image}`}
                alt={`${branchsPage.title}`}
            />
          </div>
          <h1 className={styles.heading_hide}>{branchsPage.headline}</h1>
          <div className={breadcrumb.breadcrumb}>
            <h5>
              <Link href={"/"}>Home</Link> / <span>Cabang</span>
            </h5>
          </div>
          <div className={styles.container}>
            <div className={`${styles.heading_section}`}>
              <h2>
                <span>Cabang</span> Kami
              </h2>
            </div>
            <CabangClient branchs={branchs} />
          </div>
        </div>
  );
}