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

interface Settings {
  logo: string;
  title: string;
}

interface AchievementsPage {
  image: string;
  headline: string;
  title: string;
  description: string;
  keywords: string[];
}

// Fungsi server untuk fetch data
async function fetchAchievements(): Promise<Achievement[]> {
  const baseUrl = process.env.NEXT_PUBLIC_API_WEB_URL || "";
  const response = await fetch(`${baseUrl}/api/achievements?page=all`, {
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
  return data.achievements;
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

async function fetchAchievementPage(): Promise<AchievementsPage> {
  const baseUrl = process.env.NEXT_PUBLIC_API_WEB_URL || "";
  const response = await fetch(`${baseUrl}/api/achievementsPage`, {
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

export async function generateMetadata(): Promise<Metadata> {
    const achievementsPage = await fetchAchievementPage();
  
    const baseUrl = process.env.NEXT_PUBLIC_API_WEB_URL;
  
    return {
    title: `${achievementsPage.title}`,
    description:
      `${achievementsPage.description}`,
    keywords: [
      `${achievementsPage.keywords.join(", ")}`,
    ],
    openGraph: {
      title: `${achievementsPage.title}`,
      description:
        `${achievementsPage.description}`,
      type: "website",
      url: `${process.env.NEXT_PUBLIC_API_WEB_URL}/penghargaan`,
      images: [
        {
          url: `${baseUrl}${achievementsPage.image}`,
          width: 800,
          height: 600,
          alt: `${achievementsPage.title}`,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: `${achievementsPage.title}`,
      description:
        `${achievementsPage.description}`,
      images: [`${baseUrl}${achievementsPage.image}`,],
    },
    alternates: {
      canonical: `${process.env.NEXT_PUBLIC_API_WEB_URL}/penghargaan`,
    },
  };
}

// Fungsi server component
export default async function PenghargaanPage() {
  // Fetch data server-side
  const achievements = await fetchAchievements();
  const achievementsPage = await fetchAchievementPage();
  const settings = await fetchSettings(); 

  const baseUrl = process.env.NEXT_PUBLIC_API_WEB_URL || "";
  const schemaData = {
    "@context": "https://schema.org",
    "@type": "WebPage",
    name: `${achievementsPage.title}`, 
    description: `${achievementsPage.description}`,
    url: `${baseUrl}/penghargaan`,
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
      "@id": `${baseUrl}/penghargaan`
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
          name: `${achievementsPage.title}`,
          item: `${baseUrl}/penghargaan`
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
          src={`${achievementsPage.image}`}
          alt={`${achievementsPage.title}`}
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
        {achievementsPage.headline}
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
