import Image from "next/image";
import Link from "next/link";
import { FaWhatsapp } from "react-icons/fa";
import banner from "@/css/Banner.module.css";
import styles from "@/css/Layanan.module.css";
import breadcrumb from "@/css/Breadcrumb.module.css";
import notFound from "../../../../../../public/images/data_empty.webp"
import { JSXElementConstructor, Key, PromiseLikeOfReactNode, ReactElement, ReactNode, ReactPortal } from "react";
import { Metadata } from "next";

// **Tipe Data untuk Props**
interface ServiceType {
    name: string;
    description: string;
    slug: string;
    image: string;
    keywords: string[];
  }
  
  interface Patient {
    id: number;
    name: string;
  }
  
  interface Settings {
    logo: string;
  }
  
  interface Props {
    params: { slugServices: string; slugList: string; slugType: string };
  }

  interface ServicesPage {
    image: string;
    headline: string;
    title: string;
    description: string;
    keywords: string[];
  }
  
  // **Fungsi Fetch dengan Auth**
  async function fetchWithAuth(url: string) {
    const baseUrl = process.env.NEXT_PUBLIC_API_WEB_URL || "";
    const response = await fetch(`${baseUrl}${url}`, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${process.env.NEXT_PUBLIC_API_SECRET_KEY}`,
      },
      cache: "no-store",
    });
  
    if (!response.ok) {
      throw new Error(`Gagal mengambil data dari ${url}`);
    }
  
    return response.json();
  }
  
  // **Fetch Data Utama**
  async function fetchData(slugType: string) {
    const baseUrl = process.env.NEXT_PUBLIC_API_WEB_URL || "";
  
    const [settingsRes, servicesTypeRes, patientRes] = await Promise.all([
      fetchWithAuth("/api/settings"),
      fetchWithAuth(`/api/servicesType/${slugType}`),
      fetchWithAuth(`/api/patients?servicesType=${slugType}`),
    ]);
  
    return {
      servicesType: servicesTypeRes as ServiceType,
      patient: patientRes.patients || [],
      settings: settingsRes || { logo: "" },
      baseUrl,
    };
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
  
  // **Generate Metadata**
  export async function generateMetadata({ params }: Props): Promise<Metadata> {
    const { slugServices, slugList,slugType } = params;
    const { servicesType, baseUrl } = await fetchData(slugType);
  
    if (!servicesType) {
      return {
        title: "Layanan Tidak Ditemukan | NMW Aesthetic Clinic",
        description: "Halaman layanan yang Anda cari tidak tersedia.",
      };
    }
  
    // **Hapus Tag HTML dari Deskripsi**
    const plainText = servicesType?.description.replace(/<\/?[^>]+(>|$)/g, "") || "";
    const truncatedText = plainText.length > 156 ? plainText.slice(0, 156) + "..." : plainText;
  
    return {
      title: `${servicesType.name}`,
      description: truncatedText,
      keywords: (servicesType.keywords?.length
        ? servicesType.keywords
        : ["nmw clinic", "nmw", "nmw website"]
      ).join(", "),      
      openGraph: {
        title: `${servicesType.name}`,
        description: truncatedText,
        type: "website",
        url: `${baseUrl}/layanan/${slugServices}/${slugList}/${servicesType.slug}`,
        images: [
          {
            url: `${baseUrl}${servicesType.image}`,
            width: 800,
            height: 600,
            alt: `${servicesType.name}`,
          },
        ],
      },
      twitter: {
        card: "summary_large_image",
        title: `${servicesType.name}`,
        description: truncatedText,
        images: [`${baseUrl}${servicesType.image}`],
      },
      alternates: {
        canonical: `${baseUrl}/layanan/${slugServices}/${slugList}/${servicesType.slug}`,
      },
    };
  }

// **Server Component**
export default async function TipeLayanan({ params }: Props) {
  const { slugServices, slugList, slugType } = params;
  const { servicesType, patient, settings, baseUrl } = await fetchData(slugType);
  const servicesPage = await fetchServicePage();

  const plainText = servicesType?.description.replace(/<\/?[^>]+(>|$)/g, "") || "";
  const truncatedText = plainText.length > 156 ? plainText.slice(0, 156) + "..." : plainText;

  function formatText(text: string | undefined): string {
    if (!text) return "";
    return text.replace(/-/g, " ").replace(/\b\w/g, (char) => char.toUpperCase());
  }

  const cleanedDescription = servicesType?.description
  ? servicesType?.description.replace(/<\/?p>/g, "")
  : "Deskripsi tidak tersedia.";

  const formattedPhone = settings.phone?.startsWith("0")
  ? "62" + settings.phone.slice(1)
  : settings.phone;

  const formattedName = formatText(slugServices);
  const formattedNameList = formatText(slugList);

  // **Schema Data untuk SEO**
  const schemaData = {
    "@context": "https://schema.org",
    "@type": "WebPage",
    name: `${servicesType?.name}`,
    description: `${truncatedText}`,
    url: `${baseUrl}/layanan/${slugServices}/${slugList}/${servicesType.slug}`,
    publisher: {
      "@type": "Organization",
      name: `${settings.title}`,
      logo: {
        "@type": "ImageObject",
        url: `${baseUrl}${settings?.logo}`,
      },
    },
    mainEntityOfPage: {
      "@type": "WebPage",
      "@id": `${baseUrl}/layanan/${slugServices}/${slugList}/${servicesType.slug}`,
    },
    breadcrumb: {
      "@type": "BreadcrumbList",
      itemListElement: [
        { "@type": "ListItem", position: 1, name: `${settings.title}`, item: `${baseUrl}` },
        { "@type": "ListItem", position: 2, name: `${servicesPage.title}`, item: `${baseUrl}/layanan` },
        { "@type": "ListItem", position: 3, name: `${formattedName}`, item: `${baseUrl}/layanan/${slugServices}` },
        { "@type": "ListItem", position: 4, name: `${formattedNameList}`, item: `${baseUrl}/layanan/${slugServices}/${slugList}` },
        { "@type": "ListItem", position: 5, name: `${servicesType.name}`, item: `${baseUrl}/layanan/${slugServices}/${slugList}/${servicesType.slug}` },
      ],
    },
  };

  // **Jika data tidak ditemukan**
  if (!servicesType || !patient) {
    return (
      <div className={styles.emptyPage}>
        <Image src={notFound} alt="Data not found" width={400} height={300} />
        <h1>Layanan Tidak Ditemukan</h1>
      </div>
    );
  }

  return (
    <div>
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schemaData) }} />
        <div className={banner.banner}>
            <Image priority width={500} height={500} src={servicesType.image} alt={servicesType.name} />
        </div>
      <div className={breadcrumb.breadcrumb}>
        <h5><Link href={'/'}>Home</Link> / <Link href={`${process.env.NEXT_PUBLIC_API_WEB_URL}/layanan`}>Layanan</Link> / <Link href={`${process.env.NEXT_PUBLIC_API_WEB_URL}/layanan/${slugServices}`}>{formattedName}</Link> / <Link href={`${process.env.NEXT_PUBLIC_API_WEB_URL}/layanan/${slugServices}/${slugList}`}>{formattedNameList}</Link> / <span><Link href={`${process.env.NEXT_PUBLIC_API_WEB_URL}/layanan/${slugServices}/${slugList}/${servicesType.slug}`}>Pasien {servicesType.name}</Link></span></h5>
      </div>
      {/* Section 1 */}
      <div className={`${styles.section_1} ${styles.section_1_sc}`}>
        <div className={styles.section_1_heading}>
          <h1>
            {servicesType.name.split(" ")[0]}{" "}
            <span>{servicesType.name.split(" ").slice(1).join(" ")}</span>
          </h1>
        </div>
        <div className={styles.section_1_content}>
          <div
            className={styles.service_description}
            dangerouslySetInnerHTML={{
              __html: cleanedDescription,
            }}
          />
          <Link
            href={`https://api.whatsapp.com/send?phone=${formattedPhone}`}
            target="_blank"
          >
            <button className={styles.btn_layanan}>
              Buat Janji Temu Sekarang <FaWhatsapp />
            </button>
          </Link>
        </div>
      </div>

      <div className={`${styles.section_2} ${styles.section_2_sc}`}> 
        <div className={`${styles.heading_section}`}> 
          <h2>Pasien {servicesType.name.split(" ")[0]}{" "}
          <span>{servicesType.name.split(" ").slice(1).join(" ")}</span></h2>
        </div>
        <div className={styles.box_galeri_layout}>
          {patient.length > 0 ? (
            patient.map((galeriPatient: { _id: Key | null | undefined; image: any; name: any; description: string; slug: any; }) => (
              <div className={styles.box_galeri} key={galeriPatient._id}>
                {/* Image Section */}
                <div className={styles.box_galeri_image}>
                  <Image
                    priority
                    width={800}
                    height={800}
                    src={galeriPatient.image}
                    alt={galeriPatient.name || "Galeri Image"}
                  />
                  <div className={styles.button_image}> 
                    <button type="button">Sebelum</button>
                    <button type="button">Sesudah</button>
                  </div>
                </div>

                {/* Content Section */}
                <div className={styles.box_galeri_content}>
                  <div className={styles.box_galeri_heading}>
                    <h3>{galeriPatient.name || "Nama Tidak Tersedia"}</h3>
                  </div>
                  <div className={styles.box_galeri_text}>
                    <p>{galeriPatient.description.replace(/<\/?p>/g, "")}</p>
                  </div>
                </div>

                {/* Button Section */}
                <div className={styles.box_galeri_button}>
                  <Link href={`/layanan/${slugServices}/${slugList}/${slugType}/${galeriPatient.slug}`}>
                    <button type="button">
                      Lihat Gambar {galeriPatient.name || "Galeri"}
                    </button>
                  </Link>
                </div>
              </div>
            ))
          ) : (
            <div className={styles.empty}>
              <img src="../../../images/data_empty.webp" loading="lazy"/>
              <h1>Gambar Segera Hadir</h1>
            </div>
          )}
        </div>
      </div>
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
            src="/images/dokter_layanan.webp"
            alt="Dokter-dokter NMW Aesthetic Clinic"
            className={styles.our_dokter}
            loading="lazy"
          />
          <img
            src="/images/nmw_bg.webp"
            alt="Background Dokter"
            className={styles.bg_our_dokter}
            loading="lazy"
          />
          <div className={styles.section_4_content}>
            <p>
              Dokter NMW Aesthetic Clinic adalah dokter terpilih, terlatih secara
              profesional, dan terpercaya untuk melakukan bedah plastik,
              dermatologi, spesialis kulit dan kelamin, serta perawatan kulit
              estetik.
            </p>
            <p>
              Dokter kami telah menjalani pelatihan ekstensif dan memiliki
              keahlian untuk memberikan hasil luar biasa sekaligus memastikan
              keselamatan pasien.
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