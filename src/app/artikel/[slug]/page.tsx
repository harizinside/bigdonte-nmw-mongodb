// import { Metadata } from "next";
// import { notFound } from "next/navigation";
// import ArtikelDetailClient from "./ArtikelDetailClient";

// const baseUrl = process.env.NEXT_PUBLIC_API_WEB_URL!;
// const storageUrl = process.env.NEXT_PUBLIC_API_STORAGE_URL!;
// const mainUrl = process.env.NEXT_PUBLIC_API_MAIN_URL!;

// interface Article {
//   title: string;
//   description: string;
//   slug: string;
//   image: string;
//   author: string;
//   date: string;
//   editor: string;
//   sourceLink: string;
//   doctorId: string;
//   serviceId: string;
//   products: string[];
//   tags: string[];
// }

// interface Doctor {
//   _id: string;
//   name: string;
//   position: string;
//   image: string;
// }

// interface Service {
//   _id: string;
//   title: string;
//   description: string;
//   slug: string;
//   imageCover: string;
// }

// interface Product {
//   _id: number;
//   name: string;
//   image: string;
//   description: string;
//   link: string;
// }

// export async function generateMetadata({ params }: { params: { slug: string } }): Promise<Metadata> {
//   const response = await fetch(`${baseUrl}/detail-artikel/${params.slug}`);
//   if (!response.ok) return notFound();

//   const article: Article = await response.json();

//   return {
//     title: article.title,
//     description: article.description ? article.description.replace(/<[^>]+>/g, "").slice(0, 150) : "Artikel Deskripsi",
//     openGraph: {
//       title: article.title,
//       description: article.description,
//       url: `${mainUrl}/artikel/${article.slug}`,
//       images: [{ url: `${storageUrl}/${article.image}` }],
//       type: "article",
//     },
//     twitter: {
//       card: "summary_large_image",
//       title: article.title,
//       description: article.description,
//       images: [`${storageUrl}/${article.image}`],
//     },
//   };
// }

// export default async function Page({ params }: { params: { slug: string, _id: number; } }) {
//     const headers = {
//       method: "GET",
//       headers: {
//         Authorization: `Bearer ${process.env.NEXT_PUBLIC_API_SECRET_KEY}`,
//       },
//     };
  
//     const [articleRes, articlesRes, doctorRes, serviceRes, productRes] = await Promise.all([
//       fetch(`${baseUrl}/api/articles/${params.slug}`, headers),
//       fetch(`${baseUrl}/api/articles?page=all`, headers),
//       fetch(`${baseUrl}/api/doctors/${params._id}`, headers),
//       fetch(`${baseUrl}/api/services/${params._id}`, headers),
//       fetch(`${baseUrl}/api/products?id=${params._id}`, headers),
//     ]);
  
//     if (!articleRes.ok) return notFound();
  
//     const article: Article = await articleRes.json();
//     const { articles } = await articlesRes.json();
//     const doctor: Doctor = await doctorRes.json();
//     const services: Service = await serviceRes.json();
//     const productData = await productRes.json();
//     const productAll: Product[] = productData.products || [];
  
//     const articlesAll = articles.filter((art: Article) => art.slug !== params.slug).slice(0, 6);
  
//     return (
//       <ArtikelDetailClient
//         article={article}
//         articlesAll={articlesAll}
//         doctor={doctor}
//         services={services}
//         productAll={productAll}
//       />
//     );
//   }
  
import { Metadata } from "next";
import { notFound } from "next/navigation";
import ArtikelDetailClient from "./ArtikelDetailClient";

interface Article {
  title: string;
  description: string;
  slug: string;
  image: string;
  author: string;
  date: string;
  editor: string;
  sourceLink: string;
  doctorId: number;
  serviceId: number;
  products: string[];
  tags: string[];
}

async function getArticle(slug: string): Promise<Article | null> {
  const baseUrl = process.env.NEXT_PUBLIC_API_WEB_URL;
  const response = await fetch(`${baseUrl}/api/articles/${slug}`, {
    method: "GET",
    headers: {
      Authorization: `Bearer ${process.env.NEXT_PUBLIC_API_SECRET_KEY}`,
    },
  });
  if (!response.ok) return null;
  return response.json();
}

export async function generateMetadata({ params }: { params: { slug: string } }): Promise<Metadata> {
  const article = await getArticle(params.slug);
  if (!article) notFound();

  const baseUrl = process.env.NEXT_PUBLIC_API_WEB_URL;

  const plainText = article?.description.replace(/<\/?[^>]+(>|$)/g, "") || "";
  const truncatedText = plainText.length > 156 ? plainText.slice(0, 156) + "..." : plainText;

  const keywords = article.tags ? article.tags.map((tag: string) => tag.trim()) : [];

  return {
    title: `${article.title} | NMW Aesthetic Clinic`,
    description: `${truncatedText}`,
    keywords,
    openGraph: {
      title: article.title,
      description: `${truncatedText}`,
      type: "website",
      url: `${baseUrl}/artikel/${article.slug}`,
      images: [
        {
          url: `${baseUrl}${article.image}`,
          width: 1200,
          height: 630,
          alt: article.title,
        },
      ],
    },

    twitter: {
      card: "summary_large_image",
      site: "@nmwclinic",
      title: article.title,
      description: `${truncatedText}`,
      images: `${baseUrl}${article.image}`,
    },

    alternates: {
      canonical: `${baseUrl}/artikel/${article.slug}`,
    },
  };
}

export default async function ArtikelDetailPage({ params }: { params: { slug: string } }) {
  const article = await getArticle(params.slug);
  if (!article) notFound();

  return (
    <ArtikelDetailClient
      slug={params.slug}
      doctorId={article.doctorId}
      serviceId={article.serviceId}
      products={article.products}
    />
  );
}
