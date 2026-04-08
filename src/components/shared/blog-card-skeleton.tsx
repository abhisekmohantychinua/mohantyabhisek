import { Skeleton } from "@/components/ui/skeleton";

export default function BlogCardSkeleton() {
  return (
    <article className="blog-card-skeleton">
      <div className="blog-card-skeleton-heading">
        <Skeleton className="blog-card-skeleton-title" />
        <Skeleton className="blog-card-skeleton-title blog-card-skeleton-title-short" />
      </div>
      <div className="blog-card-skeleton-body">
        <Skeleton className="blog-card-skeleton-line" />
        <Skeleton className="blog-card-skeleton-line" />
        <Skeleton className="blog-card-skeleton-line blog-card-skeleton-line-short" />
      </div>
      <div className="blog-card-skeleton-footer">
        <Skeleton className="blog-card-skeleton-date" />
      </div>
    </article>
  );
}
