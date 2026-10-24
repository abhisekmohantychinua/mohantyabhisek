import type { Metadata } from "next";
import type { JSX } from "react";

import BlogCategoryList from "@/features/blogs/components/blog-category-list";
import CategoryHeader from "@/features/blogs/components/category-header";
import type BlogCategory from "@/features/blogs/models/blog-category";
import { getCachedAllBlogCategory } from "@/features/blogs/services/blog-category-service";

const SITE_URL = "https://mohantyabhisek.com";
const PAGE_URL = `${SITE_URL}/blogs/categories`;

export default async function BlogCategoriesPage(): Promise<JSX.Element> {
  const categories = await getCachedAllBlogCategory();

  return (
    <>
      <CategoryHeader />
      <BlogCategoryList categories={categories} />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(createJsonLd(categories)),
        }}
      />
    </>
  );
}

export const metadata: Metadata = {
  title: "Blog Categories | Abhisek",
  description:
    "Explore blog categories covering websites, web applications, business systems, and digital strategy.",
  openGraph: {
    type: "website",
    title: "Blog Categories | Abhisek",
    description:
      "Explore blog categories covering websites, web applications, business systems, and digital strategy.",
    url: PAGE_URL,
  },
  twitter: {
    card: "summary",
    title: "Blog Categories | Abhisek",
    description:
      "Explore blog categories covering websites, web applications, business systems, and digital strategy.",
  },
  alternates: {
    canonical: PAGE_URL,
  },
  robots: {
    index: true,
    follow: true,
  },
};

function createJsonLd(categories: BlogCategory[]): object {
  return {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    "@id": `${PAGE_URL}/#webpage`,
    url: PAGE_URL,
    name: "Blog Categories",
    description:
      "Browse articles by category, covering websites, web applications, business systems, and digital strategy.",
    isPartOf: [
      {
        "@type": "CollectionPage",
        "@id": `${SITE_URL}/blogs/#webpage`,
      },
      {
        "@type": "WebSite",
        "@id": `${SITE_URL}/#website`,
      },
    ],
    publisher: {
      "@type": "Organization",
      "@id": `${SITE_URL}/#organization`,
    },
    mainEntity: {
      "@type": "ItemList",
      itemListElement: categories.map((category, index) => ({
        "@type": "ListItem",
        position: index + 1,
        url: `${PAGE_URL}/${category.slug}`,
        name: category.title,
      })),
    },
  };
}
