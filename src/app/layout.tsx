import "@/css/global.css";
import LayoutWrapper from "@/components/LayoutWrapper/page";
import Script from "next/script"; 

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

  const [settingsRes] = await Promise.all([
    fetchWithAuth(`/api/settings`),
  ]);

  return {
    settings: settingsRes || { phone: "", logo: "", favicon: "", title: "", address_footer: "", meta_description: "" },
    baseUrl,
  };
}

export async function generateMetadata() {
  const { settings, baseUrl } = await fetchData();

  return {
    title: settings.title || "Judul Default",
    description: settings.meta_description,
    robots: "index, follow",
    icons: {
      icon: `${baseUrl}${settings.favicon}`,
      apple: `${baseUrl}${settings.favicon}`,
    },
  };
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="id">
      <head>
        <Script
          async
          src="https://www.googletagmanager.com/gtag/js?id=G-TX18KNDEWY"
        />
        <Script id="google-analytics">
          {`
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());

            gtag('config', 'G-TX18KNDEWY');
          `}
        </Script>
        
      </head>
      <body>
        <LayoutWrapper>{children}</LayoutWrapper>
      </body>
    </html>
  );
}