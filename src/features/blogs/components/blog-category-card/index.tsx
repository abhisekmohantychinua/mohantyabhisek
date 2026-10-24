import "./styles.css";

import { ArrowUpRight } from "lucide-react";
import Link from "next/link";
import type { JSX } from "react";

import type BlogCategory from "@/features/blogs/models/blog-category";

type BlogCategoryCardProps = {
  blogCategory: BlogCategory;
};

export default function BlogCategoryCard({
  blogCategory,
}: BlogCategoryCardProps): JSX.Element {
  const updatedAt = new Date(blogCategory.lastModifiedAt);

  return (
    <Link
      href={`/blogs/categories/${blogCategory.slug}`}
      className="blog-category-card__wrapper"
    >
      <article className="blog-category-card">
        <p className="blog-category-card__updated">
          Updated{" "}
          <time dateTime={updatedAt.toISOString()}>
            {updatedAt.toLocaleDateString(undefined, {
              year: "numeric",
              month: "long",
              day: "numeric",
            })}
          </time>
        </p>
        <h3 className="blog-category-card__heading">{blogCategory.title}</h3>
        <p className="blog-category-card__description">
          {blogCategory.description}
        </p>
        <span className="blog-category-card__action">
          Explore category
          <ArrowUpRight aria-hidden="true" />
        </span>
      </article>
    </Link>
  );
}
