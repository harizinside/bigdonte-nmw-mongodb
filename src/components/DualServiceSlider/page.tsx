'use client';

import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Controller } from 'swiper/modules';
import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import 'swiper/css';
import 'swiper/css/navigation';

import type { Swiper as SwiperType } from "swiper";

interface Service {
  _id: string;
  name: string;
  slug: string;
  description: string;
  imageCover: string;
}

interface DualServiceSliderProps {
  services: Service[];
  styles: { [key: string]: string }; // bisa pakai CSS module styles dari props
}

export default function DualServiceSlider({ services, styles }: DualServiceSliderProps) {
  const [firstSwiper, setFirstSwiper] = useState<SwiperType | null>(null);
  const [secondSwiper, setSecondSwiper] = useState<SwiperType | null>(null);
  

  const midIndex = Math.ceil(services.length / 2);
  const firstHalf = services.slice(0, midIndex);
  const secondHalf = services.slice(midIndex);

  return (
    <>
      <Swiper
        dir="rtl"
        navigation
        modules={[Navigation, Controller]}
        className="mySwiper"
        loop
        // onSwiper={setSecondSwiper}
        onSwiper={(swiper) => setSecondSwiper(swiper)}
        controller={{ control: firstSwiper }}
      >
        {firstHalf.map((service) => (
          <SwiperSlide key={service._id}>
            <div className={styles.box_service_layout}>
              <div className={styles.box_service}>
                <div className={styles.box_service_content}>
                  <h3>{service.name}</h3>
                  <p>{service.description.replace(/<p[^>]*>/g, '').replace(/<\/p>/g, '')}</p>
                  <Link href={`/layanan/${service.slug}`}><button>Lihat Detail</button></Link>
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
        navigation
        modules={[Navigation, Controller]}
        className="mySwiper mySwiperSecond"
        loop
        // onSwiper={setFirstSwiper}
        onSwiper={(swiper) => setFirstSwiper(swiper)}
        controller={{ control: secondSwiper }}
      >
        {secondHalf.map((service) => (
          <SwiperSlide key={service._id}>
            <div className={`${styles.box_service_layout} ${styles.box_service_layout_second}`}>
              <div className={`${styles.box_service} ${styles.box_service_second}`}>
                <div className={styles.box_service_content}>
                  <h3>{service.name}</h3>
                  <p>{service.description.replace(/<p[^>]*>/g, '').replace(/<\/p>/g, '')}</p>
                  <Link href={`/layanan/${service.slug}`}><button>Lihat Detail</button></Link>
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
    </>
  );
}
