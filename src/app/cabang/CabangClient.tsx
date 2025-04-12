"use client"

import styles from "@/css/Cabang.module.css";
import { FaWhatsapp } from "react-icons/fa";
import { SlLocationPin } from "react-icons/sl";
import Link from "next/link";
import Image from "next/image";

interface Branch {
  _id: number;
  name: string;
  address: string;
  operasional: string[];
  phone: string;
  image: string;
  location: string;
}

interface BranchProps {
  branchs: Branch[];
}

export default function BranchClient({ branchs }: BranchProps) {
  return (
    <div className={styles.cabang_layout}>
      {branchs.map((branch) => (
        <div className={styles.cabang_box} key={branch._id}>
          <div className={styles.cabang_box_image}>
            <Image
              width={500}
              height={500}
              src={branch.image}
              alt={branch.name}
              priority
            />
          </div>
          <div className={styles.cabang_box_content}>
            <h3>{branch.name}</h3>
            <div className={styles.cabang_box_text}>
              <div className={styles.cabang_box_detail}>
                <h4>Alamat</h4>
                <p>{branch.address}</p>
              </div>
              <div className={styles.cabang_box_detail}>
                <h4>Operasional</h4>
                <p>{branch.operasional[0]}</p>
                <p>{branch.operasional[1]}</p>
              </div>
              <div className={styles.cabang_box_detail}>
                <h4>Telepon</h4>
                <p>{branch.phone}</p>
              </div>
            </div>
            <div className={styles.cabang_box_button}>
              <Link
                href={`https://api.whatsapp.com/send/?phone=${branch.phone}&text=Hallo+admin+NMW+${branch.name}%2C+saya+pasien+baru+ingin+mendaftarkan+dan+melakukan+pembelian+produk+di+E-Commerce+Web+NMW+Aesthetic+Clinic&type=phone_number&app_absent=0`}
                target="_blank"
              >
                <button>
                  Pesan Sekarang <FaWhatsapp />
                </button>
              </Link>
              <Link href={branch.location} target="_blank">
                <button>
                  <SlLocationPin />
                </button>
              </Link>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}