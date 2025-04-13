"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import styles from "@/css/Dokter.module.css";
import banner from "@/css/Banner.module.css";
import breadcrumb from "@/css/Breadcrumb.module.css";

interface Doctor {
  _id: string;
  name: string;
  image: string;
  position: string;
}

interface Position {
  _id: string;
  title: string;
}

interface Settings {
    logo: string;
    title: string;
}

interface DoctorsPage {
    image: string;
    headline: string;
    title: string;
    description: string;
    keywords: string[];
  }

interface PositionListProps {
    positions: Position[];
    settings: Settings;
    doctorsPage: DoctorsPage;
}
  
const baseUrl = process.env.NEXT_PUBLIC_API_WEB_URL;

export default function DokterClient({ positions, settings, doctorsPage }: PositionListProps) {
  const [doctors, setDoctors] = useState<Doctor[]>([]);
  const [activeTab, setActiveTab] = useState<string>("all");
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [totalDoctors, setTotalDoctors] = useState<number>(0);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isAnimating, setIsAnimating] = useState(false);

const itemsPerPage = 12; 

useEffect(() => {
    const fetchDoctor = async () => {
        try {
            setIsLoading(true); // Aktifkan loading saat mulai fetch data
            setIsAnimating(false);

            // Cek apakah tab "all" dipilih
            let url = activeTab === "all" 
                ? `/api/doctors?page=all`  // Panggil API dengan page=all
                : `/api/doctors?page=${currentPage}&limit=${itemsPerPage}&id_position=${activeTab}`;

            const response = await fetch(url, {
                method: "GET",
                headers: {
                    "Authorization": `Bearer ${process.env.NEXT_PUBLIC_API_SECRET_KEY}`,
                    "Content-Type": "application/json",
                },
                cache: "no-store",
            });
            if (!response.ok) throw new Error(`HTTP error! Status: ${response.status}`);

            const result = await response.json();

            // Jika tab "all", langsung reverse data
            const doctorsData = activeTab === "all" 
                ? result.doctors.reverse() 
                : result.doctors;

            // Set data sesuai kondisi
            setDoctors(currentPage === 1 || activeTab === "all" ? doctorsData : [...doctors, ...doctorsData]);
            setTotalDoctors(result.totalDoctors);
            setIsLoading(false);

            setTimeout(() => {
                setIsAnimating(true); // Aktifkan animasi setelah data di-load
            }, 100);
        } catch (error) {
            console.error("❌ Error fetching doctors:", error);
            setIsLoading(false); // Pastikan loading dimatikan meskipun terjadi error
        }
    };

    fetchDoctor();
}, [activeTab, currentPage]);

const schemaData = {
    "@context": "https://schema.org",
    "@type": "WebPage",
    name: `${doctorsPage.title}`,
    description: `${doctorsPage.description}`,
    url: `${baseUrl}/dokter-kami`,
    publisher: {
      "@type": "Organization",
      name: `${settings.title}`,
      logo: {
        "@type": "ImageObject",
        url: `${baseUrl}${settings.logo}`,
      }
    },
    mainEntityOfPage: {
      "@type": "WebPage",
      "@id": `${baseUrl}/dokter-kami`
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
                name:  `${doctorsPage.title}`,
                item: `${baseUrl}/dokter-kami`
            }
        ]
    }
};


  return (
    <>
    <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(schemaData) }}
      />
      
      <div className={banner.banner}>
        <Image priority width={900} height={900} src={doctorsPage.image} alt={doctorsPage.title} />
      </div>

      <div className={breadcrumb.breadcrumb}>
        <h5><Link href="/">Home</Link> / <span><Link href="/dokter-kami">Dokter Kami</Link></span></h5>
      </div>

      <h1 className={styles.heading_hide}>
        {doctorsPage.headline}
      </h1>

      <div className={styles.container}>
        <div className={styles.tabs}>
            {/* Button "All" */}
            <button 
                className={activeTab === "all" ? styles.activeTab : styles.tab}
                onClick={() => {
                    setActiveTab("all");
                    setCurrentPage(1); // Reset ke halaman pertama
                    setDoctors([]); // Reset daftar dokter
                }}
            >
                All
            </button>

            {/* Looping posisi dokter */}
            {positions.map((pos) => (
                <button key={pos._id}
                    className={activeTab === pos._id ? styles.activeTab : styles.tab}
                    onClick={() => {
                        setActiveTab(pos._id);
                        setCurrentPage(1); // Reset ke halaman pertama
                        setDoctors([]); // Reset daftar dokter
                    }}
                >
                    {pos.title}
                </button>
            ))}
        </div>

        {isLoading ? (
          <div className={styles.loading_container}><span className={styles.spinner}></span> Loading...</div>
        ) : (
            <div className={`${styles.cabang_layout} ${isAnimating ? styles.fade_enter_active : styles.fade_enter}`}>
            {doctors.map((doctor) => (
              <div key={doctor._id} className={styles.cabang_box}>
                <div className={styles.cabang_box_image}>
                    <Image width={800} height={800} priority src={doctor.image} alt={doctor.name} />
                </div>
                <div className={styles.cabang_box_content}>
                    <h3>
                        dr.
                        <span> {doctor.name.split(" ")[1]} </span>
                        {doctor.name.split(" ").slice(2).join(" ")}
                    </h3>
                    <span>{doctor.position}</span>
                </div>
            </div>
            ))}
          </div>
        )}

        {doctors.length < totalDoctors && (
            <button 
                className={styles.loadMoreButton}
                onClick={() => setCurrentPage((prev) => prev + 1)}
            >
                Load More
            </button>
        )}
      </div>
    </>
  );
};
