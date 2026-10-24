import type { Metadata } from "next";
import { notFound } from "next/navigation";
import type { JSX } from "react";

import type BlogCategory from "@/features/blogs/models/blog-category";
import {
  getBlogCategoryBySlug,
  getCachedAllBlogCategory,
} from "@/features/blogs/services/blog-category-service";

const SITE_URL = "https://mohantyabhisek.com";
const CATEGORIES_URL = `${SITE_URL}/blogs/categories`;

type BlogCategoryPageParams = {
  params: Promise<{
    slug: string;
  }>;
};

export const revalidate = 86400;

export async function generateStaticParams(): Promise<{ slug: string }[]> {
  const categories = await getCachedAllBlogCategory();

  return categories.map(({ slug }) => ({ slug }));
}

export default async function BlogCategoryPage({
  params,
}: BlogCategoryPageParams): Promise<JSX.Element> {
  const category = await getBlogCategoryBySlug((await params).slug);

  if (!category) {
    notFound();
  }

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{
        __html: JSON.stringify(createJsonLd(category)),
      }}
    />
  );
}

export async function generateMetadata({
  params,
}: BlogCategoryPageParams): Promise<Metadata> {
  const category = await getBlogCategoryBySlug((await params).slug);

  if (!category) {
    notFound();
  }

  const url = `${CATEGORIES_URL}/${category.slug}`;

  return {
    title: `${category.title} | Blog Category | Abhisek`,
    description: category.description,
    openGraph: {
      type: "website",
      title: category.title,
      description: category.description,
      url,
    },
    twitter: {
      card: "summary",
      title: category.title,
      description: category.description,
    },
    alternates: {
      canonical: url,
    },
    robots: {
      index: true,
      follow: true,
    },
  };
}

function createJsonLd(category: BlogCategory): object {
  const url = `${CATEGORIES_URL}/${category.slug}`;

  return {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    "@id": `${url}/#webpage`,
    url,
    name: category.title,
    description: category.description,
    dateCreated: category.createdAt,
    dateModified: category.lastModifiedAt,
    isPartOf: [
      {
        "@type": "CollectionPage",
        "@id": `${CATEGORIES_URL}/#webpage`,
      },
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
      "@type": "DefinedTerm",
      "@id": `${url}/#category`,
      name: category.title,
      description: category.description,
      url,
      dateCreated: category.createdAt,
      dateModified: category.lastModifiedAt,
      inDefinedTermSet: {
        "@type": "DefinedTermSet",
        "@id": `${CATEGORIES_URL}/#category-set`,
        name: "Blog Categories",
        url: CATEGORIES_URL,
      },
    },
  };
}
