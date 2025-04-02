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

export const metadata: Metadata = {
  title: "Faq | NMW Aesthetic Clinic",
  description:
    "Temukan jawaban atas pertanyaan umum tentang layanan, perawatan, konsultasi, dan prosedur medis di NMW Aesthetic Clinic. Dapatkan informasi lengkap untuk perawatan kecantikan dan kesehatan kulit Anda.",
    keywords: [
    "FAQ NMW Clinic",
    "pertanyaan umum",
    "layanan medis",
    "perawatan kulit",
    "konsultasi kesehatan",
    "prosedur kecantikan",
    "perawatan wajah",
    "estetika medis",
    "klinik kecantikan",
    "operasi plastik",
    "rejuvenasi kulit",
    "konsultasi medis",
    "perawatan anti-aging",
    "informasi kesehatan",
    "dokter kecantikan",
    "solusi kecantikan",
    "klinik estetika",
    ],
  openGraph: {
    title: "Faq NMW Aesthetic Clinic",
    description:
      "Temukan jawaban atas pertanyaan umum tentang layanan, perawatan, konsultasi, dan prosedur medis di NMW Aesthetic Clinic. Dapatkan informasi lengkap untuk perawatan kecantikan dan kesehatan kulit Anda.",
    type: "website",
    url: `${process.env.NEXT_PUBLIC_API_WEB_URL}/faq`,
    images: [
      {
        url: `${process.env.NEXT_PUBLIC_API_WEB_URL}/images/faq_banner.webp`,
        width: 800,
        height: 600,
        alt: "Faq NMW Aesthetic Clinic",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Faq NMW Aesthetic Clinic",
    description:
      "Temukan jawaban atas pertanyaan umum tentang layanan, perawatan, konsultasi, dan prosedur medis di NMW Aesthetic Clinic. Dapatkan informasi lengkap untuk perawatan kecantikan dan kesehatan kulit Anda.",
    images: [`${process.env.NEXT_PUBLIC_API_WEB_URL}/images/faq_banner.webp`],
  },
  alternates: {
    canonical: `${process.env.NEXT_PUBLIC_API_WEB_URL}/faq`,
  },
};

// Fungsi fetch data dari server
async function fetchFaq(): Promise<Faq[]> {
  const baseUrl = process.env.NEXT_PUBLIC_API_WEB_URL || "";
  const response = await fetch(`${baseUrl}/api/faqs?page=all`, {
    method: "GET",
    headers: {
      Authorization: `Bearer ${process.env.NEXT_PUBLIC_API_SECRET_KEY}`,
    },
  });

  if (!response.ok) {
    throw new Error("Gagal mengambil data faq");
  }

  const data = await response.json();
  return data.faqs.reverse();
}

// Komponen Server
export default async function FaqPage() {
  // Fetch data server-side
  const faqs = await fetchFaq();

  const baseUrl = process.env.NEXT_PUBLIC_API_WEB_URL || "";
  const schemaData = {
    "@context": "https://schema.org",
    "@type": "WebPage",
    name: `FaQ - NMW Aesthetic Clinic`,
    description: `Temukan jawaban atas pertanyaan umum tentang layanan, perawatan, konsultasi, dan prosedur medis di NMW Aesthetic Clinic. Dapatkan informasi lengkap untuk perawatan kecantikan dan kesehatan kulit Anda.`,
    url: `${baseUrl}/faq`,
    publisher: {
    "@type": "Organization",
    name: "NMW Aesthetic Clinic",
    logo: {
        "@type": "ImageObject",
        url: `${baseUrl}/images/faq_banner.webp`
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
                name: "Home",
                item: `${baseUrl}`
            },
            {
            "@type": "ListItem",
            position: 2,
                name: "FAQ",
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
          src="/images/faq_banner.webp"
          alt="Faq NMW Aesthetic Clinic"
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
