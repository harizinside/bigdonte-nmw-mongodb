"use client"
import "@/css/global.css";
import Navbar from "@/components/Navbar/page";
import Footer from "@/components/Footer/page";
import { usePathname } from "next/navigation";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();

  // Cek apakah berada di dashboard
  const isDashboard = pathname.startsWith("/dashboard");

  return (
    <html lang="id">
      <body>
        {!isDashboard && <Navbar />}
        {children}
        {!isDashboard && <Footer />}
      </body>
    </html>
  );
}
