"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import styles from "@/css/Catalog.module.css";
import banner from "@/css/Banner.module.css";
import breadcrumb from "@/css/Breadcrumb.module.css";
import loadingStyles from "@/css/Loading.module.css";

interface CatalogItem {
  _id: number;
  title: string;
  date: string;
  image: string;
  document: string;
}

interface CatalogProps {
  catalogs: CatalogItem[];
}

export default function KatalogClient({ catalogs }: CatalogProps) {
  // const [catalogs, setCatalogs] = useState<CatalogItem[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const baseUrl = process.env.NEXT_PUBLIC_API_WEB_URL;

  // useEffect(() => {
  //   const fetchCatalogs = async () => {
  //     try {
  //       const response = await fetch(`/api/catalogs?page=all`, {
  //         method: "GET",
  //         headers: {
  //           "Authorization": `Bearer ${process.env.NEXT_PUBLIC_API_SECRET_KEY}`,
  //           "Content-Type": "application/json",
  //         },
  //         cache: "no-store",
  //       });
  //       if (!response.ok) {
  //         throw new Error(`HTTP error! Status: ${response.status}`);
  //       }

  //       const result = await response.json();
  //       setCatalogs(result.catalogs);
  //     } catch (error) {
  //       console.error("Error fetching catalog:", error);
  //     } finally {
  //       setLoading(false);
  //     }
  //   };

  //   fetchCatalogs();
  // }, []);

  return (
    <div>
        <div className={styles.box_galeri_layout}>
          {catalogs.map((catalog) => (
            <div className={styles.box_galeri} key={catalog._id}>
              <div className={styles.box_galeri_image}>
                <Image
                  priority
                  width={500}
                  height={500}
                  src={catalog.image}
                  alt={catalog.title}
                />
              </div>
              <div className={styles.box_galeri_content}>
                <div className={styles.box_galeri_heading}>
                    <h3>{catalog.title}</h3>
                </div>
                <div className={styles.box_galeri_text}>
                    <p>Terakhir Diperbaharui</p>
                    <p>{new Date(catalog.date).toLocaleDateString('id-ID', { day: '2-digit', month: 'long', year: 'numeric' })}</p>
                </div>
              </div>
              <div className={styles.box_galeri_button}>
                <Link href={catalog.document} target="_blank">
                  <button>Unduh</button>
                </Link>
              </div>
            </div>
          ))}
        </div>
    </div>
  );
};