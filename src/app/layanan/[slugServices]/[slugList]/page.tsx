import { Metadata } from "next";
import ServicesListClient from "./ServicesListClient";

interface Props {
  params: {
    slugServices: string;
    slugList: string;
  };
}

async function fetchWithAuth(url: string) {
    const baseUrl = process.env.NEXT_PUBLIC_API_WEB_URL || "";
  
    const response = await fetch(`${baseUrl}${url}`, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${process.env.NEXT_PUBLIC_API_SECRET_KEY}`,
      },
    });
  
    if (!response.ok) {
      throw new Error(`Gagal mengambil data dari ${url}`);
    }
  
    return response.json();
  }
  

async function fetchData(slugList: string) {
    const baseUrl = process.env.NEXT_PUBLIC_API_WEB_URL || "";
  
    const [servicesListRes, servicesTypeRes, settingsRes] = await Promise.all([
      fetchWithAuth(`/api/servicesList/${slugList}`),
      fetchWithAuth(`/api/servicesType?servicesList=${slugList}`),
      fetchWithAuth(`/api/settings`),
    ]);
  
    return {
      servicesList: servicesListRes || null,
      servicesType: servicesTypeRes.servicesType || [],
      settings: settingsRes || { phone: "" },
      baseUrl,
    };
  }
  

// Generate metadata untuk SEO
export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slugServices, slugList } = params;
  const { servicesList, baseUrl } = await fetchData(slugList);

  const plainText = servicesList?.description.replace(/<\/?[^>]+(>|$)/g, "") || "";
  const truncatedText = plainText.length > 156 ? plainText.slice(0, 156) + "..." : plainText;

  return {

    title: `${servicesList.name} | NMW Aesthetic Clinic`,
      description:
        `${truncatedText}`,
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
        title: `${servicesList.name} | NMW Aesthetic Clinic`,
        description:
          `${truncatedText}`,
        type: "website",
        url: `${baseUrl}/layanan/${slugServices}/${slugList}`,
        images: [
          {
            url: `${baseUrl}${servicesList.imageBanner}`,
            width: 800,
            height: 600,
            alt: `${servicesList.name} | NMW Aesthetic Clinic`,
          },
        ],
      },
      twitter: {
        card: "summary_large_image",
        title: `${servicesList.name} | NMW Aesthetic Clinic`,
        description:
          `${truncatedText}`,
        images: [`${baseUrl}${servicesList.imageBanner}`],
      },
      alternates: {
        canonical: `${baseUrl}/layanan/${slugServices}/${slugList}`,
      },
  };
}

// Komponen utama halaman
export default async function JenisLayanan({ params }: Props) {
  const { slugServices, slugList } = params;
  const { servicesList, servicesType, settings } = await fetchData(slugList);

  if (!servicesList || !servicesType) {
    return <div className="emptyPage">Layanan tidak ditemukan</div>;
  }

  return (
    <ServicesListClient
      servicesList={servicesList}
      servicesType={servicesType}
      settings={settings}
      slugServices={slugServices}
    />
  );
}
