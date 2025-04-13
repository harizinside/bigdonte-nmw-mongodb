"use client"

import Link from "next/link";
import styles from "@/css/Article.module.css";
import banner from "@/css/Banner.module.css";
import Image from "next/image";
import breadcrumb from "@/css/Breadcrumb.module.css";

interface Props {
  tags: any[];
  articles: any[];
  settings: any;
  articlesPage: any;
}

export default function ArtikelClient({
  tags,
  articles,
  settings,
  articlesPage,
}: Props) {
  const baseUrl = process.env.NEXT_PUBLIC_API_WEB_URL;

  const formatDate = (dateString: string): string => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat("id-ID", {
      day: "numeric",
      month: "long",
      year: "numeric",
    }).format(date);
  };

  const schemaData = {
    "@context": "https://schema.org",
    "@type": "WebPage",
    name: `${articlesPage.title}`,
    description: `${articlesPage.description}`,
    url: `${baseUrl}/artikel`,
    publisher: {
      "@type": "Organization",
      name: `${settings.title}`,
      logo: {
        "@type": "ImageObject",
        url: `${baseUrl}${settings.logo}`
      }
    },
    mainEntityOfPage: {
      "@type": "WebPage",
      "@id": `${baseUrl}/artikel`
    },
    breadcrumb: {
      "@type": "BreadcrumbList",
      itemListElement: [
        {
          "@type": "ListItem",
          position: 1,
          name: `${settings.title}`,
          item: `${baseUrl}`
        },
        {
          "@type": "ListItem",
          position: 2,
          name: `${articlesPage.title}`,
          item: `${baseUrl}/artikel`
        }
      ]
    }
  };

  return (
    <div>
        <script
            type="application/ld+json"
            dangerouslySetInnerHTML={{ __html: JSON.stringify(schemaData) }}
        />
      {/* Banner Section */}
      <div className={banner.banner}>
        <Image src={articlesPage.image} priority width={800} height={800} alt={articlesPage.title} />
      </div>

      {/* Breadcrumb Section */}
      <div className={breadcrumb.breadcrumb}>
        <h5>
          <Link href="/">Home</Link> / <span>Artikel</span>
        </h5>
      </div>

      {/* Articles Section */}
      <h1 className={styles.heading_hide}>{articlesPage.headline}</h1>

      <div className={styles.container}>
        <div className={styles.tabsContainer}>
          <div className={styles.tabContent_container}>
            <div className={`${styles.heading_section} ${styles.heading_section_start}`}>
              <h2><span>Artikel</span> Terbaru</h2>
            </div>
            <div className={styles.heading_sidebar}>
              <h2>Tag Artikel</h2>
            </div>
          </div>

          <div className={styles.tabContent}>
            <div className={styles.tabcontent_layout}>
            <div className={styles.tabcontent_section}>
                {articles.slice(0, 3).map((article) => {
                const firstTag = article.tags?.[0] || "";

                return (
                    <div className={styles.tabcontent_box} key={article._id}>
                    <div className={styles.tabcontent_box_img}>
                        <Link href={`/artikel/${article.slug}`}>
                        <Image
                            priority
                            width={500}
                            height={500}
                            src={article.image}
                            alt={article.title}
                        />
                        </Link>
                        {firstTag && (
                        <Link href={`/artikel/tag/${firstTag.trim()}`}>
                            <button className={styles.tag_article_img}>#{firstTag.trim()}</button>
                        </Link>
                        )}
                    </div>
                    <div className={styles.tabcontent_box_text}>
                        <Link href={`/artikel/${article.slug}`}>
                        <h3>{article.title}</h3>
                        </Link>
                        <span>{article.author}, {formatDate(article.date)}</span>
                        <div
                        className={styles.description}
                        dangerouslySetInnerHTML={{ __html: article.description }}
                        />
                        <Link href={`/artikel/${article.slug}`}>
                        <button>Baca Selengkapnya</button>
                        </Link>
                    </div>
                    </div>
                );
                })}
            </div>
            <div className={styles.article_sidebar_layout}>
                <h3 className={styles.heading_sidebar_mobile}>Tag Artikel</h3>
                <div className={styles.article_sidebar_button}>
                {tags.length > 0 ? (
                    tags.map((tag, index) => {
                    // Buat URL dengan format artikel/[tag]
                    const tagUrl = `/artikel/tag/${tag.trim()}`;
                    return (
                        <Link href={tagUrl} key={index}>
                        <button>{tag.trim()}</button>
                        </Link>
                    );
                    })
                ) : (
                    <p>No tags available</p>
                )}
                </div>
            </div>
            </div>
          </div>
        </div>
      </div>

      {/* Additional Articles */}
      {articles.length > 3 && (
        <div className={styles.article_section}>
          <div className={`${styles.heading_section} ${styles.heading_section_start}`}>
            <h2><span>Artikel</span> Lain</h2>
          </div>
          <div className={styles.article_container}>
            <div className={styles.article_layout}>
              {articles.slice(3).map((article) => {
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
      )}
    </div>
  );
};
