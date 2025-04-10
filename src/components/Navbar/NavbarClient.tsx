"use client"

import Head from "next/head";
import styles from "@/css/Header.module.css";
import { HiOutlineMapPin } from "react-icons/hi2";
import { PiPhoneCall } from "react-icons/pi";
import { HiOutlineEnvelope } from "react-icons/hi2";
import { FaFacebook, FaInstagram, FaTiktok, FaYoutube, FaTwitter, FaLinkedin, FaWhatsapp } from "react-icons/fa";
import { IoLogoWhatsapp } from "react-icons/io5";
import Link from "next/link";
import React, { useState, useEffect, useRef } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import { IoIosMenu } from "react-icons/io";
import { CgClose } from "react-icons/cg";
import { IoMdClose } from "react-icons/io";
import popup from "@/css/Popup.module.css";
import { useNavbar } from "@/hooks/useNavbar";

interface Popup {
    link: string;
    image: string;
    status: boolean;
}
interface HomeClientProps {
    settings: {
      logo: string;
      favicon: string;
      title: string;
      meta_description: string;
      phone: string;
      address_header: string;
      email: string;
      direct_link: string;
    };
    socials: any[];
    promos: any[];
    services: any[];
    articles: any[];
  }
  
  export default function NavbarClient() {
    const { settings, promos, services, articles, socials, loading, error } = useNavbar();

    const [dropdownActive, setDropdownActive] = useState<string | null>(null);
    const pathname = usePathname(); 
    const router = useRouter();
    const [popupData, setPopupData] = useState<Popup[] | null>(null);
    const [showPopup, setShowPopup] = useState<boolean>(false);
    const headerRef = useRef<HTMLUListElement | null>(null);
    const [menuActive, setMenuActive] = useState<boolean>(false);
    const [isLoading, setIsLoading] = useState<boolean>(true);
    const baseUrl = process.env.NEXT_PUBLIC_API_WEB_URL || '';
    const [isSticky, setIsSticky] = useState<boolean>(true);
    
    useEffect(() => {
        if (pathname) {
            setIsSticky(!pathname.startsWith("/artikel/"));
        }
    }, [pathname]);

    const handleClickOutside = (event: MouseEvent) => {
        if (headerRef.current && !headerRef.current.contains(event.target as Node)) {
            setDropdownActive(null);
        }
    };

    const handleScroll = () => {
        setDropdownActive(null);
    };

    useEffect(() => {
        document.addEventListener('click', handleClickOutside);
        document.addEventListener('scroll', handleScroll);
        return () => {
            document.removeEventListener('click', handleClickOutside);
            document.removeEventListener('scroll', handleScroll);
        };
    }, []);

    const toggleDropdown = (dropdownName: string) => {
        setDropdownActive(dropdownActive === dropdownName ? null : dropdownName);
    };

    const handleHamburger = () => {
        setMenuActive(!menuActive);
    };

    const clickMenu = () => {
        closeDropdown();
        handleHamburger();
    };

    const closeDropdown = () => {
        setDropdownActive(null);
    };

    const isActive = (path: string) => {
        return pathname === path ? 'active' : '';
    };

    useEffect(() => {
        const fetchData = async () => {
          try {
            const response = await fetch(`/api/popups`, {
              method: "GET",
              headers: {
                "Authorization": `Bearer ${process.env.NEXT_PUBLIC_API_SECRET_KEY}`,
                "Content-Type": "application/json",
              },
              cache: "no-store", // biar tidak cache dari browser
            });
      
            const data = await response.json();
      
            if (Array.isArray(data.popups)) {
              const popupItems = data.popups
                .filter((popup: Popup) => popup.status === true)
                .slice(0, 1); // Ambil hanya 1
      
              if (popupItems.length > 0) {
                setPopupData(popupItems);
                setShowPopup(true);
              }
            }
          } catch (error) {
            console.error("Error fetching popup data:", error);
          } finally {
            setIsLoading(false);
          }
        };
      
        fetchData();
      }, [baseUrl]);                        

    const iconMapping: { [key: string]: JSX.Element } = {
        Facebook: <FaFacebook />,
        Instagram: <FaInstagram />,
        Tiktok: <FaTiktok />,
        Youtube: <FaYoutube />,
        Twitter: <FaTwitter />,
        Linkedin: <FaLinkedin />,
        Whatsapp: <FaWhatsapp />
    };

    const formattedPhone = settings?.phone && settings.phone.startsWith('0')
        ? '62' + settings.phone.slice(1)
        : settings?.phone;

    const closeModal = () => {
        setShowPopup(false);
    };

    const schemaData = {
        "@context": "https://schema.org",
        "@graph": [
            {
                "@type": "Organization",
                "name": "NMW Aesthetic Clinic",
                "url": `${baseUrl}`,
                "logo": `${baseUrl}/${settings?.logo}`,
                "description": "Klinik Aesthetic, Skincare, dan Dermatologi terpercaya di Jakarta.",
                "address": {
                    "@type": "PostalAddress",
                    "streetAddress": "Jl. Petogogan II No.29 RT.008 RW.006 Kel. Pulo, Kec. Kebayoran Baru Kota Jakarta Selatan Prov. DKI Jakarta 12160",
                    "addressLocality": "Jakarta Selatan",
                    "addressRegion": "DKI Jakarta",
                    "postalCode": "12160",
                    "addressCountry": "ID"
                },
                "contactPoint": {
                    "@type": "ContactPoint",
                    "telephone": "+62 812-8036-0370",
                    "contactType": "customer service",
                    "areaServed": "ID",
                    "availableLanguage": "Indonesian"
                },
                "sameAs": socials.map((item) => item.link),
            },
            {
                "@type": "WebSite",
                "name": "NMW Aesthetic Clinic",
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
            <Head>
                <meta name="google-site-verification" content="iYG_LhQQBgtnR0eh5LxjemSAR_8cAHBnM7WZ_Dqq_N8" />
                <meta name="viewport" content="width=device-width, initial-scale=1" />
                <link rel="icon" href={`${baseUrl}${settings.favicon}`} />
                <link rel="apple-touch-icon" href={`${baseUrl}/${settings?.favicon}`} />
                <meta name="robots" content="index, follow" />
                <script type="application/ld+json">
                    {JSON.stringify(schemaData)}
                </script>
            </Head>

            <div className={isSticky ? styles.header : styles.headerNoSticky}>
                <div className={styles.nav_top}>
                    <div className={styles.contact_nav}>
                        <div className={styles.contact_nav_box}>
                            <HiOutlineMapPin />
                            <p>{settings?.address_header}</p>
                        </div>
                        <div className={styles.contact_nav_box}>
                            <PiPhoneCall />
                            <Link href={`https://api.whatsapp.com/send?phone=${formattedPhone}`} target="blank_"><p>{settings?.phone}</p></Link>
                        </div>
                        <div className={styles.contact_nav_box}>
                            <HiOutlineEnvelope />
                            <Link href={`mailto:${settings?.email}`} target="blank_"><p>{settings?.email}</p></Link>
                        </div>
                    </div>
                    <div className={styles.sosmed_nav}>
                        <p>Ikuti Kami di </p>
                        <div className={styles.sosmed_nav_box}>
                            {socials.map((social, index) => (
                                <Link key={index} href={social.link} target="blank_" aria-label={social.title}>
                                    <div>{iconMapping[social.title]}</div>
                                </Link>
                            ))}
                        </div>
                    </div>
                </div>
                {showPopup && popupData && popupData.length > 0 && popupData[0].link && (
                    <div className={`${popup.modal} ${popup.active}`}>
                        <div className={popup.modal_overlay} onClick={closeModal}></div>
                        {isLoading || !popupData[0].image ? (
                            <div className="skeleton-logo skeleton-logo-100 skeleton-logo-fit" />
                        ) : (
                            <div className={popup.modal_content}>
                                <span className={popup.close} onClick={closeModal}>
                                    <IoMdClose />
                                </span>
                                <Link href={popupData[0].link} target="_blank">
                                    <img src={`${baseUrl}/${popupData[0].image}`} loading="lazy" alt="Promo NMW Skincare" />
                                </Link>
                            </div>
                        )}
                    </div>
                )}

                <div className={styles.nav_bottom}>
                    <div className={styles.logo}>
                        <Link href="/">
                            <img
                                src={`${baseUrl}${settings?.logo}`}
                                alt="NMW Clinic Logo"
                                loading="lazy"
                            />
                        </Link>
                    </div>
                    <button className={styles.hamburger} onClick={handleHamburger}>
                        <IoIosMenu />
                    </button>
                    <div className={`${styles.menu} ${menuActive ? styles.active : ''}`}>
                        <div className={styles.menu_layout}>
                            <img className={styles.logo_mobile} src={`${baseUrl}/${settings?.logo}`} loading="lazy" alt="NMW Clinic Logo | Logo NMW Clinic | Logo NMW Clinic png" />
                            <ul ref={headerRef}>
                                <li className={isActive('/')} onClick={clickMenu}><Link href="/">Home</Link></li>
                                <li>
                                    <span onClick={() => toggleDropdown('services')} className={isActive('/layanan')}>Layanan</span>
                                    <div className={`${styles.dropdown_menu} ${dropdownActive === 'services' ? styles.active : ''}`}>
                                        <ul>
                                            {services.map(service => (
                                                <li onClick={clickMenu} key={service._id}>
                                                    <Link href={`/layanan/${service.slug}`}>{service.name}</Link>
                                                </li>
                                            ))}
                                        </ul>
                                    </div>
                                </li>
                                <li className={isActive('/artikel')} onClick={clickMenu}><Link href="/artikel">Artikel</Link></li>
                                <li className={isActive('/cabang')} onClick={clickMenu}><Link href="/cabang">Cabang</Link></li>
                                <li className={isActive('/katalog')} onClick={clickMenu}><Link href="/katalog">Katalog</Link></li>
                            </ul>
                            <div className={styles.login_mobile}>
                                <Link href={`${settings?.direct_link}`}><button>Masuk</button></Link>
                            </div>
                        </div>
                        <div className={styles.overlay_menu}></div>
                        <button className={styles.close_btn} onClick={handleHamburger}><CgClose /></button>
                    </div>
                    <div className={styles.login}>
                        <Link href={`${settings?.direct_link}`} target="blank_">
                            <button>Masuk</button>
                        </Link>
                    </div>
                </div>
            </div>

            <div className={`${styles.floating_whatsapp}`}>
                <div className={`${styles.text_whatsapp} ${styles.bounce_in_up}`}>
                    <span><span>Butuh</span> Bantuan?</span>
                </div>
                <Link href={`https://api.whatsapp.com/send?phone=${formattedPhone}`} target="blank_"><button>Customer Care NMW Aesthetic Clinic <IoLogoWhatsapp /></button></Link>
            </div>
        </>
    );
}