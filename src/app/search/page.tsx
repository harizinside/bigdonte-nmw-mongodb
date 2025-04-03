"use client";

import { useState, useEffect, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import Image from "next/image";
import breadcrumb from "@/css/Breadcrumb.module.css";
import styles from "@/css/Search.module.css";
import Link from "next/link";
import loadingStyles from "@/css/Loading.module.css";

const SearchContent = () => {
  const searchParams = useSearchParams();
  const q = searchParams?.get("q") || ""; // Ambil query parameter "q" dari URL

  const [results, setResults] = useState<any>({
    resultsServices: [],
    resultsServicesList: [],
    resultsArticles: [],
  });
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const baseUrl = process.env.NEXT_PUBLIC_API_WEB_URL;

  useEffect(() => {
    if (q) {
      setLoading(true);
      setError(null);
      fetch(`/api/search?q=${q}`)
        .then((response) => response.json())
        .then((data) => {
          setResults(data);
          setLoading(false);
        })
        .catch((err) => {
          setError("Terjadi kesalahan saat pencarian.");
          setLoading(false);
        });
    }
  }, [q]);

  return (
    <>
      <div className={breadcrumb.breadcrumb}>
        <h5>
          <Link href={"/"}>Home</Link> / <Link href={"/search"}>Search</Link> /
          <span className={styles.tag_heading}>
            <Link href={`${baseUrl}/search/${q}`}> {q}</Link>
          </span>
        </h5>
      </div>

      <div className={styles.article_section}>
        <div className={`${styles.heading_section} ${styles.heading_section_start}`}>
          <h2>
            Hasil Pencarian untuk: <span className={styles.tag_heading}>{q}</span>
          </h2>
        </div>

        {loading && (
          <div className={loadingStyles.box}>
            <div className={loadingStyles.content}>
              <Image priority width={500} height={500} src="/images/logo.svg" alt="Loading" />
            </div>
          </div>
        )}

        {error && <p>{error}</p>}

        <div className={styles.article_container}>
          <h2>Services</h2>
          <div className={styles.article_layout}>
            {results.resultsServices.length + results.resultsServicesList.length > 0 ? (
              [...results.resultsServices, ...results.resultsServicesList].map((service: any) => (
                <div className={styles.article_box} key={service._id}>
                  <div className={styles.article_image}>
                    <Link href={`/layanan/${service.slug}`}>
                      <Image priority width={500} height={500} src={service.imageCover} alt={service.name} />
                    </Link>
                  </div>
                  <div className={styles.article_content}>
                    <Link href={`/layanan/${service.slug}`}>
                      <div className={styles.article_heading}>
                        <h3>{service.name}</h3>
                      </div>
                    </Link>
                    <div className={styles.description} dangerouslySetInnerHTML={{ __html: service.description }} />
                    <Link href={`/layanan/${service.slug}`}>
                      <button className={styles.btn_more}>Baca Selengkapnya</button>
                    </Link>
                  </div>
                </div>
              ))
            ) : (
              <p>Tidak ada hasil untuk services.</p>
            )}
          </div>
        </div>

        <div className={styles.article_container}>
          <h2>Articles</h2>
          <div className={styles.article_layout}>
            {results.resultsArticles.length > 0 ? (
              results.resultsArticles.map((article: any) => (
                <div className={styles.article_box} key={article._id}>
                  <div className={styles.article_image}>
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
                    <div className={styles.description} dangerouslySetInnerHTML={{ __html: article.description }} />
                    <Link href={`/artikel/${article.slug}`}>
                      <button className={styles.btn_more}>Baca Selengkapnya</button>
                    </Link>
                  </div>
                </div>
              ))
            ) : (
              <p>Tidak ada hasil untuk artikel.</p>
            )}
          </div>
        </div>
      </div>
    </>
  );
};

const SearchPage = () => {
  return (
    <Suspense fallback={<p>Loading...</p>}>
      <SearchContent />
    </Suspense>
  );
};

export default SearchPage;