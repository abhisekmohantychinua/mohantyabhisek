import { BlogCard } from "@/models/blog";
import "./styles.css";
import {
  getCachedBlogCardsPage,
  getBlogCardsPage,
} from "@/services/blog-service";
import PageResponse from "@/models/page-response";
import BlogListClient from "../list-client";

type BlogListProps = {
  query: string | undefined;
};
export default async function BlogList({ query }: BlogListProps) {
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
