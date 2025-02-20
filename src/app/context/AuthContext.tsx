"use client";

import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from "react";
import { useRouter } from "next/navigation";

interface AuthContextProps {
  token: string | null;
  setToken: (token: string | null, expiresIn?: number) => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextProps>({
  token: null,
  setToken: () => {},
  logout: () => {},
});

export const useAuth = () => useContext(AuthContext);

interface AuthProviderProps {
  children: ReactNode;
}

export default function AuthProvider({ children }: AuthProviderProps) {
  const [token, setTokenState] = useState<string | null>(null);
  const router = useRouter();

  // Timer untuk auto logout
  useEffect(() => {
    let logoutTimer: NodeJS.Timeout;

    const expiry = localStorage.getItem("tokenExpiry");
    if (token && expiry) {
      const expiryTime = parseInt(expiry, 10);
      const currentTime = Date.now();
      const remainingTime = expiryTime - currentTime;

      if (remainingTime <= 0) {
        logout();
      } else {
        // Set timeout untuk logout otomatis ketika waktu habis
        logoutTimer = setTimeout(() => {
          logout();
        }, remainingTime);
      }
    }

    // Bersihkan timeout saat token berubah atau komponen di-unmount
    return () => {
      if (logoutTimer) {
        clearTimeout(logoutTimer);
      }
    };
  }, [token]);

  // Saat komponen mount, cek token dan expiry di localStorage
  useEffect(() => {
    const storedToken = localStorage.getItem("token");
    const expiry = localStorage.getItem("tokenExpiry");

    if (storedToken && expiry) {
      const expiryTime = parseInt(expiry, 10);
      const currentTime = Date.now();

      if (currentTime < expiryTime) {
        setTokenState(storedToken);
      } else {
        logout();
      }
    }
  }, []);

  // Fungsi untuk mengupdate token dan mengatur waktu kedaluwarsa
  const setToken = (newToken: string | null, expiresIn: number = 3600) => {
    if (newToken) {
      const expiryTime = Date.now() + expiresIn * 1000; // Konversi detik ke milidetik
      localStorage.setItem("token", newToken);
      localStorage.setItem("tokenExpiry", expiryTime.toString());
      setTokenState(newToken);
    } else {
      logout();
    }
  };

  // Fungsi logout untuk menghapus token
  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("tokenExpiry");
    setTokenState(null);
    router.push("/login"); // Arahkan ke halaman login
  };

  // Proteksi halaman utama ("/"), jika belum login, redirect ke "/login"
  useEffect(() => {
    if (!token && window.location.pathname === "/") {
      router.push("/login");
    }
  }, [token, router]);

  return (
    <AuthContext.Provider value={{ token, setToken, logout }}>
      {children}
    </AuthContext.Provider>
  );
}
