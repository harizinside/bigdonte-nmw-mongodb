// app/penghargaan/page.tsx
import Image from "next/image";
import Link from "next/link";
import styles from "@/css/Award.module.css";
import not from "@/css/Not.module.css";
import banner from "@/css/Banner.module.css";
import breadcrumb from "@/css/Breadcrumb.module.css";
import { Metadata } from "next";

interface Achievement {
  _id: string;
  title: string;
  date: string;
  description: string;
  image: string;
}

export const metadata: Metadata = {
    title: "Penghargaan | NMW Aesthetic Clinic",
    description:
      "Lihat daftar penghargaan yang telah diraih oleh NMW Aesthetic Clinic sebagai bukti komitmen kami dalam memberikan layanan kesehatan terbaik dan profesional",
    keywords: [
      "pencapaian NMW Clinic",
      "penghargaan klinik kecantikan",
      "prestasi NMW Aesthetic Clinic",
      "penghargaan layanan medis",
      "inovasi medis",
      "pengakuan industri kecantikan",
      "penghargaan layanan terbaik",
    ],
    openGraph: {
      title: "Penghargaan NMW Aesthetic Clinic",
      description:
        "Lihat daftar penghargaan yang telah diraih oleh NMW Aesthetic Clinic sebagai bukti komitmen kami dalam memberikan layanan kesehatan terbaik dan profesional",
      type: "website",
      url: `${process.env.NEXT_PUBLIC_API_WEB_URL}/penghargaan`,
      images: [
        {
          url: `${process.env.NEXT_PUBLIC_API_WEB_URL}/images/banner_award.webp`,
          width: 800,
          height: 600,
          alt: "Penghargaan NMW Aesthetic Clinic",
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: "Penghargaan NMW Aesthetic Clinic",
      description:
        "Lihat daftar penghargaan yang telah diraih oleh NMW Aesthetic Clinic sebagai bukti komitmen kami dalam memberikan layanan kesehatan terbaik dan profesional",
      images: [`${process.env.NEXT_PUBLIC_API_WEB_URL}/images/banner_award.webp`],
    },
    alternates: {
      canonical: `${process.env.NEXT_PUBLIC_API_WEB_URL}/penghargaan`,
    },
  };

// Fungsi server untuk fetch data
async function fetchAchievements(): Promise<Achievement[]> {
  const baseUrl = process.env.NEXT_PUBLIC_API_WEB_URL || "";
  const response = await fetch(`${baseUrl}/api/achievements?page=all`, {
    method: "GET",
    headers: {
      Authorization: `Bearer ${process.env.NEXT_PUBLIC_API_SECRET_KEY}`,
    },
  });

  if (!response.ok) {
    throw new Error("Gagal mengambil data penghargaan");
  }

  const data = await response.json();
  return data.achievements;
}

// Fungsi server component
export default async function PenghargaanPage() {
  // Fetch data server-side
  const achievements = await fetchAchievements();

  const baseUrl = process.env.NEXT_PUBLIC_API_WEB_URL || "";
  const schemaData = {
    "@context": "https://schema.org",
    "@type": "WebPage",
    name: "Penghargaan - NMW Aesthetic Clinic",
    description:
      "Lihat daftar penghargaan yang telah diraih oleh NMW Aesthetic Clinic",
    url: `${baseUrl}/penghargaan`,
    publisher: {
      "@type": "Organization",
      name: "NMW Aesthetic Clinic",
      logo: {
        "@type": "ImageObject",
        url: `${baseUrl}/images/banner_award.webp`,
      },
    },
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
          src="/images/banner_award.webp"
          alt="Layanan NMW Aesthetic Clinic"
        />
      </div>
      <div className={breadcrumb.breadcrumb}>
        <h5>
          <Link href="/">Home</Link> /{" "}
          <span>
            <Link href="/penghargaan">Penghargaan</Link>
          </span>
        </h5>
      </div>
      <h1 className={styles.heading_hide}>
        Selamat Datang di Halaman Penghargaan
      </h1>

      {achievements.length === 0 ? (
        <div className={`${not.box} ${not.box_flex}`}>
          <div className={styles.heading_section}>
            <h1>
              <span>Penghargaan</span> Kami
            </h1>
          </div>
          <div className={not.content}>
            <Image
              priority
              width={500}
              height={500}
              src="/images/not-found.webp"
              alt="Artikel Tidak Ditemukan"
            />
            <span>Penghargaan Tidak Ditemukan</span>
          </div>
        </div>
      ) : (
        <div className={styles.container}>
          <div className={styles.heading_section}>
            <h2>
              <span>Penghargaan</span> Kami
            </h2>
          </div>
          <div className={styles.cabang_layout}>
            {achievements.map((achievement) => (
              <div className={styles.cabang_box} key={achievement._id}>
                <div className={styles.cabang_box_image}>
                  <Image
                    priority
                    width={500}
                    height={500}
                    src={achievement?.image}
                    alt={achievement?.title}
                  />
                </div>
                <div className={styles.cabang_box_content}>
                  <h3>{achievement?.title}</h3>
                  <p>{achievement.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
