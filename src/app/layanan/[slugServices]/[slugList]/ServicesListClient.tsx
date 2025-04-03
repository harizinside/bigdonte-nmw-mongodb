"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import banner from "@/css/Banner.module.css";
import styles from "@/css/Layanan.module.css";
import Link from 'next/link';
import loadingStyles from "@/css/Loading.module.css";
import { FaWhatsapp } from "react-icons/fa";
import breadcrumb from "@/css/Breadcrumb.module.css"
import Image from 'next/image';

interface ServicesListClientProps {
  servicesList: {
    name: string;
    description: string;
    imageCover: string;
    imageBanner: string;
    slug: string;
    sensitive_content: boolean;
  };
  servicesType: any[];
  settings: {
    phone: string;
    logo: string;
  };
  slugServices: string;
}

export default function ServicesListClient({
  servicesList,
  servicesType,
  settings,
  slugServices,
}: ServicesListClientProps) {
  const router = useRouter();
  const [htmlContent, setHtmlContent] = useState("");
  const baseUrl = process.env.NEXT_PUBLIC_API_WEB_URL || "";
  const [showPopup, setShowPopup] = useState(false);

  useEffect(() => {
    if (servicesList.sensitive_content) {
        setShowPopup(true); // Aktifkan popup jika konten sensitif
    }
  }, [servicesList.sensitive_content]);

  const closeModal = () => setShowPopup(false);
  const handleBack = () => {
        window.history.back(); // Kembali ke halaman sebelumnya
        setTimeout(() => {
            setShowPopup(false);
        }, 500); // Delay 500ms agar tidak mengganggu navigasi
    };


  useEffect(() => {
    setHtmlContent(servicesList?.description || "Deskripsi tidak tersedia.");
  }, [servicesList?.description]);

  const formattedPhone =
    settings.phone && settings.phone.startsWith("0")
      ? "62" + settings.phone.slice(1)
      : settings.phone;

  function formatText(text: string | undefined): string {
    if (!text) return "";
    return text.replace(/-/g, " ").replace(/\b\w/g, (char) => char.toUpperCase());
  }

  const formattedName = formatText(slugServices);

  const schemaData = {
    "@context": "https://schema.org",
    "@type": "WebPage",
    name: `${servicesList.name ? `${servicesList.name}` : `Layanan NMW Aesthetic Clinic`}`,
    description: `${servicesList.description ? `${servicesList.description.replace(/<[^>]+>/g, '').slice(0, 100)}${servicesList.description.length > 100 ? '...' : ''}` : 'Layanan NMW Aesthetic Clinic'} `,
    url: `${baseUrl}/layanan/${slugServices}/${servicesList.slug}`,
    publisher: {
        "@type": "Organization",
        name: "NMW Aesthetic Clinic",
        logo: {
            "@type": "ImageObject",
            url: `${baseUrl}${settings.logo}`
        }
    },
    mainEntityOfPage: {
        "@type": "WebPage",
        "@id": `${baseUrl}/layanan/${slugServices}/${servicesList.slug}`
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
                name: "Layanan",
                item: `${baseUrl}/layanan`
            },
            {
                "@type": "ListItem",
                position: 3,
                name: `${formattedName}`,
                item: `${baseUrl}/layanan/${slugServices}`
            },
            {
                "@type": "ListItem",
                position: 4,
                name: `${servicesList.name}`,
                item: `${baseUrl}/layanan/${slugServices}/${servicesList.slug}`
            }
        ]
    }
};

  return (
    <div>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schemaData) }} />
        <div className={banner.banner}>
            <Image
                priority
                width={800}
                height={800}
                src={servicesList.imageBanner}
                alt={servicesList.name}
            />
        </div>
        <div className={breadcrumb.breadcrumb}>
            <h5><Link href={'/'}>Home</Link> / <Link href={`${baseUrl}/layanan`}>Layanan</Link> / <Link href={`${baseUrl}/layanan/${slugServices}`}>{formattedName}</Link> / <span><Link href={`${baseUrl}/layanan/${slugServices}/${servicesList.slug}`}>{servicesList.name}</Link></span></h5>
        </div>
        <div className={`${styles.section_1} ${styles.section_1_sc}`}>
            <div className={styles.section_1_heading}>
                <h1 >
                    {servicesList.name.split(' ')[0]}{" "}
                    <span>{servicesList.name.split(' ').slice(1).join(' ')}</span>
                </h1>
            </div>
            <div className={styles.section_1_content}>
                <div
                    className={styles.service_description}
                    dangerouslySetInnerHTML={{ __html: htmlContent }}
                    suppressHydrationWarning
                />

                <Link href={`https://api.whatsapp.com/send?phone=${formattedPhone}`} target='blank_' ><button className={styles.btn_layanan}>Buat Janji Temu Sekarang <FaWhatsapp/></button></Link>
            </div>
        </div>
        {showPopup && (
            <div className={`${styles.modal} ${showPopup ? styles.active : ""}`}>
                <div className={styles.overlay_modal}></div>
                <div className={styles.modal_content}>
                    <h2>Verifikasi Usia</h2>
                    <p>
                        Situs web ini berisi materi yang dibatasi usia yang mengandung unsur dewasa.
                        Dengan ini Anda menyatakan bahwa Anda setidaknya berusia 18 tahun atau lebih,
                        untuk mengakses situs web dan Anda setuju untuk melihat konten ini.
                    </p>
                    <div className={styles.button_layout}>
                        <button onClick={closeModal}>Saya sudah diatas 18 Tahun</button>
                        <button onClick={handleBack}>Saya masih dibawah 18 Tahun</button>
                    </div>
                    <p> PT.HUB 2024</p>
                </div>
            </div>
        )}
        {servicesType.length > 0 && (
            <div className={styles.section_3}>
                <div className={`${styles.box_service_layout} ${styles.box_service_layout_sc}`}>
                    {
                        servicesType.map((servicesType) => (
                            <div className={styles.box_service} key={servicesType._id}>
                                <div className={styles.box_service_content}>
                                    <h3>{servicesType.name}</h3>
                                    <p>{servicesType.description.replace(/<\/?p>/g, "")}</p>
                                </div>
                                <div className={styles.box_service_btn}>
                                    <Link href={`/layanan/${slugServices}/${servicesList.slug}/${servicesType.slug}`}><button>Lihat Gambar</button></Link>
                                </div>
                            </div>
                        ))
                    }
                </div>
            </div>
        )}
        <div className={styles.section_4}>
            <div className={styles.heading_section_4}>
                <div
                    className={`${styles.heading_section} ${styles.heading_section_start}`}
                >
                    <h2>
                        <span>Dokter </span>
                        Kami
                    </h2>
                </div>
            </div>
            <div className={styles.section_4_box}>
                <img
                    src="../../images/dokter_layanan.webp"
                    alt="Dokter-dokter NMW Aesthetic Clinic"
                    className={styles.our_dokter}
                    loading='lazy'
                />
                <img
                    src="../../images/nmw_bg.webp"
                    alt="Background Dokter"
                    className={styles.bg_our_dokter}
                    loading='lazy'
                />
                <div className={styles.section_4_content}>
                    <p>
                        Dokter NMW Aesthetic Clinic adalah dokter terpilih, terlatih secara profesional,
                        dan terpercaya untuk melakukan bedah plastik, dermatologi, spesialis
                        kulit dan kelamin, serta perawatan kulit estetik.
                    </p>
                    <p>
                        Dokter kami telah menjalani pelatihan ekstensif dan memiliki keahlian
                        untuk memberikan hasil luar biasa sekaligus memastikan keselamatan
                        pasien.
                    </p>
                    <Link href="/dokter-kami">
                        <button>Lihat Lebih Lanjut</button>
                    </Link>
                </div>
            </div>
        </div>
    </div>
  );
}
