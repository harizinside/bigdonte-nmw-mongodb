"use client";

import ECommerce from "@/components/Dashboard/E-commerce";
import DefaultLayout from "@/components/Layouts/DefaultLaout";
import TableEleven from "@/components/Tables/TableEleven";
import TableThree from "@/components/Tables/TableThree";
import Link from "next/link";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import axios from "axios";
import Loader from "@/components/common/Loader";

export default function Dashboard() {
  const [user, setUser] = useState<{ userId: string } | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const { data } = await axios.get("/api/dashboard", {
          withCredentials: true,
        });
        setUser(data);
      } catch (error) {
        router.push("/dashboard/login");
      } finally {
        setLoading(false);
      }
    };

    checkAuth();
  }, [router]);

  if (loading) return <Loader />; // Tampilkan loader saat cek login
  if (!user) return null; // Sembunyikan konten jika belum login

  return (
    <DefaultLayout>
      <div className="mb-5">
        <h1>Dashboard</h1>
      </div>
      <ECommerce />
      <div className="flex flex-col gap-5 mt-9">
        <TableEleven limit={5} showPagination={false} />
        <Link href={"/articles"}>
          <button className="flex w-max justify-center m-auto gap-2 rounded-[7px] bg-primary p-[9px] px-5 font-medium text-white hover:bg-opacity-90">
            See Other
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="22"
              height="22"
              viewBox="0 0 24 24"
            >
              <path
                fill="none"
                stroke="currentColor"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeMiterlimit="10"
                strokeWidth="1.5"
                d="m14 16l4-4m0 0l-4-4m4 4H6"
              />
            </svg>
          </button>
        </Link>
      </div>
      <div className="flex flex-col gap-5 mt-9">
        <TableThree limit={5} showPagination={false} />
        <Link href={"/doctors"}>
          <button className="flex w-max justify-center m-auto gap-2 rounded-[7px] bg-primary p-[9px] px-5 font-medium text-white hover:bg-opacity-90">
            See Other
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="22"
              height="22"
              viewBox="0 0 24 24"
            >
              <path
                fill="none"
                stroke="currentColor"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeMiterlimit="10"
                strokeWidth="1.5"
                d="m14 16l4-4m0 0l-4-4m4 4H6"
              />
            </svg>
          </button>
        </Link>
      </div>
    </DefaultLayout>
  );
}
