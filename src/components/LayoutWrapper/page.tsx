"use client";
import { usePathname } from "next/navigation";
import Navbar from "@/components/Navbar/page";
import Footer from "@/components/Footer/page";

export default function LayoutWrapper({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isDashboard = pathname.startsWith("/dashboard");

  return (
    <>
      {!isDashboard && <Navbar />}
      {children}
      {!isDashboard && <Footer />}
    </>
  );
}
