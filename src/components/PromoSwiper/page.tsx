// components/PromoSwiper.tsx
"use client";

import { Swiper, SwiperSlide } from "swiper/react";
import { EffectFade, Pagination, Autoplay } from "swiper/modules";
import Link from "next/link";
import "swiper/css";
import "swiper/css/effect-fade";
import "swiper/css/pagination";
import styles from "@/css/Home.module.css";

interface Promo {
  _id: string;
  image: string;
  link?: string;
  slug: string;
}

interface PromoSwiperProps {
  promos: Promo[];
  baseUrl: string;
}

export default function PromoSwiper({ promos, baseUrl }: PromoSwiperProps) {
  return (
    <Swiper
      pagination={{ clickable: true }}
      effect="fade"
      loop={true}
      autoplay={{ delay: 2500 }}
      modules={[EffectFade, Pagination, Autoplay]}
      className="myBanner"
    >
      {promos.map((promo) => (
        <SwiperSlide key={promo._id}>
          <Link href={promo.link ? promo.link : `/promo/${promo.slug}`}>
            <div
              className={styles.banner}
              style={{ backgroundImage: `url(${baseUrl}${promo.image})` }}
            />
          </Link>
        </SwiperSlide>
      ))}
    </Swiper>
  );
}
