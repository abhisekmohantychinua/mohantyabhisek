import "./styles.css";

import type { JSX } from "react";

import type { BlogCard } from "@/features/blogs/models/blog";
import {
  getBlogCardsPage,
  getCachedBlogCardsPage,
} from "@/features/blogs/services/blog-service";
import type PageResponse from "@/models/page-response";

import BlogListClient from "../list-client";

type BlogListProps = {
  query: string | undefined;
};
export default async function BlogList({
  query,
}: BlogListProps): Promise<JSX.Element> {
  let response: PageResponse<BlogCard>;

  if (query && query.trim() !== "") {
    response = await getBlogCardsPage(query, 0);
  } else {
    response = await getCachedBlogCardsPage(0);
  }
  return (
    <>
      <BlogListClient initialResponse={response} query={query} />

      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(createJsonLd(response.items)),
        }}
      />
    </>
  );
}

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
