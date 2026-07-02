import "./styles.css";

import type { JSX } from "react";

import { Skeleton } from "@/components/ui/skeleton";

export default function BlogCardSkeleton(): JSX.Element {
  return (
    <article className="blog-card-skeleton">
      <Skeleton className="blog-card-skeleton__date" />

      <div className="blog-card-skeleton__heading">
        <Skeleton className="blog-card-skeleton__title" />
        <Skeleton className="blog-card-skeleton__title" />
        <Skeleton className="blog-card-skeleton__title blog-card-skeleton__title-short" />
      </div>

      <div className="blog-card-skeleton__body">
        <Skeleton className="blog-card-skeleton__line" />
        <Skeleton className="blog-card-skeleton__line" />
        <Skeleton className="blog-card-skeleton__line" />
        <Skeleton className="blog-card-skeleton__line blog-card-skeleton__line-short" />
      </div>

      <div className="blog-card-skeleton__footer">
        <Skeleton className="blog-card-skeleton__button" />
      </div>
    </article>
  );
}
