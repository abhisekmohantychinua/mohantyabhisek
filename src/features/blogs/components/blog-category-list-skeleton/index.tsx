import "./styles.css";

import type { JSX } from "react";

import { Skeleton } from "@/components/ui/skeleton";
import BlogCategoryCardSkeleton from "@/features/blogs/components/blog-category-card-skeleton";

type BlogCategoryListSkeletonProps = {
  count?: number;
};

export default function BlogCategoryListSkeleton({
  count = 9,
}: BlogCategoryListSkeletonProps): JSX.Element {
  return (
    <section
      className="blog-category-list-skeleton__section"
      aria-labelledby="blog-category-list-skeleton-heading"
      aria-busy="true"
    >
      <div
        className="blog-category-list-skeleton__heading"
        id="blog-category-list-skeleton-heading"
      >
        <Skeleton className="blog-category-list-skeleton__title" />
      </div>
      <div className="blog-category-list-skeleton__grid">
        {Array.from({ length: count }).map((_, index) => (
          <BlogCategoryCardSkeleton key={`blog-category-skeleton-${index}`} />
        ))}
      </div>
    </section>
  );
}
