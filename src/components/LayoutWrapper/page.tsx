"use client";
import { usePathname } from "next/navigation";
import Navbar from "@/components/Navbar/page";
import Footer from "@/components/Footer/page";


export default function LayoutWrapper({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isDashboard = pathname.startsWith("/dashboard");

  return (
    <>
    <style jsx global>{`
          .mySwiper .swiper-button-prev{
            position: absolute;
            top: 7.5vw;
            width: 4.1vw;
            background-color: transparent;
            border: .1vw solid black;
            height: 2.4vw;
            border-radius: 100vw;
            margin-top: calc(0px -(var(--swiper-navigation-size) / 2));
            z-index: 10;
            cursor: pointer;
            display: flex;
            align-items: center;
            justify-content: center;
            color: var(--swiper-navigation-color, var(--swiper-theme-color));
            background-color: white;
            background-image: url(../images/nav_right.svg);
            background-size: 2vw;
            background-repeat: no-repeat;
            background-position: center;
            transition: .3s all;
          }
          .mySwiperSecond .swiper-button-prev{
            background-image: url(../images/nav_left.svg);
            transition: .3s all;
          }
            @media(max-width:768px){
            .mySwiper .swiper-button-prev{
              position: absolute;
              top: 7.5vw;
              width: 15vw;
              height: 6vw;
              background-size: 6vw;
            }
            .mySwiper .swiper-button-prev, .mySwiper .swiper-rtl .swiper-button-next{
              left: 8.3vw;
              top: 27vw;
            }
            .mySwiper .swiper-button-next, .mySwiper .swiper-rtl .swiper-button-prev{
              right: 8.3vw;
              left: auto;
            }
            .swiper-button-next, .swiper-rtl .swiper-button-prev{
              right: 8.3vw !important;
              top: 27vw;
            }
    }
      `}</style>
      {!isDashboard && <Navbar />}
      

      {children}
      {!isDashboard && <Footer />}
    </>
  );
}
