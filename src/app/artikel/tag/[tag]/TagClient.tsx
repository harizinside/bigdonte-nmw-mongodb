"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import Head from "next/head";
import styles from "@/css/Article.module.css";
import loadingStyles from "@/css/Loading.module.css";
import breadcrumb from "@/css/Breadcrumb.module.css";

interface Article {
  _id: string;
  title: string;
  author: string;
  date: string;
  image: string;
  slug: string;
  tags: string[];
}

interface Tag {
  _id: string;
  name: string;
}

interface TagClientProps {
    tag: string;
  }

export default function TagClient({ tag }: TagClientProps) {
  const [loading, setLoading] = useState(false);
  const [articlesAll, setArticlesAll] = useState<Article[]>([]);
  const [filteredArticles, setFilteredArticles] = useState<Article[]>([]);
  const [dataTags, setDataTags] = useState<Tag[]>([]);

  console.log('Tag yang diterima di TagClient:', tag); 

  const baseUrl = process.env.NEXT_PUBLIC_API_WEB_URL;

  useEffect(() => {
    const fetchArticles = async () => {
      try {
        setLoading(true);
        const response = await fetch(`${baseUrl}/api/articles?page=all`, {
          method: "GET",
          headers: {
            Authorization: `Bearer ${process.env.NEXT_PUBLIC_API_SECRET_KEY}`,
          },
          cache: "no-store",
        });
        const data = await response.json();
        setArticlesAll(data.articles || []);
      } catch (error) {
        console.error("Error fetching articles:", error);
      } finally {
        setLoading(false);
      }
    };

    const fetchTags = async () => {
      try {
        const response = await fetch(`${baseUrl}/api/articles?tags`, {
          method: "GET",
          headers: {
            Authorization: `Bearer ${process.env.NEXT_PUBLIC_API_SECRET_KEY}`,
          },
        });
        const data = await response.json();
        setDataTags(data.tags || []);
      } catch (error) {
        console.error("Error fetching tags:", error);
      }
    };

    fetchArticles();
    fetchTags();
  }, []);

  useEffect(() => {
    if (tag) {
      const filtered = articlesAll.filter(
        (article) => article.tags && article.tags.includes(tag)
      );
      setFilteredArticles(filtered);
    } else {
      setFilteredArticles(articlesAll);
    }
  }, [tag, articlesAll]);

  if (loading) {
    return (
      <div className={loadingStyles.box}>
        <div className={loadingStyles.content}>
          <Image width={500} height={500} src="../../images/logo.svg" alt="Loading"/>
        </div>
      </div>
    );
  }

    const schemaData = {
        "@context": "https://schema.org",
        "@type": "WebPage",
        name: `Artikel dengan Tag ${tag || 'NMW Aesthetic Clinic'}`,
        description: `Temukan artikel-artikel terkait tag ${tag || 'NMW Aesthetic Clinic'}`,
        url: `${baseUrl}/artikel/tag/${tag || ''}`,
        publisher: {
            "@type": "Organization",
            name: "NMW Aesthetic Clinic",
            logo: {
                "@type": "ImageObject",
                url: `${baseUrl}/images/article_image_page.png`
            }
        },
        mainEntityOfPage: {
            "@type": "WebPage",
            "@id": `${baseUrl}/artikel/tag/${tag || ''}`
        },
        breadcrumb: {
            "@type": "BreadcrumbList",
            itemListElement: [
                {
                    "@type": "ListItem",
                    position: 1,
                    name: "Home",
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
                    position: 2,
                    name: `Tag ${tag || 'NMW Aesthetic Clinic'}`,
                    item: `${baseUrl}/artikel/tag/${tag || ''}`
                }
            ]
        }
    };

  return (
    <>
        <script
            type="application/ld+json"
            dangerouslySetInnerHTML={{ __html: JSON.stringify(schemaData) }}
        />
      <div className={breadcrumb.breadcrumb}>
        <h5>
          <Link href={"/"}>Home</Link> / <Link href={"/artikel"}>Artikel</Link> / Tag /
          <span className={styles.tag_heading}>
            <Link href={`${baseUrl}/artikel/tag/${tag || ""}`}> {tag}</Link>
          </span>
        </h5>
      </div>
      <div className={styles.article_section}>
        <div className={`${styles.heading_section} ${styles.heading_section_start}`}>
          <h2>
            Artikel dengan tag <span className={styles.tag_heading}>{tag}</span>
          </h2>
        </div>
        <div className={styles.article_container}>
          <div className={styles.article_layout}>
            {filteredArticles.length > 0 ? (
              filteredArticles.map((article) => (
                <div className={styles.article_box} key={article._id}>
                  <div className={styles.article_image}>
                    {article.tags?.[0] && (
                      <Link href={`/artikel/tag/${article.tags[0]}`}>
                        <button className={styles.tag_article_img}>#
                          {article.tags[0]}
                        </button>
                      </Link>
                    )}
                    <Link href={`/artikel/${article.slug}`}>
                      <Image
                        priority
                        width={500}
                        height={500}
                        src={article.image}
                        alt={article.title}
                      />
                    </Link>
                  </div>
                  <div className={styles.article_content}>
                    <Link href={`/artikel/${article.slug}`}>
                      <div className={styles.article_heading}>
                        <h3>{article.title}</h3>
                      </div>
                    </Link>
                    <span>
                      {article.author}, {new Date(article.date).toLocaleDateString("id-ID")}
                    </span>
                    <Link href={`/artikel/${article.slug}`}>
                      <button className={styles.btn_more}>Baca Selengkapnya</button>
                    </Link>
                  </div>
                </div>
              ))
            ) : (
              <p>No articles found for this tag.</p>
            )}
          </div>
        </div>
      </div>
    </>
  );
}