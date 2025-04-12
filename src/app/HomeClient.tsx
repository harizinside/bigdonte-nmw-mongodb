"use client"

import styles from "@/css/Home.module.css";
import { FaWhatsapp } from "react-icons/fa";
import React, { useRef, useState, useEffect } from 'react';
// Import Swiper React components
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Controller } from "swiper/modules";
import Link from "next/link";
import { HiOutlineArrowLongRight } from "react-icons/hi2";

// Import Swiper styles
import 'swiper/css';
import 'swiper/css/effect-fade';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import { EffectFade, Pagination, Autoplay } from 'swiper/modules';
import Image from "next/image";

import type { Swiper as SwiperType } from "swiper";

interface HomeClientProps {
  settings: {
    logo: string;
    favicon: string;
    title: string;
    meta_description: string;
    phone: string;
    address_footer: string;
  };
  promos: any[];
  services: any[];
  articles: any[];
}

  export default function HomeClient({
    settings,
    promos,
    services,
    articles,
  }: HomeClientProps) {
  const [firstSwiper, setFirstSwiper] = useState<SwiperType | null>(null);
  const [secondSwiper, setSecondSwiper] = useState<SwiperType | null>(null);

  const baseUrl = process.env.NEXT_PUBLIC_API_WEB_URL || '';

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat("id-ID", {
      day: "numeric",
      month: "long",
      year: "numeric",
    }).format(date);
  };

  const midIndex = Math.ceil(services.length / 2);
  const firstHalf = services.slice(0, midIndex); // First half of the services
  const secondHalf = services.slice(midIndex);

  const formattedPhone =
  settings.phone && settings.phone.startsWith("0")
    ? "+62 " + settings.phone.slice(1).replace(/(\d{3})(\d{4})(\d{4})/, "$1-$2-$3")
    : settings.phone;

  const schemaData = {
      "@context": "https://schema.org",
      "@graph": [
          {
              "@type": "Organization",
              "name": `${settings.title}`,
              "url": `${baseUrl}`,
              "logo": `${baseUrl}${settings.logo}`,
              "description": `${settings.meta_description}`,
              "address": {
                  "@type": "PostalAddress",
                  "streetAddress": `${settings.address_footer}`,
                  "addressLocality": "Jakarta Selatan",
                  "addressRegion": "DKI Jakarta",
                  "postalCode": "12160",
                  "addressCountry": "ID"
              },
              "contactPoint": {
                  "@type": "ContactPoint",
                  "telephone": formattedPhone,
                  "contactType": "customer service",
                  "areaServed": "ID",
                  "availableLanguage": "Indonesian"
              },
          },
          {
              "@type": "WebSite",
              "name": `${settings.title}`,
              "url": `${baseUrl}`,
              "potentialAction": {
                  "@type": "SearchAction",
                  "target": `${baseUrl}/search?q={search_term_string}`,
                  "query-input": "required name=search_term_string"
              }
          }
      ]
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(schemaData),
        }}
      />
        <Swiper
          pagination={{
            clickable: true,
          }}
          effect={'fade'}
          loop={true}
          autoplay={{
            delay: 2500,
          }}
          modules={[EffectFade, Pagination, Autoplay]}
          className="myBanner"
        >
          {promos.map(promo => (
            <SwiperSlide key={promo._id}>
              <Link href={promo.link ? promo.link : `/promo/${promo.slug}`}>
                <div
                  className={styles.banner}
                  style={{ backgroundImage: `url(${baseUrl}${promo.image})` }}
                >
                </div>
              </Link>
            </SwiperSlide>
          ))}
        </Swiper>
      <div className={styles.section_1}>
        <div className={styles.heading_section}>
          <h2><span>Layanan</span> Kami</h2>
        </div>
          <div className={styles.slide_section_1}>
            <Swiper
              dir="rtl"
              navigation={true}
              modules={[Navigation, Controller]}
              className="mySwiper"
              loop={true}
              onSwiper={setSecondSwiper}
              controller={{ control: firstSwiper }}
            >
              {firstHalf.map((service) => (
                <SwiperSlide key={service._id}>
                  <div className={styles.box_service_layout}>
                    <div className={`${styles.box_service}`}>
                      <div className={styles.box_service_content}>
                        <h3>{service.name}</h3>
                        <p>
                          {service.description.replace(/<p[^>]*>/g, '').replace(/<\/p>/g, '')}
                        </p>

                        <Link href={`/layanan/${service.slug}`}>
                          <button>Lihat Detail</button>
                        </Link>
                      </div>
                      <div className={styles.box_service_image}>
                        <Image
                          width={500}
                          height={500}
                          src={service.imageCover}
                          alt={service.name}
                          priority
                        />
                      </div>
                    </div>
                  </div>
                </SwiperSlide>
              ))}
            </Swiper>

            <Swiper
              navigation={true}
              modules={[Navigation, Controller]}
              className="mySwiper mySwiperSecond"
              loop={true}
              onSwiper={setFirstSwiper}
              controller={{ control: secondSwiper }}
            >
              {secondHalf.map((service) => (
                <SwiperSlide key={service._id}>
                  <div
                    className={`${styles.box_service_layout} ${styles.box_service_layout_second}`}
                  >
                    <div className={`${styles.box_service} ${styles.box_service_second}`}>
                      <div className={styles.box_service_content}>
                        <h3>{service.name || service.name}</h3>
                        <p>
                          {service.description ? service.description.replace(/<p[^>]*>/g, '').replace(/<\/p>/g, '') : "Loading..."}
                        </p>

                        <Link href={`/layanan/${service.slug}`}>
                          <button>Lihat Detail</button>
                        </Link>
                      </div>
                      <div className={styles.box_service_image}>
                        <Image
                          width={500}
                          height={500}
                          src={service.imageCover}
                          alt={service.name}
                          priority
                        />
                      </div>
                    </div>
                  </div>
                </SwiperSlide>
              ))}
            </Swiper>
          </div>
      </div>
      <h1 className={styles.heading_hide}>Selamat Datang di Website NMW Aesthetic Clinic</h1>
      <div className={styles.section_2}>
        <div className={styles.heading_section}>
          <h2><span>Tentang</span> Kami</h2>
        </div>
        <div className={styles.section_2_text}>
          <div className={styles.section_2_img}>
            <Image width={700} height={700} src="/images/about_image.webp" priority alt="Tentang NMW Aesthetic Clinic" />
          </div>
          <p>Adalah merek Aesthetic, Skincare, Dermatology and Wellness Clinic yang berbasis di Jakarta, Indonesia. Nama NMW Skin Care berasal dari pendiri perusahaan dr. Nataliani Mawardi - dengan kata Mawar yang menandakan dan mewakili Mawar yang secara universal disamakan dengan keindahan dan keanggunan, dua nilai inti yang dengan bangga diperjuangkan NMW dan diwakili oleh pelanggan di Indonesia.</p>
          <Link href={"/cabang"}><button>Lihat Cabang Kami</button></Link>
        </div>
      </div>
      <div className={styles.section_3}>
        <div className={styles.heading_section_3}>
          <div className={`${styles.heading_section} ${styles.heading_section_start}`}>
            <h2><span>Pendiri</span></h2>
            <p>dr. Nataliani Mawardi, dipl. CIBTAC</p>
          </div>
        </div>
        <div className={styles.section_3_box}>
          <div className={styles.section_3_content}>
            <p>Dr. Nataliani Mawardi adalah seorang pendiri dari klinik kecantikan NMW yang kini menjadi salah satu klinik kepercayaan artis top nasional dan masyarakat luas untuk perawatan wajah.</p>
            <p>Dr. Nataliani memiliki pendirian “give back to community”. Melihat kurangnya kepedulian ibu-ibu di pasar membuat Dr. Nataliani berinisiatif memberikan konsultasi untuk jaga kesehatan.</p>
            <Link href={'/penghargaan'}><button>Lihat Lebih Lanjut</button></Link>
          </div>
          <img src="images/dr_nataliani.webp" loading="lazy" alt="Dr. Nataliani Mawardi, dipl. CIBTAC" className={styles.section_3_image} />
          <img src="images/blink_orange.svg" loading="lazy" className={styles.section_icon_1} alt="Blink Material" />
          <img src="images/blink_orange.svg" loading="lazy" className={styles.section_icon_2} alt="Blink Material" />
          <img src="images/blink_grey.svg" loading="lazy" className={styles.section_icon_3} alt="Blink Material" />
          <img src="images/blink_grey.svg" loading="lazy" className={styles.section_icon_4} alt="Blink Material" />
        </div>
      </div>
      <div className={styles.section_4}>
        <div className={styles.heading_section_4}>
          <div className={`${styles.heading_section} ${styles.heading_section_start}`}>
            <h2><span>Dokter</span> Kami</h2>
          </div>
        </div>
        <div className={styles.section_4_box}>
          <img src="images/nmw_dokter.webp" loading="lazy" alt="Dokter-dokter NMW Aesthetic Clinic" className={styles.our_dokter} />
          <img src="images/blink_orange.svg" loading="lazy" className={styles.section_icon_5} alt="Blink Material" />
          <img src="images/blink_grey.svg" loading="lazy" className={styles.section_icon_6} alt="Blink Material" />
          <div className={styles.section_4_content}>
            <p>Dokter NMW Aesthetic klinik adalah dokter terpilih, terlatih secara profesional, dan terpercaya untuk melakukan bedah plastik, dermatologi, spesialis kulit dan kelamin dan perawatan kulit ekstetika.</p>
            <p>Dokter kami telah menjalani pelatihan ekstensif dan memiliki keahlian untuk memberikan hasil luar biasa sekaligus memastikan keselamatan pasien.</p>
            <Link href={'/dokter-kami'}><button>Lihat Lebih Lanjut</button></Link>
          </div>
        </div>
      </div>
      <div className={styles.article_section}>
        <div className={`${styles.heading_section}`}>
          <h2><span>Artikel</span></h2>
        </div>
        <div className={styles.article_layout}>
          {articles.map(article => {
            const firstTag = article.tags?.[0] || "";

            return (
              <div className={styles.article_box} key={article._id}>
                <div className={styles.article_image}>
                  {firstTag && (
                    <Link href={`/artikel/tag/${firstTag.trim()}`}>
                      <button className={styles.tag_article_img}>#{firstTag.trim()}</button>
                    </Link>
                  )}
                  <Link href={`/artikel/${article.slug}`}>
                    <Image
                      width={500}
                      height={500}
                      src={article.image}
                      alt={article.title}
                      priority
                    />
                  </Link>
                </div>
                <div className={styles.article_content}>
                  <Link href={`/artikel/${article.slug}`}>
                    <div className={styles.article_heading}>
                      <h3>{article.title}</h3>
                    </div>
                  </Link>
                  <span>{article.author}, {formatDate(article.date)}</span>
                </div>
              </div>
            )
          })}
        </div>
        <Link href={"/artikel"}><button className={styles.btn_more}>Lihat Lebih Banyak</button></Link>
      </div>
      <div className={styles.section_5}>
        <div className={styles.section_5_box}>
          <div className={styles.section_5_layout}>
            <h4>Metode Pembayaran</h4>
            <div className={styles.section_5_logo}>
              <Image width={700} height={700} style={{ height: "auto", width: "100%" }} src="/images/logo_payment.webp" priority alt="Metode Pembayaran NMW Aesthetic Clinic" />
            </div>
          </div>
          <div className={styles.section_5_layout}>
            <h4>Bank Transfer</h4>
            <div className={styles.section_5_logo}>
              <Image width={700} height={700} style={{ height: "auto", width: "100%" }} src="/images/bank_transfer.webp" priority alt="Metode Pembayaran NMW Aesthetic Clinic" />
            </div>
          </div>
          <div className={styles.section_5_layout}>
            <h4>Terdaftar dan diawasi oleh</h4>
            <div className={`${styles.section_5_logo} ${styles.section_5_logo_small}`}>
              <Image width={700} height={700} style={{ height: "auto", width: "32%" }} priority src="/images/legality.webp" alt="Legalitas NMW Aesthetic Clinic" />
            </div>
          </div>
        </div>
      </div>
    </>
  );
}