"use client";

// import "jsvectormap/dist/jsvectormap.css";
import "flatpickr/dist/flatpickr.min.css";
import "@/css/satoshi.css";
import "@/css/style.css";
import React, { useEffect, useState, Suspense } from "react";
import Loader from "@/components/common/Loader";
import Providers from "./providers";
import ProgressBar from "@/components/ProgressBar/page";
import { useRouter } from "next/navigation";
import axios from "axios";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [loading, setLoading] = useState<boolean>(true);
  const [user, setUser] = useState<{ userId: string } | null>(null);
  const router = useRouter();

  useEffect(() => {
    const fetchDashboard = async () => {
      try {
        const { data } = await axios.get("/api/dashboard", {
          withCredentials: true,
        });
        setUser(data);
      } catch (error) {
        router.replace("/dashboard/login");
      } finally {
        setLoading(false);
      }
    };

    fetchDashboard();
  }, [router]);

  // Tampilkan Loader jika loading
  if (loading) {
    return (
      <div className="min-h-screen flex justify-center items-center">
        <Loader />
      </div>
    );
  }

  return (
    <Providers>
      <ProgressBar />
      <Suspense fallback={<Loader />}>
        {children}
      </Suspense>
    </Providers>
  );
}
