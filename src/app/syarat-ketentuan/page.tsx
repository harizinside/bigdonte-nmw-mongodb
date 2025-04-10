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
  termsCondition: string;
}

export const metadata: Metadata = {
    title: "Syarat & Ketentuan | NMW Aesthetic Clinic",
    description:
      "Baca syarat dan ketentuan layanan NMW Aesthetic Clinic untuk memahami aturan penggunaan layanan dan hak serta kewajiban Anda sebagai pelanggan.",
      keywords: [
        "syarat dan ketentuan",
        "ketentuan layanan",
        "aturan penggunaan",
        "kebijakan NMW Clinic",
        "NMW Clinic",
        "peraturan pengguna",
        "hak dan kewajiban",
        "persyaratan layanan",
        "ketentuan hukum",
        "syarat penggunaan",
        "kebijakan pelanggan",
        "hak cipta",
        "tanggung jawab pengguna",
        "NMW Clinic syarat",
        "NMW Clinic ketentuan",
        "informasi hukum",
      ],
    openGraph: {
      title: "Syarat & Ketentuan | NMW Aesthetic Clinic",
      description:
        "Baca syarat dan ketentuan layanan NMW Aesthetic Clinic untuk memahami aturan penggunaan layanan dan hak serta kewajiban Anda sebagai pelanggan.",
      type: "website",
      url: `${process.env.NEXT_PUBLIC_API_WEB_URL}/kebijakan-privasi`,
      images: [
        {
          url: `${process.env.NEXT_PUBLIC_API_WEB_URL}/images/term-condition.webp`,
          width: 800,
          height: 600,
          alt: "Syarat & Ketentuan | NMW Aesthetic Clinic",
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: "Syarat & Ketentuan | NMW Aesthetic Clinic",
      description:
        "Baca syarat dan ketentuan layanan NMW Aesthetic Clinic untuk memahami aturan penggunaan layanan dan hak serta kewajiban Anda sebagai pelanggan.",
      images: [`${process.env.NEXT_PUBLIC_API_WEB_URL}/images/term-condition.webp`],
    },
    alternates: {
      canonical: `${process.env.NEXT_PUBLIC_API_WEB_URL}/kebijakan-privasi`,
    },
  };

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

// Fungsi server component
export default async function KebijakanPage() {
  // Fetch data server-side
  const termsCondition = await fetchKebijakan();

  const baseUrl = process.env.NEXT_PUBLIC_API_WEB_URL || "";
  const schemaData = {
    "@context": "https://schema.org",
    "@type": "WebPage",
    name: `Syarat Ketentuan - NMW Aesthetic Clinic`,
    description: `Temukan jawaban atas pertanyaan umum tentang layanan, perawatan, konsultasi, dan prosedur medis di NMW Aesthetic Clinic. Dapatkan informasi lengkap untuk perawatan kecantikan dan kesehatan kulit Anda.`,
    url: `${baseUrl}/syarat-ketentuan`,
    publisher: {
    "@type": "Organization",
    name: "NMW Aesthetic Clinic",
    logo: {
        "@type": "ImageObject",
        url: `${baseUrl}/images/term-condition.webp`
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
                name: "Home",
                item: `${baseUrl}`
            },
            {
            "@type": "ListItem",
            position: 2,
                name: "Syarat & Ketentuan",
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
          src="/images/term-condition.webp"
          alt="Kebijakan Privasi NMW Aesthetic Clinic"
        />
      </div>
      <div className={breadcrumb.breadcrumb}>
          <h5><Link href={'/'}>Home</Link> / <span><Link href={'/syarat-ketentuan'}>Syarat Ketentuan</Link></span></h5>
      </div>
      <h1 className={styles.heading_hide}>Selamat Datang di Halaman Kebijakan Privasi Pada Website NMW Aesthetic Clinic</h1>
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
