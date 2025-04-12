import { Metadata } from "next";
import DokterClient from "./DokterClient";

interface PositionItem {
  _id: string;
  title: string;
}

interface Settings {
  logo: string; 
  title: string;
}

interface DoctorsPage {
  image: string;
  headline: string;
  title: string;
  description: string;
  keywords: string[];
}

async function fetchPosition(): Promise<PositionItem[]> {
  const baseUrl = process.env.NEXT_PUBLIC_API_WEB_URL || "";
  const response = await fetch(`${baseUrl}/api/position?page=all`, {
    method: "GET",
    headers: {
      Authorization: `Bearer ${process.env.NEXT_PUBLIC_API_SECRET_KEY}`,
    },
    cache: "no-store",
  });

  if (!response.ok) {
    throw new Error("Gagal mengambil data positions");
  }

  const data = await response.json();
  return data;
}

async function fetchSettings(): Promise<Settings> {
  const baseUrl = process.env.NEXT_PUBLIC_API_WEB_URL || "";
  const response = await fetch(`${baseUrl}/api/settings`, {
    method: "GET",
    headers: {
      Authorization: `Bearer ${process.env.NEXT_PUBLIC_API_SECRET_KEY}`,
    },
    cache: "no-store",
  });

  if (!response.ok) {
    throw new Error("Gagal mengambil data faq");
  }

  const data = await response.json();
  return data;
}

async function fetchDoctorPage(): Promise<DoctorsPage> {
  const baseUrl = process.env.NEXT_PUBLIC_API_WEB_URL || "";
  const response = await fetch(`${baseUrl}/api/doctorsPage`, {
    method: "GET",
    headers: {
      Authorization: `Bearer ${process.env.NEXT_PUBLIC_API_SECRET_KEY}`,
    },
    cache: "no-store",
  });

  if (!response.ok) { 
    throw new Error("Gagal mengambil data doctor");
  }

  const data = await response.json();
  return data;
}

export async function generateMetadata(): Promise<Metadata> {
    const doctorsPage = await fetchDoctorPage();
  
    const baseUrl = process.env.NEXT_PUBLIC_API_WEB_URL;
  
    return {
      title: `${doctorsPage.title}`,
      description: `${doctorsPage.description}`,
      keywords: [
        `${doctorsPage.keywords.join(", ")}`,
      ],
      openGraph: {
        title: `${doctorsPage.title}`,
        description: `${doctorsPage.description}`,
        type: "website",
        url: `${process.env.NEXT_PUBLIC_API_WEB_URL}/dokter-kami`,
        images: [
          {
            url: `${baseUrl}${doctorsPage.image}`,
            width: 800,
            height: 600,
            alt: `${doctorsPage.title}`,
          },
        ],
      },
      twitter: {
        card: "summary_large_image",
        title: `${doctorsPage.title}`,
        description: `${doctorsPage.description}`,
        images: [`${baseUrl}${doctorsPage.image}`],
      },
      alternates: {
        canonical: `${process.env.NEXT_PUBLIC_API_WEB_URL}/dokter-kami`,
      },
    }
};

export default async function DokterPage() {
  const positions = await fetchPosition();
  const settings = await fetchSettings();
  const doctorsPage = await fetchDoctorPage();
  return <DokterClient positions={positions} doctorsPage={doctorsPage} settings={settings} />;
}