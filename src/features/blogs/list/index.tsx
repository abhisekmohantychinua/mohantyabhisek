import BlogCardComponent from "@/components/shared/blog-card";
import { BlogCard } from "@/models/blog";
import "./styles.css";

type BlogListProps = {
  blogCards: BlogCard[];
  query: string | undefined;
};
export default function BlogList({ blogCards, query }: BlogListProps) {
  return (
    <section className="blog-list-section" aria-labelledby="blog-list-heading">
      <h2 className="blog-list-heading" id="blog-list-heading">
        {query ? `Search results for "${query}"` : "Read our latest Blogs"}
      </h2>
      {blogCards.length === 0 ? (
        <p className="blog-list-empty">No blogs found.</p>
      ) : (
        <div className="blog-list-grid">
          {blogCards.map((blogCard) => (
            <BlogCardComponent key={blogCard.slug} blogCard={blogCard} />
          ))}
        </div>
      )}
    </section>
  );
}
