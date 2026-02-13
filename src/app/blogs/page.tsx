import BlogList from "@/features/blogs/list";
import BlogSearch from "@/features/blogs/search";
import { BlogCard } from "@/models/blog";
import { getBlogCards, getBlogCardsByQuery } from "@/services/blog-service";
import { Metadata } from "next";

type BlogsParams = {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
};

export const revalidate = 86400; // 24 hours

export default async function Blogs({ searchParams }: BlogsParams) {
  const q = (await searchParams).q;
  const query = Array.isArray(q) ? q[0] : q;

  let blogs: BlogCard[] = [];
  if (query && query.trim() !== "") {
    blogs = await getBlogCardsByQuery(query);
  } else {
    blogs = await getBlogCards();
  }

  return (
    <>
      <h1 className="text-4xl font-bold text-primary my-4 text-center">
        Blogs
      </h1>
      <p className="text-base text-foreground/80 mb-8 container px-6 lg:px-8 mx-auto text-center">
        Thoughtful writing on websites, structure, and practical execution.
      </p>
      <BlogSearch query={query} />
      <BlogList blogCards={blogs} query={query} />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(createJsonLd(blogs)),
        }}
      />
    </>
  );
}

export const metadata: Metadata = {
  title: "Blogs on Websites, Systems & Clarity | Abhisek",
  description:
    "Articles exploring clarity in web design, structure in digital systems, and practical execution for businesses.",
  openGraph: {
    type: "website",
    title: "Blogs on Websites, Systems & Clarity | Abhisek",
    description:
      "Articles exploring clarity in web design, structure in digital systems, and practical execution for businesses.",
    url: "https://mohantyabhisek.com/blogs",
  },
  twitter: {
    card: "summary_large_image",
    title: "Blogs on Websites, Systems & Clarity | Abhisek",
    description:
      "Articles exploring clarity in web design, structure in digital systems, and practical execution for businesses.",
  },
  alternates: {
    canonical: "https://mohantyabhisek.com/blogs",
  },
  robots: {
    index: true,
    follow: true,
  },
};
function createJsonLd(blogs: BlogCard[]) {
  return {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    "@id": "https://mohantyabhisek.com/blogs/#webpage",
    url: "https://mohantyabhisek.com/blogs",
    name: "Blogs on Websites, Systems & Clarity",
    description:
      "Articles exploring clarity in web design, structure in digital systems, and practical execution for businesses.",
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
