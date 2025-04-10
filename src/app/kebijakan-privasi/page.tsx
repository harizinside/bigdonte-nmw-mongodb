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

export const metadata: Metadata = {
    title: "Kebijakan & Privasi | NMW Aesthetic Clinic",
    description:
      "Baca kebijakan privasi NMW Aesthetic Clinic untuk memahami bagaimana kami mengumpulkan, menggunakan, dan melindungi informasi pribadi Anda.",
      keywords: [
        "kebijakan privasi",
        "kebijakan",
        "privasi",
        "kebijakan privasi NMW Clinic",
        "NMW Clinic",
      ],
    openGraph: {
      title: "Kebijakan Privasi NMW Aesthetic Clinic",
      description:
        "Baca kebijakan privasi NMW Aesthetic Clinic untuk memahami bagaimana kami mengumpulkan, menggunakan, dan melindungi informasi pribadi Anda.",
      type: "website",
      url: `${process.env.NEXT_PUBLIC_API_WEB_URL}/kebijakan-privasi`,
      images: [
        {
          url: `${process.env.NEXT_PUBLIC_API_WEB_URL}/images/kebijakan-privasi.webp`,
          width: 800,
          height: 600,
          alt: "Kebijakan Privasi NMW Aesthetic Clinic",
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: "Kebijakan Privasi NMW Aesthetic Clinic",
      description:
        "Baca kebijakan privasi NMW Aesthetic Clinic untuk memahami bagaimana kami mengumpulkan, menggunakan, dan melindungi informasi pribadi Anda.",
      images: [`${process.env.NEXT_PUBLIC_API_WEB_URL}/images/kebijakan-privasi.webp`],
    },
    alternates: {
      canonical: `${process.env.NEXT_PUBLIC_API_WEB_URL}/kebijakan-privasi`,
    },
  };

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

// Fungsi server component
export default async function TermsPage() {
  // Fetch data server-side
  const privacyPolicy = await fetchTerms();

  const baseUrl = process.env.NEXT_PUBLIC_API_WEB_URL || "";
  const schemaData = {
    "@context": "https://schema.org",
    "@type": "WebPage",
    name: `Kebijakan Privasi - NMW Aesthetic Clinic`,
    description: `Baca kebijakan privasi NMW Aesthetic Clinic untuk memahami bagaimana kami mengumpulkan, menggunakan, dan melindungi informasi pribadi Anda.`,
    url: `${baseUrl}/kebijakan-privasi`,
    publisher: {
    "@type": "Organization",
    name: "NMW Aesthetic Clinic",
    logo: {
        "@type": "ImageObject",
        url: `${baseUrl}/images/kebijakan-privasi.webp`
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
                name: "Home",
                item: `${baseUrl}`
            },
            {
            "@type": "ListItem",
            position: 2,
                name: "Kebijakan Privasi",
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
          src="/images/kebijakan-privasi.webp"
          alt="Kebijakan Privasi NMW Aesthetic Clinic"
        />
      </div>
      <div className={breadcrumb.breadcrumb}>
          <h5><Link href={'/'}>Home</Link> / <span><Link href={'/kebijakan-privasi'}>Kebijakan Privasi</Link></span></h5>
      </div>
      <h1 className={styles.heading_hide}>Selamat Datang di Halaman Kebijakan Privasi Pada Website NMW Aesthetic Clinic</h1>
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
