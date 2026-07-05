import type { Metadata } from "next";
import type { JSX } from "react";

import Header from "@/features/blogs/components/header";
import BlogList from "@/features/blogs/components/list";
import BlogSearch from "@/features/blogs/components/search";
import type { BlogCard } from "@/features/blogs/models/blog";
import {
  getBlogCardsPage,
  getCachedBlogCardsPage,
} from "@/features/blogs/services/blog-service";
import type PageResponse from "@/models/page-response";

type BlogsParams = {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
};

export default async function Blogs({
  searchParams,
}: BlogsParams): Promise<JSX.Element> {
  const q = (await searchParams).q;
  const query = Array.isArray(q) ? q[0] : q;

  let initialResponse: PageResponse<BlogCard>;
  if (query && query.trim() !== "") {
    initialResponse = await getBlogCardsPage(query, 0);
  } else {
    initialResponse = await getCachedBlogCardsPage(0);
  }

  return (
    <>
      <Header />
      <BlogSearch query={query} />
      <BlogList initialResponse={initialResponse} query={query} />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(createJsonLd(initialResponse.items)),
        }}
      />
    </>
  );
}

export const metadata: Metadata = {
  title: "Blogs On Websites, Web Applications & Business Systems | Abhisek",
  description:
    "Explore blogs covering website development, web applications, business systems, software planning, digital strategy, and technology decisions for modern businesses.",
  openGraph: {
    type: "website",
    title: "Blogs On Websites, Web Applications & Business Systems | Abhisek",
    description:
      "Explore blogs covering website development, web applications, business systems, software planning, digital strategy, and technology decisions for modern businesses.",
    url: "https://mohantyabhisek.com/blogs",
    images: [
      {
        url: "https://mohantyabhisek.com/blogs-og-image.png",
        width: 1200,
        height: 630,
        alt: "Blogs On Websites, Web Applications & Business Systems | Abhisek",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Blogs On Websites, Web Applications & Business Systems | Abhisek",
    description:
      "Explore blogs covering website development, web applications, business systems, software planning, digital strategy, and technology decisions for modern businesses.",
    images: ["https://mohantyabhisek.com/works-og-image.png"],
  },
  alternates: {
    canonical: "https://mohantyabhisek.com/blogs",
  },
  robots: {
    index: true,
    follow: true,
  },
};

function createJsonLd(blogs: BlogCard[]): object {
  return {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    "@id": "https://mohantyabhisek.com/blogs/#webpage",
    url: "https://mohantyabhisek.com/blogs",
    name: "Thoughtful Writing On Websites, Applications, And Business Systems",
    description:
      "A collection of blog posts exploring websites, web applications, business systems, and the decisions behind building digital solutions with clarity and purpose.",
    about: [
      {
        "@type": "Thing",
        name: "Website Development",
      },
      {
        "@type": "Thing",
        name: "Web Application Development",
      },
      {
        "@type": "Thing",
        name: "Business Systems",
      },
      {
        "@type": "Thing",
        name: "Digital Strategy",
      },
    ],
    isPartOf: {
      "@type": "WebSite",
      "@id": "https://mohantyabhisek.com/#website",
    },
    publisher: {
      "@type": "Organization",
      "@id": "https://mohantyabhisek.com/#organization",
    },
    mainEntity: {
      "@type": "ItemList",
      itemListElement: blogs.map((blog, index) => ({
        "@type": "ListItem",
        position: index + 1,
        url: `https://mohantyabhisek.com/blogs/${blog.slug}`,
        name: blog.title,
      })),
    },
  };
}
