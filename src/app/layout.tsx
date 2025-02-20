"use client";
import "jsvectormap/dist/css/jsvectormap.css";
import "flatpickr/dist/flatpickr.min.css";
import "@/css/satoshi.css";
import "@/css/style.css";
import React, { useEffect, useState } from "react";
import Loader from "@/components/common/Loader";
import Providers from "./providers";
import { useAuth } from "./context/AuthContext";
import { useRouter } from "next/navigation";
import ProgressBar from "@/components/ProgressBar/page";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [loading, setLoading] = useState<boolean>(true);

  // const pathname = usePathname();

  useEffect(() => {
    setTimeout(() => setLoading(false), 1000);
  }, []);

  const { token } = useAuth();
  const router = useRouter();

    useEffect(() => {
      if (!token) {
        router.push("/login");
      }
    }, [token, router]);

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
