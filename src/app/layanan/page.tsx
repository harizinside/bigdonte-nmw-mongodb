// app/penghargaan/page.tsx
import Image from "next/image";
import Link from "next/link";
import styles from "@/css/Layanan.module.css";
import not from "@/css/Not.module.css";
import banner from "@/css/Banner.module.css";
import breadcrumb from "@/css/Breadcrumb.module.css";
import { Metadata } from "next";
import { FaWhatsapp } from "react-icons/fa";

interface Service {
  _id: number;
  name: string;
  imageCover: string;
  slug: string;
}

interface Setting {
    phone: string;
    logo: string;
  }

export const metadata: Metadata = {
    title: "Layanan NMW Aesthetic Clinic - Perawatan Kulit & Estetika Medis",
    description:
      "Temukan layanan terbaik dari NMW Aesthetic Clinic, mulai dari perawatan kulit, bedah plastik, konsultasi kesehatan, hingga perawatan anti-aging. Kunjungi klinik kecantikan terpercaya untuk solusi kecantikan yang optimal.",
    keywords: [
    "NMW Aesthetic Clinic",
    "perawatan kulit",
    "klinik kecantikan",
    "estetika medis",
    "bedah plastik",
    "konsultasi kesehatan",
    "perawatan wajah",
    "rejuvenasi kulit",
    "anti-aging",
    "dokter kecantikan",
    "laser treatment",
    "facial treatment",
    "lifting & tightening",
    ],
    openGraph: {
      title: "Layanan NMW Aesthetic Clinic - Perawatan Kulit & Estetika Medis",
      description:
        "Temukan layanan terbaik dari NMW Aesthetic Clinic, mulai dari perawatan kulit, bedah plastik, konsultasi kesehatan, hingga perawatan anti-aging. Kunjungi klinik kecantikan terpercaya untuk solusi kecantikan yang optimal.",
      type: "website",
      url: `${process.env.NEXT_PUBLIC_API_WEB_URL}/layanan`,
      images: [
        {
          url: `${process.env.NEXT_PUBLIC_API_WEB_URL}/images/detail-artikel-banner.png`,
          width: 800,
          height: 600,
          alt: "Layanan NMW Aesthetic Clinic - Perawatan Kulit & Estetika Medis",
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: "Layanan NMW Aesthetic Clinic - Perawatan Kulit & Estetika Medis",
      description:
        "Temukan layanan terbaik dari NMW Aesthetic Clinic, mulai dari perawatan kulit, bedah plastik, konsultasi kesehatan, hingga perawatan anti-aging. Kunjungi klinik kecantikan terpercaya untuk solusi kecantikan yang optimal.",
      images: [`${process.env.NEXT_PUBLIC_API_WEB_URL}/images/detail-artikel-banner.png`],
    },
    alternates: {
      canonical: `${process.env.NEXT_PUBLIC_API_WEB_URL}/layanan`,
    },
  };

// Fungsi server untuk fetch data
async function fetchLayanan(): Promise<Service[]> {
  const baseUrl = process.env.NEXT_PUBLIC_API_WEB_URL || "";
  const response = await fetch(`${baseUrl}/api/services?page=all`, {
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
  return data.services.reverse();
}

async function fetchSetting(): Promise<Setting> {
    const baseUrl = process.env.NEXT_PUBLIC_API_WEB_URL || "";
    const response = await fetch(`${baseUrl}/api/settings`, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${process.env.NEXT_PUBLIC_API_SECRET_KEY}`,
      },
      cache: "no-store",
    });
  
    if (!response.ok) {
      throw new Error("Gagal mengambil data pengaturan");
    }
  
    const data = await response.json();
    return data; // Pastikan API mengembalikan objek, bukan array
  }

// Fungsi server component
export default async function LayananPage() {
  // Fetch data server-side
  const services = await fetchLayanan();
  const settings = await fetchSetting();

  const formattedPhone = settings?.phone?.startsWith("0")
    ? "62" + settings.phone.slice(1) // Replace first '0' with '62'
    : settings?.phone || "";

  const baseUrl = process.env.NEXT_PUBLIC_API_WEB_URL || "";
  const schemaData = {
    "@context": "https://schema.org",
    "@type": "WebPage",
    name: `NMW Aesthetic Clinic`,
    description: `Temukan layanan terbaik dari NMW Aesthetic Clinic, mulai dari perawatan kulit, bedah plastik, konsultasi kesehatan, hingga perawatan anti-aging. Kunjungi klinik kecantikan terpercaya untuk solusi kecantikan yang optimal.`,
    url: `${baseUrl}/layanan`,
    publisher: {
      "@type": "Organization",
      name: "NMW Aesthetic Clinic",
      logo: {
        "@type": "ImageObject",
        url: `${baseUrl}${settings.logo}`,
      }
    },
    mainEntityOfPage: {
      "@type": "WebPage",
      "@id": `${baseUrl}/layanan`
    },
    breadcrumb: {
        "@type": "BreadcrumbList",
        itemListElement: [
          {
            "@type": "ListItem",
            position: 1,
            name: "Beranda",
            item: `${baseUrl}`
          },
          {
            "@type": "ListItem",
            position: 2,
            name: "Layanan",
            item: `${baseUrl}/layanan`
          },
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
            <Image priority width={500} height={500} src={`/images/detail-artikel-banner.png`} alt="Layanan NMW Aesthetic Clinic" />
        </div>
        <div className={breadcrumb.breadcrumb}>
            <h5><Link href={'/'}>Home</Link> / <span>Layanan</span></h5>
        </div>
        <div className={styles.section_1}>
            <div className={styles.section_1_heading}>
                <h1>
                    <span>Layanan </span> 
                    Kami 
                </h1>

                <Link href={`https://api.whatsapp.com/send?phone=${formattedPhone}`} target="blank_"><button className={styles.btn_layanan}>Buat Janji Temu Sekarang <FaWhatsapp/></button></Link>
            </div>
            <div className={styles.section_1_content}>
                <p>Di NMW Aesthetic Clinic, kami menghadirkan solusi perawatan kulit yang inovatif dan berbasis medis untuk membantu Anda mencapai kulit sehat, cerah, dan bercahaya. Dengan kombinasi teknologi terkini, tenaga medis profesional, serta bahan berkualitas tinggi, kami menawarkan berbagai layanan estetika yang disesuaikan dengan kebutuhan unik kulit Anda. Setiap prosedur yang kami lakukan telah melalui penelitian mendalam dan dirancang untuk memberikan hasil yang efektif, aman, dan sesuai dengan standar medis terbaik.
                    <br/><br/>
                    Kami memahami bahwa setiap individu memiliki kondisi kulit yang berbeda, sehingga setiap perawatan yang kami berikan bersifat personal dan disesuaikan dengan jenis kulit serta kebutuhan spesifik Anda. Dengan pendekatan yang holistik, kami tidak hanya fokus pada hasil jangka pendek tetapi juga kesehatan kulit dalam jangka panjang.
                    <br/><br/>
                    Di NMW Aesthetic Clinic, kami berkomitmen untuk memberikan pelayanan terbaik yang mengutamakan kepuasan dan kenyamanan pasien. Klinik kami dirancang dengan suasana yang tenang dan nyaman, menciptakan pengalaman perawatan yang menyenangkan dan bebas dari rasa khawatir. Kami percaya bahwa kecantikan sejati berasal dari kulit yang sehat, dan dengan dukungan dari tim medis profesional kami, Anda dapat menikmati perawatan berkualitas tinggi yang membantu meningkatkan rasa percaya diri Anda dalam setiap momen kehidupan.</p>
            </div> 
        </div>
        <div className={styles.section_3}>
            <div className={styles.heading_section}>
                <h2>
                    <span>Jenis</span> Layanan
                </h2>
            </div>

            <div className={styles.box_galeri_layout}>
            {services.map((service) => (
                <Link href={`layanan/${service.slug}`} key={service._id}>
                    <div className={styles.box_galeri}>
                        <div className={styles.box_galeri_image}>
                            <div className={styles.box_galeri_overlay}></div>
                            <Image priority width={500} height={500} src={service.imageCover} alt={service.name}/>
                            <div className={`${styles.button_image} ${styles.button_image_sc}`}>
                                <button>{service.name}</button>
                            </div>
                        </div>
                    </div>
                </Link>
            ))}

            </div>
        </div>
    </div>
  );
}
