import { notFound } from "next/navigation";
import "./styles.css";
import ScrollProgressBar from "@/components/shared/scroll-progress-bar";
import Blog from "@/models/blog";
import { getBySlug } from "@/services/blog-service";
import { Metadata } from "next";
import { getBlogMetadataBySlug } from "@/services/blog-metadata-service";
import ReadMore from "@/features/blogs/slug/read-more";

const SITE_URL = "https://mohantyabhisek.com";
type BlogPageParams = {
  params: Promise<{
    slug: string;
  }>;
};

export const dynamicParams = true;
export const revalidate = 86400;

export default async function BlogPage({ params }: BlogPageParams) {
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
      <ScrollProgressBar
        containerClass="blog-wrapper"
        className="fixed left-1! xl:hidden"
      />
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

  if (!metadata) {
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
    },

    twitter: {
      card: "summary",
      title: metadata.title,
      description: metadata.description,
    },

    robots: {
      index: true,
      follow: true,
    },

    alternates: {
      canonical: url,
    },
  };
}

function mapToJsonLd(blog: Blog) {
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

function mapToFaqJsonLd(blog: Blog) {
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
