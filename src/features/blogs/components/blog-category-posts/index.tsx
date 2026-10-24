import "./styles.css";

import type { JSX } from "react";

import BlogCard from "@/features/blogs/components/blog-card";
import type { BlogCard as BlogCardType } from "@/features/blogs/models/blog";

type BlogCategoryPostsProps = {
  categoryTitle: string;
  blogs: BlogCardType[];
};

export default function BlogCategoryPosts({
  categoryTitle,
  blogs,
}: BlogCategoryPostsProps): JSX.Element {
  return (
    <section
      className="blog-category-posts__section"
      aria-labelledby="blog-category-posts-heading"
    >
      <h2
        className="blog-category-posts__heading"
        id="blog-category-posts-heading"
      >
        Blogs in {categoryTitle}
      </h2>
      {blogs.length === 0 ? (
        <p className="blog-category-posts__empty">
          No blogs are available in this category yet.
        </p>
      ) : (
        <div className="blog-category-posts__grid">
          {blogs.map((blogCard) => (
            <BlogCard key={blogCard.slug} blogCard={blogCard} />
          ))}
        </div>
      )}
    </section>
  );
}
