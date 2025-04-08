"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { HiArrowLongRight } from "react-icons/hi2";
import styles from "@/css/Dokter.module.css";
import banner from "@/css/Banner.module.css";
import breadcrumb from "@/css/Breadcrumb.module.css";
import loadingStyles from "@/css/Loading.module.css";

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

const baseUrl = process.env.NEXT_PUBLIC_API_WEB_URL;

const DokterClient = () => {
  const [doctors, setDoctors] = useState<Doctor[]>([]);
  const [positions, setPositions] = useState<Position[]>([]);
  const [activeTab, setActiveTab] = useState<string>("all");
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [totalDoctors, setTotalDoctors] = useState<number>(0);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isAnimating, setIsAnimating] = useState(false);

    useEffect(() => {
        const fetchPosition = async () => {
            try {
                const response = await fetch(`/api/position?page=all`, {
                    method: "GET",
                    headers: {
                    "Authorization": `Bearer ${process.env.NEXT_PUBLIC_API_SECRET_KEY}`,
                    "Content-Type": "application/json",
                    },
                });
                if (!response.ok) throw new Error(`HTTP error! Status: ${response.status}`);
                const result = await response.json();
                setPositions(result);
            } catch (error) {
                console.error("Error fetching position:", error);
            }
        };
        fetchPosition();
    }, []);

  // Fetch Doctors
//   const fetchDoctors = async (page: number, id_position?: string) => {
//     try {
//       setIsLoading(true);
//       let url = `${baseUrl}/api/doctors?page=${page}&limit=12`;
//       if (id_position) url += `&id_position=${id_position}`;

//       const response = await fetch(`${url}`, {
//         method: "GET",
//         headers: {
//           "Authorization": `Bearer ${process.env.NEXT_PUBLIC_API_SECRET_KEY}`,
//           "Content-Type": "application/json",
//         },
//       });
//       if (!response.ok) throw new Error("Failed to fetch doctors");

//       const data = await response.json();
//       setDoctors(page === 1 ? data.doctors : [...doctors, ...data.doctors]);
//       setTotalDoctors(data.totalDoctors);
//     } catch (error) {
//       console.error(error);
//     } finally {
//       setIsLoading(false);
//     }
//   };

//   useEffect(() => {
//     fetchPositions();
//     fetchDoctors(1);
//   }, []);

//   useEffect(() => {
//     fetchDoctors(1, activeTab === "all" ? undefined : activeTab);
//   }, [activeTab]);

//   const handleLoadMore = () => {
//     setCurrentPage((prev) => prev + 1);
//   };

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
    name: `Dokter Kami - NMW Aesthetic Clinic`,
    description: `Kenali tim dokter profesional di NMW Aesthetic Clinic yang siap memberikan perawatan terbaik untuk kesehatan Anda`,
    url: `${baseUrl}/dokter-kami`,
    publisher: {
      "@type": "Organization",
      name: "NMW Aesthetic Clinic",
      logo: {
        "@type": "ImageObject",
        url: `${baseUrl}/images/dokter_banner.webp`
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
                name: "Home",
                item: `${baseUrl}`
            },
            {
            "@type": "ListItem",
            position: 2,
                name: "Dokter Kami",
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
        <Image priority width={900} height={900} src="/images/dokter_banner.webp" alt="Layanan NMW Aesthetic Clinic" />
      </div>

      <div className={breadcrumb.breadcrumb}>
        <h5><Link href="/">Home</Link> / <span><Link href="/dokter-kami">Dokter Kami</Link></span></h5>
      </div>

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

export default DokterClient;
