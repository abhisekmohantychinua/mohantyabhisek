import BlogCardComponent from "@/components/shared/blog-card";
import { BlogCard } from "@/models/blog";
import "./styles.css";
import {
  getBlogCardsCached,
  getBlogCardsByQuery,
} from "@/services/blog-service";

type BlogListProps = {
  query: string | undefined;
};
export default async function BlogList({ query }: BlogListProps) {
  let blogs: BlogCard[] = [];
  if (query && query.trim() !== "") {
    blogs = await getBlogCardsByQuery(query);
  } else {
    blogs = await getBlogCardsCached();
  }
  return (
    <>
      <section
        className="blog-list-section"
        aria-labelledby="blog-list-heading"
      >
        <h2 className="blog-list-heading" id="blog-list-heading">
          {query ? `Search results for "${query}"` : "Read our latest Blogs"}
        </h2>
        {blogs.length === 0 ? (
          <p className="blog-list-empty">No blogs found.</p>
        ) : (
          <div className="blog-list-grid">
            {blogs.map((blogCard) => (
              <BlogCardComponent key={blogCard.slug} blogCard={blogCard} />
            ))}
          </div>
        )}
      </section>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(createJsonLd(blogs)),
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
