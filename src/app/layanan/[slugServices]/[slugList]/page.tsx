import { Metadata } from "next";
import ServicesListClient from "./ServicesListClient";

interface Props {
  params: {
    slugServices: string;
    slugList: string;
  };
}

interface ServicesPage {
  image: string;
  headline: string;
  title: string;
  description: string;
  keywords: string[];
}


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
  

// Generate metadata untuk SEO
export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slugServices, slugList } = params;
  const { servicesList, baseUrl } = await fetchData(slugList);

  const plainText = servicesList?.description.replace(/<\/?[^>]+(>|$)/g, "") || "";
  const truncatedText = plainText.length > 156 ? plainText.slice(0, 156) + "..." : plainText;

  return {

    title: `${servicesList.name}`,
      description:
        `${truncatedText}`,
        keywords: (servicesList.keywords?.length
          ? servicesList.keywords
          : ["nmw clinic", "nmw", "nmw website"]
        ).join(", "),
      openGraph: {
        title: `${servicesList.name}`,
        description:
          `${truncatedText}`,
        type: "website",
        url: `${baseUrl}/layanan/${slugServices}/${slugList}`,
        images: [
          {
            url: `${baseUrl}${servicesList.imageBanner}`,
            width: 800,
            height: 600,
            alt: `${servicesList.name}`,
          },
        ],
      },
      twitter: {
        card: "summary_large_image",
        title: `${servicesList.name}`,
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
  const servicesPage = await fetchServicePage();

  if (!servicesList || !servicesType) {
    return <div className="emptyPage">Layanan tidak ditemukan</div>;
  }

  return (
    <ServicesListClient
      servicesPage={servicesPage}
      servicesList={servicesList}
      servicesType={servicesType}
      settings={settings}
      slugServices={slugServices}
    />
  );
}
