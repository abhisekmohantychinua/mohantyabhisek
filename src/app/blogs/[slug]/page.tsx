import "./styles.css";

import type { Metadata } from "next";
import { notFound } from "next/navigation";
import type { JSX } from "react";

import ReadMore from "@/features/blogs/components/read-more";
import type Blog from "@/features/blogs/models/blog";
import { getBlogMetadataBySlug } from "@/features/blogs/services/blog-metadata-service";
import {
  getAllBlogSlugs,
  getBySlug,
} from "@/features/blogs/services/blog-service";

const SITE_URL = "https://mohantyabhisek.com";
export const revalidate = 86400; // revalidate every 24 hours

type BlogPageParams = {
  params: Promise<{
    slug: string;
  }>;
};

export async function generateStaticParams(): Promise<
  {
    slug: string;
  }[]
> {
  const blogs = await getAllBlogSlugs();
  return blogs.map((slug) => ({
    slug: slug,
  }));
}

export default async function BlogPage({
  params,
}: BlogPageParams): Promise<JSX.Element> {
  const blog = await getBySlug((await params).slug);
  if (!blog) {
    return notFound();
  }

  const rawHtml = blog.content;
  const jsonLdSchema = mapToJsonLd(blog);
  const faqJsonLdSchema = mapToFaqJsonLd(blog);

  return (
    <>
      <article
        className="blog-wrapper"
        id="blog-wrapper"
        dangerouslySetInnerHTML={{ __html: rawHtml }}
      ></article>
      <ReadMore slug={blog.slug} />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLdSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLdSchema) }}
      />
    </>
  );
}

export async function generateMetadata({
  params,
}: BlogPageParams): Promise<Metadata> {
  const slug = (await params).slug;

  const metadata = await getBlogMetadataBySlug(slug);
  const blog = await getBySlug(slug);

  if (!metadata || !blog) {
    notFound();
  }

  const url = `${SITE_URL}/blogs/${metadata.slug}`;

  return {
    title: metadata.title,
    description: metadata.description,

    openGraph: {
      title: metadata.title,
      description: metadata.description,
      type: "article",
      url,
      publishedTime: blog.postedAt.toISOString(),
      modifiedTime: blog.lastModifiedAt.toISOString(),
    },

    twitter: {
      card: "summary",
      title: metadata.title,
      description: metadata.description,
    },

    authors: [
      {
        name: "Abhisek Mohanty",
        url: SITE_URL,
      },
    ],

    creator: "Abhisek Mohanty",
    publisher: "Abhisek Mohanty",

    robots: {
      index: true,
      follow: true,
    },

    alternates: {
      canonical: url,
    },
  };
}

function mapToJsonLd(blog: Blog): object {
  const blogUrl = `${SITE_URL}/blogs/${blog.slug}`;

  return {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    "@id": `${blogUrl}#blogposting`,
    headline: blog.title,
    description: blog.description,
    datePublished: blog.postedAt,
    dateModified: blog.lastModifiedAt,
    author: {
      "@type": "Person",
      "@id": `${SITE_URL}/#person`,
      name: "Abhisek Mohanty",
      url: SITE_URL,
    },
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
    mainEntityOfPage: {
      "@type": "WebPage",
      "@id": blogUrl,
    },
    about: blog.topics.map((topic) => ({
      "@type": "Thing",
      name: topic,
    })),
  };
}

function mapToFaqJsonLd(blog: Blog): object {
  const blogUrl = `${SITE_URL}/blogs/${blog.slug}`;
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "@id": `${blogUrl}#faq`,
    mainEntity: blog.faqs.map((faq) => ({
      "@type": "Question",
      name: faq.question,
      acceptedAnswer: {
        "@type": "Answer",
        text: faq.answer,
      },
    })),
  };
}
