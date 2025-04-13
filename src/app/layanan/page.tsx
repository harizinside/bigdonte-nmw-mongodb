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
    title: string;
    phone: string;
    logo: string;
}

interface ServicesPage {
  image: string;
  headline: string;
  title: string;
  description: string;
  keywords: string[];
}

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

async function fetchServicePage(): Promise<ServicesPage> {
  const baseUrl = process.env.NEXT_PUBLIC_API_WEB_URL || "";
  const response = await fetch(`${baseUrl}/api/servicesPage`, {
    method: "GET",
    headers: {
      Authorization: `Bearer ${process.env.NEXT_PUBLIC_API_SECRET_KEY}`,
    },
    cache: "no-store",
  });

  if (!response.ok) { 
    throw new Error("Gagal mengambil data services");
  }

  const data = await response.json();
  return data;
}

export async function generateMetadata(): Promise<Metadata> {
    const servicesPage = await fetchServicePage();
  
    const baseUrl = process.env.NEXT_PUBLIC_API_WEB_URL;
  
    const plainText = servicesPage?.description.replace(/<\/?[^>]+(>|$)/g, "") || "";
    const truncatedText = plainText.length > 156 ? plainText.slice(0, 156) + "..." : plainText;

    return {
    title: `${servicesPage.title}`,
    description:
      `${truncatedText}`,
      keywords: (servicesPage.keywords?.length
        ? servicesPage.keywords
        : ["nmw clinic", "nmw", "nmw website"]
      ).join(", "),
    openGraph: {
      title: `${servicesPage.title}`,
      description:
        `${truncatedText}`,
      type: "website",
      url: `${process.env.NEXT_PUBLIC_API_WEB_URL}/layanan`,
      images: [
        {
          url: `${baseUrl}${servicesPage.image}`,
          width: 800,
          height: 600,
          alt: `${servicesPage.title}`,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: `${servicesPage.title}`,
      description:
        `${truncatedText}`,
      images: [`${baseUrl}${servicesPage.image}`,],
    },
    alternates: {
      canonical: `${process.env.NEXT_PUBLIC_API_WEB_URL}/layanan`,
    },
  };
}

// Fungsi server component
export default async function LayananPage() {
  // Fetch data server-side
  const services = await fetchLayanan();
  const settings = await fetchSetting();
  const servicesPage = await fetchServicePage();

  const formattedPhone = settings?.phone?.startsWith("0")
    ? "62" + settings.phone.slice(1) // Replace first '0' with '62'
    : settings?.phone || "";

  const plainText = servicesPage?.description.replace(/<\/?[^>]+(>|$)/g, "") || "";
  const truncatedText = plainText.length > 156 ? plainText.slice(0, 156) + "..." : plainText;

  const baseUrl = process.env.NEXT_PUBLIC_API_WEB_URL || "";
  const schemaData = {
    "@context": "https://schema.org",
    "@type": "WebPage",
    name: `${servicesPage.title}`,
    description: `${truncatedText}`,
    url: `${baseUrl}/layanan`,
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
      "@id": `${baseUrl}/layanan`
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
            name: `${servicesPage.title}`,
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
          <Image priority width={500} height={500} src={servicesPage.image} alt={servicesPage.title} />
      </div>
        <div className={breadcrumb.breadcrumb}>
            <h5><Link href={'/'}>Home</Link> / <span>Layanan</span></h5>
        </div>
        <h1 className={styles.heading_hide}>
          {servicesPage.headline}
        </h1>
        <div className={styles.section_1}>
            <div className={styles.section_1_heading}>
                <h1>
                    <span>Layanan </span> 
                    Kami 
                </h1>

                <Link href={`https://api.whatsapp.com/send?phone=${formattedPhone}`} target="blank_"><button className={styles.btn_layanan}>Buat Janji Temu Sekarang <FaWhatsapp/></button></Link>
            </div>
            <div className={styles.section_1_content}> 
                <p><div dangerouslySetInnerHTML={{ __html: servicesPage.description }} /></p>
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
