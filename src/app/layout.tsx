"use client";
import "jsvectormap/dist/css/jsvectormap.css";
import "flatpickr/dist/flatpickr.min.css";
import "@/css/satoshi.css";
import "@/css/style.css";
import React, { useEffect, useState } from "react";
import Loader from "@/components/common/Loader";
import Providers from "./providers";
import ProgressBar from "@/components/ProgressBar/page";
import { useRouter } from "next/navigation";
import axios from "axios";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const [loading, setLoading] = useState<boolean>(true);
  const [user, setUser] = useState<{ userId: string } | null>(null);
  const router = useRouter();
  
  useEffect(() => {
    const fetchDashboard = async () => {
      try {
        const { data } = await axios.get("/api/dashboard", {
          withCredentials: true, // Pastikan cookie dikirim
        });
        setUser(data);
      } catch (error) {
        router.push("/login"); // Redirect ke login jika tidak ada token
      } finally {
        setLoading(false);
      }
    };
  
    fetchDashboard();
  }, [router]);

  return (
    <html lang="en">
      <body suppressHydrationWarning={true}>
      <ProgressBar />
        <Providers>
          {loading ? <Loader /> : children}
        </Providers>
      </body>
    </html>
  );
}
