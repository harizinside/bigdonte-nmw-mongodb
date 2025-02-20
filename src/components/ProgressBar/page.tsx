"use client";

import { usePathname } from "next/navigation";
import { useEffect, useRef } from "react";
import nprogress from "nprogress";
import "nprogress/nprogress.css";

// Konfigurasi nprogress (opsional)
nprogress.configure({
  showSpinner: false,
  trickleSpeed: 200,
});

export default function ProgressBar() {
  const pathname = usePathname();
  const prevPathname = useRef(pathname);

  useEffect(() => {
    // Jika pathname berubah, mulai progress bar
    if (pathname !== prevPathname.current) {
      nprogress.start();
    }

    // Setelah beberapa waktu (misalnya 500ms), selesaikan progress bar
    const timer = setTimeout(() => {
      nprogress.done();
      prevPathname.current = pathname;
    }, 500);

    return () => clearTimeout(timer);
  }, [pathname]);

  return null;
}
