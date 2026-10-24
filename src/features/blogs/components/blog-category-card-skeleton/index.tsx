import "./styles.css";

import type { JSX } from "react";

import { Skeleton } from "@/components/ui/skeleton";

export default function BlogCategoryCardSkeleton(): JSX.Element {
  return (
    <article className="blog-category-card-skeleton" aria-hidden="true">
      <Skeleton className="blog-category-card-skeleton__updated" />
      <div className="blog-category-card-skeleton__heading">
        <Skeleton className="blog-category-card-skeleton__title" />
        <Skeleton className="blog-category-card-skeleton__title blog-category-card-skeleton__title-short" />
      </div>
      <div className="blog-category-card-skeleton__description">
        <Skeleton className="blog-category-card-skeleton__line" />
        <Skeleton className="blog-category-card-skeleton__line" />
        <Skeleton className="blog-category-card-skeleton__line blog-category-card-skeleton__line-short" />
      </div>
      <Skeleton className="blog-category-card-skeleton__action" />
    </article>
  );
}
