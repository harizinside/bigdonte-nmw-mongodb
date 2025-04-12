import Image from "next/image";
import Link from "next/link";
import styles from "@/css/Faq.module.css";
import banner from "@/css/Banner.module.css";
import breadcrumb from "@/css/Breadcrumb.module.css";
import { Metadata } from "next";
import FaqClient from "./FaqClient"; // Import Client Component

interface Faq {
  _id: string;
  question: string;
  answer: string;
}

interface Settings {
  logo: string;
  title: string;
}

interface FaqsPage {
  image: string;
  title: string;
  description: string;
  keywords: string[];
}

// Fungsi fetch data dari server
async function fetchFaq(): Promise<Faq[]> {
  const baseUrl = process.env.NEXT_PUBLIC_API_WEB_URL || "";
  const response = await fetch(`${baseUrl}/api/faqs?page=all`, {
    method: "GET",
    headers: {
      Authorization: `Bearer ${process.env.NEXT_PUBLIC_API_SECRET_KEY}`,
    },
    cache: "no-store",
  });

  if (!response.ok) {
    throw new Error("Gagal mengambil data faq");
  }

  const data = await response.json();
  return data.faqs.reverse();
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
    throw new Error("Gagal mengambil data faq");
  }

  const data = await response.json();
  return data;
}

async function fetchFaqPage(): Promise<FaqsPage> {
  const baseUrl = process.env.NEXT_PUBLIC_API_WEB_URL || "";
  const response = await fetch(`${baseUrl}/api/faqsPage`, {
    method: "GET",
    headers: {
      Authorization: `Bearer ${process.env.NEXT_PUBLIC_API_SECRET_KEY}`,
    },
    cache: "no-store",
  });

  if (!response.ok) { 
    throw new Error("Gagal mengambil data faq");
  }

  const data = await response.json();
  return data;
}

export async function generateMetadata(): Promise<Metadata> {
    const faqsPage = await fetchFaqPage();
  
    const baseUrl = process.env.NEXT_PUBLIC_API_WEB_URL;
  
    return {
      title: `${faqsPage.title}`,
      description:
        `${faqsPage.description}`,
      keywords: [
        `${faqsPage.keywords.join(", ")}`,
      ],
      openGraph: {
        title: `${faqsPage.title}`,
        description:
          `${faqsPage.description}`,
        type: "website",
        url: `${process.env.NEXT_PUBLIC_API_WEB_URL}/faq`,
        images: [
          {
            url: `${baseUrl}${faqsPage.image}`,
            width: 800,
            height: 600,
            alt:  `${faqsPage.title}`,
          },
        ],
      },
      twitter: {
        card: "summary_large_image",
        title: `${faqsPage.title}`,
        description:
          `${faqsPage.description}`,
        images: [`${baseUrl}${faqsPage.image}`],
      },
      alternates: {
        canonical: `${process.env.NEXT_PUBLIC_API_WEB_URL}/faq`,
      },
    };
}

// Komponen Server
export default async function FaqPage() {
  // Fetch data server-side
  const faqs = await fetchFaq();
  const settings = await fetchSettings(); 
  const faqsPage = await fetchFaqPage(); 

  const baseUrl = process.env.NEXT_PUBLIC_API_WEB_URL || "";
  const schemaData = {
    "@context": "https://schema.org",
    "@type": "WebPage",
    name: `${faqsPage.title}`,
    description: `${faqsPage.description}`,
    url: `${baseUrl}/faq`,
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
    "@id": `${baseUrl}/faq`
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
                name: `${faqsPage.title}`,
                item: `${baseUrl}/faq`
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
          width={800}
          height={800}
          src={`${faqsPage.image}`}
          alt={`${faqsPage.title}`}
        />
      </div>
      <div className={breadcrumb.breadcrumb}>
        <h5>
          <Link href={"/"}>Home</Link> /{" "}
          <span>
            <Link href={"/faq"}>FaQ</Link>
          </span>
        </h5>
      </div>
      <h1 className={styles.heading_hide}>
        Selamat Datang di Halaman FAQ Pada Website NMW Aesthetic Clinic
      </h1>
      <div className={styles.faqPage}>
        <div className={styles.heading_section}>
          <h2>
            <span>FAQ</span> (Pertanyaan Umum)
          </h2>
        </div>
        <FaqClient faqs={faqs} />
      </div>
    </div>
  );
}
