"use client"

import { useRouter } from 'next/router';
import { useState, useEffect, useRef, useCallback } from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import banner from "@/css/Banner.module.css";
import styles from "@/css/Detail.module.css";
import stylesAll from "@/css/Article.module.css"
import loadingStyles from "@/css/Loading.module.css";
import Link from 'next/link';
import Head from 'next/head';
import breadcrumb from "@/css/Breadcrumb.module.css"
import Image from 'next/image';

interface Article {
  _id: number;
  title: string;
  description: string;
  image: string;
  author: string;
  editor: string;
  sourceLink: string;
  date: string;
  tags: string[];
  slug: string;
  doctorId: number;
  serviceId: number;
  image_source: string;
  image_source_name: string;
  products: string[];
}

interface Doctor {
  _id: number;
  name: string;
  position: string;
  image: string;
}

interface Service {
  _id: number;
  name: string;
  description: string;
  imageCover: string;
  slug: string;
}

interface Product {
  _id: number;
  name: string;
  description: string;
  image: string;
  link: string;
}

interface Props {
    slug: string;
    doctorId: number;
    serviceId: number;
    products: string[];
}
  
export default function ArtikelDetailClient({ slug, doctorId, serviceId, products }: Props) {

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [toc, setToc] = useState<{ id: string; text: string; tag: string }[]>([]);
  const [modifiedContent, setModifiedContent] = useState("");
  const [htmlContentSc, setHtmlContentSc] = useState("Klik lihat detail untuk mendapatkan informasi selengkapnya tentang layanan ini");

  const [article, setArticle] = useState<Article | null>(null);
  const [articlesAll, setArticlesAll] = useState<Article[]>([]);
  const [doctor, setDoctor] = useState<Doctor | null>(null);
  const [services, setServices] = useState<Service | null>(null);
  const [productAll, setProductAll] = useState<Product[]>([]);
  const contentRef = useRef<HTMLDivElement>(null);

  const baseUrl = process.env.NEXT_PUBLIC_API_WEB_URL;

  useEffect(() => {
    const fetchArticle = async () => {
      try {
        const response = await fetch(`${baseUrl}/api/articles/${slug}`, {
          method: "GET",
          headers: {
            Authorization: `Bearer ${process.env.NEXT_PUBLIC_API_SECRET_KEY}`,
          },
        });
        const data = await response.json();
        setArticle(data);
      } catch {
        setError(error);
      }
    };

    const fetchArticlesAll = async () => {
      try {
        const response = await fetch(`${baseUrl}/api/articles?page=all`, {
            method: "GET",
            headers: {
                Authorization: `Bearer ${process.env.NEXT_PUBLIC_API_SECRET_KEY}`,
            },
        });
        const data = await response.json();
        setArticlesAll(data.articles.filter((article: { slug: string | string[] | undefined; }) => article.slug !== slug).slice(0, 6));
      } catch {
        setError(error);
      }
    };

    const fetchDoctor = async () => {
      try {
        const response = await fetch(`${baseUrl}/api/doctors/${doctorId}`, {
            method: "GET",
            headers: {
                Authorization: `Bearer ${process.env.NEXT_PUBLIC_API_SECRET_KEY}`,
            },
        });
        const data = await response.json();
        setDoctor(data);
      } catch {
        setError(error);
      }
    };

    const fetchServices = async () => {
      try {
        const response = await fetch(`${baseUrl}/api/services/${serviceId}`, {
            method: "GET",
            headers: {
                Authorization: `Bearer ${process.env.NEXT_PUBLIC_API_SECRET_KEY}`,
            },
        });
        const data = await response.json();
        setServices(data);
      } catch {
        setError(error);
      }
    };

    const fetchProductAll = async () => {
      try {
        if (products.length === 0) return;

        const response = await fetch(`${baseUrl}/api/products?id=${products.join(",")}`, {
          method: "GET",
          headers: {
              Authorization: `Bearer ${process.env.NEXT_PUBLIC_API_SECRET_KEY}`,
          },
      });
        const data = await response.json();
        setProductAll(data.products);
      } catch {
        setError(error);
      }
    };

    fetchArticle();
    fetchArticlesAll();
    fetchDoctor();
    fetchServices();
    fetchProductAll();
  }, [products, baseUrl, serviceId, doctorId, slug]);

  console.log('product data', products)

  useEffect(() => {
    if (services && services.description && services.description !== "-") {
      setHtmlContentSc(services.description);
    } else {
      setHtmlContentSc("");
    }
  }, [services]);

  const plainText = article?.description.replace(/<\/?[^>]+(>|$)/g, "") || "";
  const truncatedText = plainText.length > 156 ? plainText.slice(0, 156) + "..." : plainText;

  const tags = Array.isArray(article?.tags) ? article.tags : [];

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat("id-ID", {
      day: "numeric",
      month: "long",
      year: "numeric",
    }).format(date);
  };

  useEffect(() => {
    if (!article?.description) return;

    const parser = new DOMParser();
    const doc = parser.parseFromString(article.description, "text/html");

    const headings = Array.from(doc.querySelectorAll("h2, h3")) as HTMLElement[]; // Pastikan tipe elemen adalah HTMLElement

    const tocItems: { id: string; text: string; tag: string }[] = [];

    headings.forEach((heading, index) => {
      const id = `section-${index}`;
      heading.setAttribute("id", id);
      tocItems.push({ id, text: heading.innerText, tag: heading.tagName });
    });

    setToc(tocItems);
    setModifiedContent(doc.body.innerHTML);
  }, [article?.description]);

  const handleScrollToSection = useCallback(
    (e: React.MouseEvent<HTMLAnchorElement>, sectionId: string) => {
      e.preventDefault();
  
      const section = document.getElementById(sectionId);
      const offset = 230; // Definisikan offset di awal fungsi
  
      if (section) {
        window.scrollTo({
          top: section.getBoundingClientRect().top + window.scrollY - offset,
          behavior: "smooth",
        });
      } else {
        console.warn(`Target not found: ${sectionId}, retrying...`);
        setTimeout(() => {
          const retrySection = document.getElementById(sectionId);
          if (retrySection) {
            window.scrollTo({
              top: retrySection.getBoundingClientRect().top + window.scrollY - offset, // Offset tetap tersedia
              behavior: "smooth",
            });
          } else {
            console.error(`Target still not found: ${sectionId}`);
          }
        }, 230);
      }
    },
    []
  );

  if (error) return <p>Error: {error}</p>;

  if (!article) {
    return (
      <div className={loadingStyles.box}>
        <div className={loadingStyles.content}>
          <Image width={500} height={500} priority src="/images/logo.svg" alt="Loading" />
        </div>
      </div>
    );
  }

  const articleSchema = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: `${article.title ? `${article.title}` : `Artikel NMW Aesthetic Clinic`} - NMW Aesthetic Clinic`,
    description: `${truncatedText}`,
    url: `${baseUrl}/artikel/${article.slug}`,
    publisher: {
      "@type": "Organization",
      name: "NMW Aesthetic Clinic",
      logo: {
        "@type": "ImageObject",
        url: `${article.image ? `${baseUrl}${article.image}` : `${baseUrl}/images/kebijakan-privasi.png`}`
      }
    },
    mainEntityOfPage: {
      "@type": "WebPage",
      "@id": `${baseUrl}/artikel/${article.slug}`
    },
    image: {
      "@type": "ImageObject",
      url: `${baseUrl}/${article.image}`
    },
    author: {
      "@type": "Person",
      name: `${article.author}`
    },
    "datePublished": `${article.date}`,
    "dateModified": `${article.date}`
  };

  const breadcrumbSchema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      {
        "@type": "ListItem",
        position: 1,
        name: "Beranda",
        item: `${baseUrl}`
      },
      {
        "@type": "ListItem",
        position: 2,
        name: "Artikel",
        item: `${baseUrl}/artikel`
      },
      {
        "@type": "ListItem",
        position: 3,
        name: `${article.title ? `${article.title}` : `article NMW Aesthetic Clinic`}`,
        item: `${baseUrl}/artikel/${article.slug}`
      }
    ]
  };

  return (
    <div>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(articleSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
      />
      <div className={banner.banner}>
        <Image priority width={900} height={900} src={article.image} alt={article.title} />
        {article.image_source ? (
          <div className={banner.image_source}>
            <Link href={article.image_source} target="_blank">{article.image_source_name}</Link>
          </div>
        ) : null}
      </div>
      <div className={breadcrumb.breadcrumb}>
        <h5><Link href={'/'}>Home</Link> / <Link href={'/artikel'}>Artikel</Link> / <span><Link href={`${baseUrl}/artikel/${article.slug}`}>{article.title}</Link></span></h5>
      </div>
      <div className={styles.container}>
        <div className={styles.detail_tag}>
          {tags.map((tag, index) => (
            <Link href={`tag/${tag.trim()}`} key={index}>
              <button>
                #{tag.trim()}
              </button>
            </Link>
          ))}
        </div>
        <div className={styles.container_layout}>
          <div className={styles.container_content}>
            <div className={styles.content_heading}>
              <h1>{article.title}</h1>
              <span>{article.author}, {formatDate(article.date)}</span>
            </div>
            <div className={styles.content_text}>
              {toc.length > 0 && (
                <div className={styles.table_of_content}>
                  <h2>Daftar Isi</h2>
                  <ul>
                    {toc.map((item, index) => (
                      <li key={index} className={item.tag === "H2" ? "h2-item" : "h3-item"}>
                        <a
                          href={`#${item.id}`}
                          className="toc-link"
                          onClick={(e) => handleScrollToSection(e, item.id)}
                        >
                          {item.text}
                        </a>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
              <div ref={contentRef}>
                <div dangerouslySetInnerHTML={{ __html: modifiedContent }} />
              </div>
              <div className={styles.author_meta}>
                <p>Penulis : {article.author}</p>
                <p>Editor : {article.editor}</p>
                <p>Sumber : {article.sourceLink}</p>
              </div>
            </div>
          </div>
          <div className={`${styles.container_sidebar} ${styles.dekstop_block}`}>
            <div className={styles.sidebar_heading}>
              <h4>Artikel Lain</h4>
              <Link href={"/artikel"}>Lihat lebih banyak</Link>
            </div>
            <div className={styles.sidebar_layout}>
              {articlesAll.map(article => {
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
                        <Image priority width={500} height={500} src={article.image} alt={article.title} />
                      </Link>
                    </div>
                    <div className={styles.article_content}>
                      <Link href={`/artikel/${article.slug}`}>
                        <div className={styles.article_heading}>
                          <h3>{article.title}</h3>
                        </div>
                      </Link>
                      <span>{article.author}, {formatDate(article.date)}</span>
                      <Link href={`/artikel/${article.slug}`}>
                        <button className={styles.btn_more}>Baca Selengkapnya</button>
                      </Link>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
      <div className={styles.container_sc}>
        {productAll.length > 0 ? (
        <div className={styles.product_detail}>
            <div className={styles.layanan_heading}>
            <h3>Produk <span>Artikel Ini</span></h3>
            </div>
            <div className={styles.product_detail_layout}>
            {productAll.map((product, index) => (
                <div className={styles.article_box} key={index}>
                <div className={`${styles.article_image} ${styles.article_image_product}`}>
                    <Link href={product.link} target="_blank">
                    <Image priority width={700} height={700}
                        src={product.image}
                        alt={product.name}
                    />
                    </Link>
                </div>
                <div className={`${styles.article_content} ${styles.article_product}`}>
                    <Link href={product.link} target="_blank">
                    <div className={styles.article_heading}>
                        <h3>{product.name}</h3>
                    </div>
                    </Link>
                    <p>{product.description}</p>
                    <Link href={product.link} target="_blank">
                    <button className={styles.btn_more}>Lihat Produk</button>
                    </Link>
                </div>
                </div>
            ))}
            </div>
        </div>
        ) : null}
        <div className={styles.container_layout}>
        {services && services._id ? (
          <div className={styles.layanan}>
            <div className={styles.layanan_heading}>
              <h3>Terkait <span>Artikel Ini</span></h3>
            </div>
            <div className={styles.box_service_layout}>
              <div className={styles.box_service} key={services._id}>
                <div className={styles.box_service_image}>
                  <Link href={`/layanan/${services.slug}`}>
                    <Image priority width={800} height={800}
                      src={services.imageCover}
                      alt={services.name}
                    />
                  </Link>
                </div>
                <div className={styles.box_service_content}>
                  <Link href={`/layanan/${services.slug}`}>
                    <h2>{services.name}</h2>
                  </Link>
                  <p className={styles.service_description} dangerouslySetInnerHTML={{ __html: htmlContentSc }} />
                  <div className={styles.box_service_btn}>
                    <Link href={`/layanan/${services.slug}`}>
                      <button>Lihat Detail</button>
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          </div>
            ) : null}
          {doctor && doctor._id ? (
          <div className={styles.container_sidebar}>
            <div className={styles.layanan_heading}>
              <h3> <span>Dokter</span> Terkait</h3>
            </div>
            <div className={`${styles.sidebar_layout} ${styles.sidebar_layout_sc}`}>
              <div className={`${styles.article_box} ${styles.doctor_box}`} key={doctor._id}>
                <div className={`${styles.article_image} ${styles.article_image_product} ${styles.article_image_doctor}`}>
                  <Image priority width={500} height={500}
                    src={doctor.image}
                    alt={doctor.name}
                  />
                </div>
                <div className={styles.article_content}>
                  <div className={styles.article_heading}>
                    <h3>{doctor.name}</h3>
                  </div>
                  <p>{doctor.position}</p>
                </div>
              </div>
            </div>
          </div>
            ) : null}
        </div>
        <div className={`${styles.container_sidebar} ${styles.mobile_block}`}>
          <div className={styles.sidebar_heading}>
            <h4>Artikel Lain</h4>
            <Link href={"/artikel"}>Lihat lebih banyak</Link>
          </div>
          <div className={styles.sidebar_layout}>
            {articlesAll.map(article => {
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
                      <Image priority width={500} height={500} src={article.image} alt={article.title} />
                    </Link>
                  </div>
                  <div className={styles.article_content}>
                    <Link href={`/artikel/${article.slug}`}>
                      <div className={styles.article_heading}>
                        <h3>{article.title}</h3>
                      </div>
                    </Link>
                    <span>{article.author}, {formatDate(article.date)}</span>
                    <Link href={`/artikel/${article.slug}`}>
                      <button className={styles.btn_more}>Baca Selengkapnya</button>
                    </Link>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* {loading && (
          <div className={loadingStyles.box}>
            <div className={loadingStyles.content}>
              <img src="/images/logo.svg" loading="lazy" />
              <span>LOADING</span>
            </div>
          </div>
        )} */}
    </div>
  );
};