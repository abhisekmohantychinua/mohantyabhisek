import "./styles.css";

import type { JSX } from "react";

import { Skeleton } from "@/components/ui/skeleton";
import BlogCardSkeleton from "@/features/blogs/components/blog-card-skeleton";

type BlogListSkeletonProps = {
  count?: number;
};

export default function BlogListSkeleton({
  count = 9,
}: BlogListSkeletonProps): JSX.Element {
  return (
    <section
      className="blog-list-skeleton__section"
      aria-labelledby="blog-list-skeleton-heading"
    >
      <div
        className="blog-list-skeleton__heading"
        id="blog-list-skeleton-heading"
      >
        <Skeleton className="blog-list-skeleton__title" />
        <Skeleton className="blog-list-skeleton__title blog-list-skeleton__title-short" />
      </div>
      <div className="blog-list-skeleton__grid">
        {Array.from({ length: count }).map((_, index) => (
          <BlogCardSkeleton key={`blog-card-skeleton-${index}`} />
        ))}
      </div>
    </section>
  );
}
