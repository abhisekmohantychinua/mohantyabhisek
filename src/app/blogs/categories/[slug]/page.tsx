import type { Metadata } from "next";
import { notFound } from "next/navigation";
import type { JSX } from "react";

import BlogCategoryPosts from "@/features/blogs/components/blog-category-posts";
import CategoryHeader from "@/features/blogs/components/category-header";
import type { BlogCard } from "@/features/blogs/models/blog";
import type BlogCategory from "@/features/blogs/models/blog-category";
import {
  getBlogCategoryBySlug,
  getCachedAllBlogCategory,
} from "@/features/blogs/services/blog-category-service";
import { getCachedBlogCardsByCategorySlug } from "@/features/blogs/services/blog-service";

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
  const slug = (await params).slug;
  const category = await getBlogCategoryBySlug(slug);

  if (!category) {
    notFound();
  }

  const blogs = await getCachedBlogCardsByCategorySlug(category.slug);

  return (
    <>
      <CategoryHeader
        title={category.title}
        description={category.description}
      />
      <BlogCategoryPosts categoryTitle={category.title} blogs={blogs} />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(createJsonLd(category, blogs)),
        }}
      />
    </>
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
  const title = `${category.title} Blogs | Abhisek`;
  const description = category.description;

  return {
    title,
    description,

    openGraph: {
      type: "website",
      url,
      title,
      description,
      siteName: "Abhisek",
    },

    twitter: {
      card: "summary",
      title,
      description,
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

function createJsonLd(category: BlogCategory, blogs: BlogCard[]): object {
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
      "@type": "ItemList",
      "@id": `${url}/#blog-list`,
      name: `${category.title} Blog Posts`,
      numberOfItems: blogs.length,
      itemListElement: blogs.map((blog, index) => ({
        "@type": "ListItem",
        position: index + 1,
        item: {
          "@type": "BlogPosting",
          "@id": `${SITE_URL}/blogs/${blog.slug}/#blogposting`,
          url: `${SITE_URL}/blogs/${blog.slug}`,
          headline: blog.title,
          description: blog.description,
          datePublished: blog.postedAt,
        },
      })),
    },
  };
}
