import "./styles.css";

import type { JSX } from "react";

import type BlogCategory from "@/features/blogs/models/blog-category";

import BlogCategoryCard from "../blog-category-card";

type BlogCategoryListProps = {
  categories: BlogCategory[];
};

export default function BlogCategoryList({
  categories,
}: BlogCategoryListProps): JSX.Element {
  return (
    <section
      className="blog-category-list__section"
      aria-labelledby="blog-category-list-heading"
    >
      <h2
        className="blog-category-list__heading"
        id="blog-category-list-heading"
      >
        Browse blog categories
      </h2>
      {categories.length === 0 ? (
        <p className="blog-category-list__empty">
          No blog categories are available yet.
        </p>
      ) : (
        <div className="blog-category-list__grid">
          {categories.map((category) => (
            <BlogCategoryCard key={category.slug} blogCategory={category} />
          ))}
        </div>
      )}
    </section>
  );
}
