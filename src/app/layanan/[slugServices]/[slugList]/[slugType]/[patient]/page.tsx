import Image from "next/image";
import Link from "next/link";
import { FaWhatsapp } from "react-icons/fa";
import banner from "@/css/Banner.module.css";
import styles from "@/css/Layanan.module.css";
import breadcrumb from "@/css/Breadcrumb.module.css";
import notFound from "../../../../../../../public/images/data_empty.webp"
import { Metadata } from "next";

// **Tipe Data untuk Props**
interface ServiceType {
    _id: number;
    name: string;
    slug: string;
    image: string;
    imageSecond: string;
    description: string;
    keywords: string[];
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
    params: { slugServices: string; slugList: string; slugType: string, patient: string };
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
  async function fetchData(patient: string) {
    const baseUrl = process.env.NEXT_PUBLIC_API_WEB_URL || "";
  
    const [settingsRes, servicesTypeRes,] = await Promise.all([
      fetchWithAuth("/api/settings"),
      fetchWithAuth(`/api/patients/${patient}`),
    ]);
  
    return {
      patientsType: servicesTypeRes as ServiceType,
      settings: settingsRes || { logo: "", title: "" },
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
    const { patient, slugServices, slugList, slugType } = params;
    const { patientsType, baseUrl } = await fetchData(patient);
  
    if (!patientsType) {
      return {
        title: "Layanan Tidak Ditemukan | NMW Aesthetic Clinic",
        description: "Halaman layanan yang Anda cari tidak tersedia.",
      };
    }

    const plainText = patientsType?.description.replace(/<\/?[^>]+(>|$)/g, "") || "";
    const truncatedText = plainText.length > 156 ? plainText.slice(0, 156) + "..." : plainText;
  
    return {
      title: `${patientsType.name}`,
      description: `${truncatedText}`,
      keywords: (patientsType.keywords?.length
        ? patientsType.keywords
        : ["nmw clinic", "nmw", "nmw website", "Pasien NMW Aesthetic Clinic", "Pasien NMW", "Pasien NMW Bedah Plastik", "Pasien NMW Dermatologi", "Pasien NMW Spesialis Kulit dan Kelamin", "Pasien NMW Perawatan Kulit Estetik"]
      ).join(", "), 
      openGraph: {
        title: `${patientsType.name}`,
        description: `${truncatedText}`,
        type: "website",
        url: `${baseUrl}/layanan/${slugServices}/${slugList}/${patientsType.slug}`,
        images: [
          {
            url: `${baseUrl}${patientsType.image}`,
            width: 800,
            height: 600,
            alt: `${patientsType.name}`,
          },
        ],
      },
      twitter: {
        card: "summary_large_image",
        title: `${patientsType.name}`,
        description: `${truncatedText}`,
        images: [`${baseUrl}${patientsType.image}`],
      },
      alternates: {
        canonical: `${baseUrl}/layanan/${slugServices}/${slugList}/${slugType}/${patientsType.slug}`,
      },
    };
  }

// **Server Component**
export default async function Patient({ params }: Props) {
  const { slugServices, slugList, slugType, patient } = params;
  const { patientsType, settings, baseUrl } = await fetchData(patient);
  const servicesPage = await fetchServicePage();

  function formatText(text: string | undefined): string {
    if (!text) return "";
    return text.replace(/-/g, " ").replace(/\b\w/g, (char) => char.toUpperCase());
  }

  const plainText = patientsType?.description.replace(/<\/?[^>]+(>|$)/g, "") || "";
  const truncatedText = plainText.length > 156 ? plainText.slice(0, 156) + "..." : plainText;

  const formattedPhone = settings.phone?.startsWith("0")
  ? "62" + settings.phone.slice(1)
  : settings.phone;

  const formattedName = formatText(slugServices);
  const formattedNameList = formatText(slugList);
  const formattedNameType = formatText(slugType);

  // **Schema Data untuk SEO**
  const schemaData = {
    "@context": "https://schema.org",
    "@type": "WebPage",
    name: `${patientsType?.name}`,
    description: `${truncatedText}`,
    url: `${baseUrl}/layanan/${slugServices}/${slugList}/${slugType}/${patientsType.slug}`,
    publisher: {
      "@type": "Organization",
      name: `${settings?.title}`,
      logo: {
        "@type": "ImageObject",
        url: `${baseUrl}${settings?.logo}`,
      },
    },
    mainEntityOfPage: {
      "@type": "WebPage",
      "@id": `${baseUrl}/layanan/${slugServices}/${slugList}/${slugType}/${patientsType.slug}`,
    },
    breadcrumb: {
      "@type": "BreadcrumbList",
      itemListElement: [
        { "@type": "ListItem", position: 1, name: `${settings?.title}`, item: `${baseUrl}` },
        { "@type": "ListItem", position: 2, name: `${servicesPage.title}`, item: `${baseUrl}/layanan` },
        { "@type": "ListItem", position: 3, name: `${formattedName}`, item: `${baseUrl}/layanan/${slugServices}` },
        { "@type": "ListItem", position: 4, name: `${formattedNameList}`, item: `${baseUrl}/layanan/${slugServices}/${slugList}` },
        { "@type": "ListItem", position: 5, name: `${formattedNameType}`, item: `${baseUrl}/layanan/${slugServices}/${slugList}/${slugType}` },
        { "@type": "ListItem", position: 6, name: `${patientsType.name}`, item: `${baseUrl}/layanan/${slugServices}/${slugList}/${slugType}/${patientsType.slug}` },
      ],
    },
  };

  // **Jika data tidak ditemukan**
  if (!patientsType) {
    return (
      <div className={styles.emptyPage}>
        <Image src={notFound} alt="Data not found" width={400} height={300} />
        <h1>Pasien Tidak Ditemukan</h1>
      </div>
    );
  }

  return (
    <div>
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schemaData) }} />
        <div className={banner.banner}>
         <Image
          priority
          width={800}
          height={800}
          src={patientsType.imageSecond}
          alt={patientsType.name || "Banner image"}
        />
      </div>
      <div className={breadcrumb.breadcrumb}>
          <h5><Link href={'/'}>Home</Link> / <Link href={`${baseUrl}/layanan`}>Layanan</Link> / <Link href={`${baseUrl}/layanan/${slugServices}`}>{formattedName}</Link> / <Link href={`${baseUrl}/layanan/${slugServices}/${slugList}`}>{formattedNameList}</Link> / <Link href={`${baseUrl}/layanan/${slugServices}/${slugList}/${slugType}`}>Pasien {formattedNameType}</Link> / <span>{patientsType.name}</span></h5>
      </div>

      {/* Section 1 */}
      <div className={`${styles.section_1} ${styles.section_1_sc}`}>
        <div className={styles.section_1_heading}>
          <h1> 
             {patientsType.name.split(" ")[0]}{" "}
            <span>{patientsType.name.split(" ").slice(1).join(" ")}</span>
          </h1>
        </div>
        <div className={styles.section_1_content}>
          <div
            className={styles.service_description}
            dangerouslySetInnerHTML={{
              __html: patientsType.description || "Deskripsi tidak tersedia.",
            }}
          />
          <p>Hasil individu bervariasi <br/> <br/>
          Dibawah ini adalah gambar sebelum dan sesudah pasien yang melalukan tindakan operasi Blepharoplasty di NMW Bedah Plastik. Harap diperhatikan bahwa setiap hasil pasien sebelum dan sesudah berbeda. Silahkan hubungi Customer Service kami apabila ingin bertanya lebih lanjut.</p>
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
       <div className={`${styles.section_2} ${styles.section_2_sc} ${styles.section_2_patient}`}>
         <div className={styles.patient_galeri_layout}>
           {/* Map over the patient data */}
           {patientsType ? (
            <>
            <div className={styles.box_galeri} key={patientsType._id}>
              {/* Gambar Pasien */}
              <div className={styles.box_galeri_image}>
                <Image
                  priority
                  width={800}
                  height={800}
                  src={patientsType.image}
                  alt={patientsType.name || "Galeri Image"}
                />
                <div className={styles.button_image}>
                  <button type="button">Sebelum</button>
                  <button type="button">Sesudah</button>
                </div>
              </div>
            </div>
            <div className={styles.box_galeri} key={patientsType._id}>
              {/* Gambar Pasien */}
              <div className={styles.box_galeri_image}>
                <Image
                  priority
                  width={800}
                  height={800}
                  src={patientsType.imageSecond}
                  alt={patientsType.name || "Galeri Image"}
                />
                <div className={styles.button_image}>
                  <button type="button">Sebelum</button>
                  <button type="button">Sesudah</button>
                </div>
              </div>
            </div>
            </>
          ) : (
            <p>Data pasien tidak tersedia.</p>
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