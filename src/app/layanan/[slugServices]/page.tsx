import Image from "next/image";
import Link from "next/link";
import { FaWhatsapp } from "react-icons/fa";
import banner from "@/css/Banner.module.css";
import styles from "@/css/Layanan.module.css";
import breadcrumb from "@/css/Breadcrumb.module.css";
import notFound from "../../../../public/images/data_empty.webp"
import { StaticImport } from "next/dist/shared/lib/get-img-props";
import { JSXElementConstructor, Key, ReactElement, ReactNode, ReactPortal } from "react";
import { Metadata } from "next";

interface Service {
  name: string;
  description: string;
  slug: string;
}

interface Patient {
  id: number;
  name: string;
}

interface Settings {
  logo: string;
}

interface ServicesPage {
  image: string;
  headline: string;
  title: string;
  description: string;
  keywords: string[];
}

interface Props {
  params: { slugServices: string };
}

// **Fetch data dari API secara langsung**
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
  
  // Fungsi utama untuk fetch semua data
  async function fetchData(slugServices: string) {
    const baseUrl = process.env.NEXT_PUBLIC_API_WEB_URL || "";
  
    const [settingsRes, servicesRes, patientRes, servicesListRes] = await Promise.all([
      fetchWithAuth("/api/settings"),
      fetchWithAuth(`/api/services/${slugServices}`),
      fetchWithAuth(`/api/patients?services=${slugServices}`),
      fetchWithAuth(`/api/servicesList?services=${slugServices}`),
    ]);
  
    return {
      services: servicesRes,
      patient: patientRes.patients || [],
      servicesList: servicesListRes.servicesList.reverse() || [],
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

  export async function generateMetadata({ params }: Props): Promise<Metadata> {
    const { slugServices } = params;
    const { services, baseUrl } = await fetchData(slugServices);

    const plainText = services?.description.replace(/<\/?[^>]+(>|$)/g, "") || "";
    const truncatedText = plainText.length > 156 ? plainText.slice(0, 156) + "..." : plainText;
  
    return {
      title: `${services.name}`,
      description:
        `${truncatedText}`,
      keywords: (services.keywords?.length
        ? services.keywords
        : ["nmw clinic", "nmw", "nmw website"]
      ).join(", "),
      openGraph: {
        title: `${services.name}`,
        description:
          `${truncatedText}`,
        type: "website",
        url: `${baseUrl}/layanan/${services.slug}`,
        images: [
          {
            url: `${baseUrl}${services.imageCover}`,
            width: 800,
            height: 600,
            alt: `${services.name}`,
          },
        ],
      },
      twitter: {
        card: "summary_large_image",
        title: `${services.name}`,
        description:
          `${truncatedText}`,
        images: [`${baseUrl}${services.imageCover}`],
      },
      alternates: {
        canonical: `${baseUrl}/layanan/${services.slug}`,
      },
    };
  }

// **Server Component**
export default async function Layanan({ params }: Props) {
  const { slugServices } = params;
  const { services, patient, servicesList, settings, baseUrl } = await fetchData(slugServices);
  const servicesPage = await fetchServicePage();

  const plainText = services?.description.replace(/<\/?[^>]+(>|$)/g, "") || "";
  const truncatedText = plainText.length > 156 ? plainText.slice(0, 156) + "..." : plainText;
  // **Schema Data untuk SEO**
  const schemaData = {
    "@context": "https://schema.org",
    "@type": "WebPage",
    name: `${services?.name}`,
    description: `${truncatedText}`,
    url: `${baseUrl}/layanan/${services?.slug}`,
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
      "@id": `${baseUrl}/layanan/${services?.slug}`,
    },
    breadcrumb: {
      "@type": "BreadcrumbList",
      itemListElement: [
        { "@type": "ListItem", position: 1, name: `${settings.title}`, item: `${baseUrl}` },
        { "@type": "ListItem", position: 2, name: `${servicesPage.title}`, item: `${baseUrl}/layanan` },
        { "@type": "ListItem", position: 3, name: `${services?.name}`, item: `${baseUrl}/layanan/${services?.slug}` },
      ],
    },
  };

  // **Jika data tidak ditemukan**
  if (!services || !patient || !servicesList) {
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
            <Image priority width={500} height={500} src={services.imageBanner} alt={services.name} />
        </div>
        <div className={breadcrumb.breadcrumb}>
            <h5><Link href={'/'}>Home</Link> / <Link href={`${baseUrl}/layanan`}>Layanan</Link> / <span><Link href={`${baseUrl}/layanan/${services.slug}`}>{services.name}</Link></span></h5>
        </div>
        <div className={styles.section_1}>
            <div className={styles.section_1_heading}>
            <h1>
                <span>{services.name.split(' ')[0]} </span>
                {services.name.split(' ').slice(1).join(' ')}
            </h1>

            <Link href={`https://api.whatsapp.com/send?phone=${services.phone}`} target="blank_"><button className={styles.btn_layanan}>Buat Janji Temu Sekarang <FaWhatsapp /></button></Link>
            </div>
            <div className={styles.section_1_content}>
            <div className={styles.service_description} dangerouslySetInnerHTML={{ __html: services.description }} />
            </div>
        </div>

        {patient.length > 0 && (
            <div className={styles.section_2}>
            <div className={styles.heading_section}>
                <h2>
                <span>Galeri</span> {services.name}
                </h2>
            </div>
            <div className={styles.box_galeri_layout}>
                {patient.map((galeriPatient: { _id: Key | null | undefined; image: string | StaticImport; name: any; description: string; id_servicesList: { slug: any; }; id_servicesType: { slug: any; }; slug: any; }) => (
                <div className={styles.box_galeri} key={galeriPatient._id}>
                    {/* Image Section */}
                    <div className={styles.box_galeri_image}>
                    <Image
                        width={800}
                        height={800}
                        priority
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
                        <h3>{galeriPatient.name || "Judul Tidak Tersedia"}</h3>
                    </div>
                    <div className={styles.box_galeri_text}>
                        <p>{galeriPatient.description.replace(/<\/?p>/g, "") || "Deskripsi tidak tersedia"}</p>
                    </div>
                    </div>
                    <div className={styles.box_galeri_button}>
                    <Link href={`/layanan/${slugServices}/${galeriPatient.id_servicesList.slug}/${galeriPatient.id_servicesType.slug}/${galeriPatient.slug}`}>
                        <button type="button">
                        Lihat Gambar {galeriPatient.name || "Galeri"}
                        </button>
                    </Link>
                    </div>
                </div>
                ))}
            </div>
            </div>
        )}

        {services && services.template !== undefined && (
            <div className={styles.section_3}>
            <div className={styles.heading_section}>
                <h2>
                <span>Jenis</span> Layanan
                </h2>
            </div>

            {/* Jika template === false, tampilkan layout service */}
            {services.template === false && servicesList.length > 0 && (
                <div className={styles.box_service_layout}>
                {servicesList.map((typeService: { _id: Key | null | undefined; imageCover: string | StaticImport; title: string; name: string | number | boolean | ReactElement<any, string | JSXElementConstructor<any>> | Iterable<ReactNode> | ReactPortal | null | undefined; description: string; slug: any; }) => (
                    <div className={styles.box_service} key={typeService._id}>
                    <div className={styles.box_service_image}>
                        <Image
                        width={800}
                        height={800}
                        priority
                        src={typeService.imageCover}
                        alt={typeService.title}
                        />
                    </div>
                    <div className={styles.box_service_content}>
                        <h3>{typeService.name}</h3>
                        <p className={styles.service_description}>
                        {typeService.description.replace(/<\/?p>/g, "")}
                        </p>
                    </div>
                    <div className={styles.box_service_btn}>
                        <Link href={`/layanan/${services.slug}/${typeService.slug}`}>
                        <button>Lihat Detail</button>
                        </Link>
                    </div>
                    </div>
                ))}
                </div>
            )}

            {/* Jika template === true, tampilkan layout galeri */}
            {services.template === true && servicesList.length > 0 && (
                <div className={styles.box_galeri_layout}>
                {servicesList.map((typeService: { slug: any; _id: Key | null | undefined; imageCover: string | StaticImport; name: string | number | boolean | ReactElement<any, string | JSXElementConstructor<any>> | Iterable<ReactNode> | null | undefined; }) => (
                    <Link href={`/layanan/${services.slug}/${typeService.slug}`} key={typeService._id}>
                    <div className={styles.box_galeri}>
                        <div className={styles.box_galeri_image}>
                        <div className={styles.box_galeri_overlay}></div>
                        <Image
                            priority
                            width={800}
                            height={800}
                            src={typeService.imageCover}
                            alt={typeof typeService.name === "string" ? typeService.name : "Gambar layanan"} 
                        />

                        <div className={`${styles.button_image} ${styles.button_image_sc}`}>
                            <button>{typeService.name}</button>
                        </div>
                        </div>
                    </div>
                    </Link>
                ))}
                </div>
            )}
            </div>
        )}

        <div className={styles.section_4}>
            <div className={styles.heading_section_4}>
            <div className={`${styles.heading_section} ${styles.heading_section_start}`}>
                <h2><span>Dokter</span> Kami</h2>
            </div>
            </div>
            <div className={styles.section_4_box}>
            <img src="../images/dokter_layanan.webp" alt="Dokter-dokter NMW Aesthetic Clinic" loading='lazy' className={styles.our_dokter} />
            <img src="../images/nmw_bg.webp" alt="Dokter-dokter NMW Aesthetic Clinic" loading='lazy' className={styles.bg_our_dokter} />
            <div className={styles.section_4_content}>
                <p>Dokter NMW Aesthetic Clinic adalah dokter terpilih, terlatih secara profesional, dan terpercaya untuk melakukan bedah plastik, dermatologi, spesialis kulit dan kelamin dan perawatan kulit ekstetika.</p>
                <p>Dokter kami telah menjalani pelatihan ekstensif dan memiliki keahlian untuk memberikan hasil luar biasa sekaligus memastikan keselamatan pasien.</p>
                <Link href={'/dokter-kami'}><button>Lihat Lebih Lanjut</button></Link>
            </div>
            </div>
        </div>
    </div>
  );
}