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
  title: "Blog Categories — Explore Topics | Abhisek",
  description:
    "Explore blog categories covering website development, web applications, business systems, digital strategy, and practical decisions behind building digital solutions.",
  openGraph: {
    type: "website",
    title: "Blog Categories — Explore Topics | Abhisek",
    description:
      "Explore blog categories covering website development, web applications, business systems, digital strategy, and practical decisions behind building digital solutions.",
    url: PAGE_URL,
  },
  twitter: {
    card: "summary",
    title: "Blog Categories — Explore Topics | Abhisek",
    description:
      "Explore blog categories covering website development, web applications, business systems, digital strategy, and practical decisions behind building digital solutions.",
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
  const categoryUrl = (slug: string): string => `${PAGE_URL}/${slug}`;

  return {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    "@id": `${PAGE_URL}/#webpage`,
    url: PAGE_URL,
    name: "Explore Blogs By Category",
    description:
      "Browse blog posts by topic, from website development and web applications to business systems, digital strategy, and the decisions behind building useful digital solutions.",
    isPartOf: {
      "@type": "CollectionPage",
      "@id": `${SITE_URL}/blogs/#webpage`,
    },
    publisher: {
      "@type": "Organization",
      "@id": `${SITE_URL}/#organization`,
    },
    mainEntity: {
      "@type": "ItemList",
      name: "Blog Categories",
      numberOfItems: categories.length,
      itemListElement: categories.map((category, index) => ({
        "@type": "ListItem",
        position: index + 1,
        item: {
          "@type": "CollectionPage",
          "@id": `${categoryUrl(category.slug)}#webpage`,
          url: categoryUrl(category.slug),
          name: category.title,
          description: category.description,
        },
      })),
    },
  };
}
