"use client"

import styles from "@/css/Cabang.module.css";
import banner from "@/css/Banner.module.css";
import { FaWhatsapp } from "react-icons/fa";
import { SlLocationPin } from "react-icons/sl";
import Link from "next/link";
import loadingStyles from "@/css/Loading.module.css";
import { useState, useEffect } from "react";
import breadcrumb from "@/css/Breadcrumb.module.css";
import Image from "next/image";

export default function CabangClient() {
  const [branchs, setBranchs] = useState<Branch[]>([]);
  const [loading, setLoading] = useState(true);
  const baseUrl = process.env.NEXT_PUBLIC_API_WEB_URL;

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(`/api/branches?page=all`, {
          method: "GET",
          headers: {
            "Authorization": `Bearer ${process.env.NEXT_PUBLIC_API_SECRET_KEY}`,
            "Content-Type": "application/json",
          },
          cache: "no-store", // Tetap gunakan untuk bypass cache browser/server
        });
  
        const data: BranchResponse = await response.json();
  
        if (data && data.branches) {
          const reversedBranches = [...data.branches].reverse();
          setBranchs(reversedBranches);
        } else {
          console.error("Invalid response data format:", data);
        }
      } catch (error) {
        console.error("Error fetching branches:", error);
      } finally {
        setLoading(false);
      }
    };
  
    fetchData();
  }, [baseUrl]);  

  const schemaData = {
    "@context": "https://schema.org",
    "@type": "WebPage",
    name: `Cabang - NMW Aesthetic Clinic`,
    description: `Alamat Cabang & Kantor NMW Aesthetic Clinic`,
    url: `${baseUrl}/cabang`,
    publisher: {
      "@type": "Organization",
      name: "NMW Aesthetic Clinic",
      logo: {
        "@type": "ImageObject",
        url: `${baseUrl}/images/cabang-banner.webp`,
      },
    },
    mainEntityOfPage: {
      "@type": "WebPage",
      "@id": `${baseUrl}/cabang`,
    },
    breadcrumb: {
      "@type": "BreadcrumbList",
      itemListElement: [
        {
          "@type": "ListItem",
          position: 1,
          name: "Home",
          item: `${baseUrl}`,
        },
        {
          "@type": "ListItem",
          position: 2,
          name: "Cabang",
          item: `${baseUrl}/cabang`,
        },
      ],
    },
  };

  return (
    <div>
        <script
            type="application/ld+json"
            dangerouslySetInnerHTML={{ __html: JSON.stringify(schemaData) }}
        />
      <div className={banner.banner}>
        <img src="/images/cabang-banner.webp" loading="lazy" alt="Layanan Nmw Aesthetic Clinic" />
      </div>
      <h1 className={styles.heading_hide}>Selamat Datang di Halaman Cabang Pada Website NMW Aesthetic Clinic</h1>
      <div className={breadcrumb.breadcrumb}>
        <h5>
          <Link href={"/"}>Home</Link> / <span>Cabang Kami</span>
        </h5>
      </div>
      <div className={styles.container}>
        <div className={`${styles.heading_section}`}>
          <h2>
            <span>Cabang</span> Kami
          </h2>
        </div>
        <div className={styles.cabang_layout}>
          {branchs.map((branch) => (
            <div className={styles.cabang_box} key={branch.id}>
              <div className={styles.cabang_box_image}>
                <Image
                  width={500}
                  height={500}
                  src={branch.image}
                  alt={branch.name}
                  priority
                />
              </div>
              <div className={styles.cabang_box_content}>
                <h3>{branch.name}</h3>
                <div className={styles.cabang_box_text}>
                  <div className={styles.cabang_box_detail}>
                    <h4>Alamat</h4>
                    <p>{branch.address}</p>
                  </div>
                  <div className={styles.cabang_box_detail}>
                    <h4>Operasional</h4>
                    <p>{branch.operasional[0]}</p>
                    <p>{branch.operasional[1]}</p>
                  </div>
                  <div className={styles.cabang_box_detail}>
                    <h4>Telepon</h4>
                    <p>{branch.phone}</p>
                  </div>
                </div>
                <div className={styles.cabang_box_button}>
                  <Link
                    href={`https://api.whatsapp.com/send/?phone=${branch.phone}&text=Hallo+admin+NMW+${branch.name}%2C+saya+pasien+baru+ingin+mendaftarkan+dan+melakukan+pembelian+produk+di+E-Commerce+Web+NMW+Aesthetic+Clinic&type=phone_number&app_absent=0`}
                    target="_blank"
                  >
                    <button>
                      Pesan Sekarang <FaWhatsapp />
                    </button>
                  </Link>
                  <Link href={branch.location} target="_blank">
                    <button>
                      <SlLocationPin />
                    </button>
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {loading && (
        <div className={loadingStyles.box}>
          <div className={loadingStyles.content}>
            <Image src="/images/logo.svg" alt="Loading" width={500} height={500} priority />
          </div>
        </div>
      )}
    </div>
  );
}

interface Branch {
  id: number;
  name: string;
  address: string;
  operasional: string[];
  phone: string;
  image: string;
  location: string;
}

interface BranchResponse {
  branches: Branch[];
}