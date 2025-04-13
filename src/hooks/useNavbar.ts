import { useState, useEffect } from "react";

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

// Definisi tipe untuk data yang di-fetch
interface Social {
  link: string;
  title: string;
}

interface Settings {
  phone: string;
  logo: string;
  favicon: string;
  title: string;
  address_header: string;
  email: string;
  meta_description: string;
  direct_link: string;
}

export function useNavbar() {
  const [data, setData] = useState<{
    promos: any[];
    services: any[];
    articles: any[];
    settings: Settings;
    socials: Social[];
    loading: boolean;
    error: string | null;
  }>({
    promos: [],
    services: [],
    articles: [],
    settings: {
      phone: "",
      logo: "",
      favicon: "",
      title: "",
      address_header: "",
      email: "",
      meta_description: "",
      direct_link: ""
    },
    socials: [],
    loading: true,
    error: null,
  });

  useEffect(() => {
    async function fetchData() {
      try {
        const [settingsRes, promoRes, servicesRes, articlesRes, socialRes] = await Promise.all([
          fetchWithAuth(`/api/settings`),
          fetchWithAuth(`/api/promos`),
          fetchWithAuth(`/api/services?page=all`),
          fetchWithAuth(`/api/articles`),
          fetchWithAuth(`/api/social`),
        ]);

        setData({
          promos: promoRes.promos || [],
          services: Array.isArray(servicesRes.services) ? [...servicesRes.services].reverse() : [],
          articles: Array.isArray(articlesRes.articles) ? articlesRes.articles.slice(0, 3) : [],
          settings: settingsRes || {
            phone: "",
            logo: "",
            favicon: "",
            title: "",
            address_header: "",
            email: "",
            meta_description: "",
          },
          socials: Array.isArray(socialRes) ? socialRes : [],
          loading: false,
          error: null,
        });
      } catch (error) {
        setData((prev) => ({ ...prev, loading: false, error: "Gagal mengambil data navbar" }));
      }
    }

    fetchData();
  }, []);

  return data;
}
