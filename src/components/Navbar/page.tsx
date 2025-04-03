import { Metadata } from "next";
import NavbarClient from "./NavbarClient";

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


async function fetchData() {
  const baseUrl = process.env.NEXT_PUBLIC_API_WEB_URL || "";

  const [settingsRes, promoRes, servicesRes, articlesRes, socialRes] = await Promise.all([
    fetchWithAuth(`/api/settings`),
    fetchWithAuth(`/api/promos`),
    fetchWithAuth(`/api/services`),
    fetchWithAuth(`/api/articles`),
    fetchWithAuth(`/api/social`),
  ]);

  return {
    promos: promoRes.promos || [],
    services: Array.isArray(servicesRes.services) ? [...servicesRes.services].reverse() : [],
    articles: articlesRes.articles.slice(0, 3) || [],
    settings: settingsRes || { phone: "", logo: "", favicon: "", title: "", address_header: "", email: "", meta_description: "" },
    socials: socialRes || [],
    baseUrl,
  };
}

export default async function Navbar() {
  const { settings, promos, services, articles, socials } = await fetchData();

  return <NavbarClient 
          settings={settings}
          promos={promos}
          services={services}
          articles={articles}
          socials={socials}
         />;
}