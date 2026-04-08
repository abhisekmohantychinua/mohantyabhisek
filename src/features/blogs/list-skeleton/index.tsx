import BlogCardSkeleton from "@/components/shared/blog-card-skeleton";
import { Skeleton } from "@/components/ui/skeleton";
import "./styles.css";

type BlogListSkeletonProps = {
  count?: number;
};

export default function BlogListSkeleton({ count = 9 }: BlogListSkeletonProps) {
  return (
    <section
      className="blog-list-skeleton-section"
      aria-labelledby="blog-list-skeleton-heading"
    >
      <div
        className="blog-list-skeleton-heading"
        id="blog-list-skeleton-heading"
      >
        <Skeleton className="blog-list-skeleton-title" />
        <Skeleton className="blog-list-skeleton-title blog-list-skeleton-title-short" />
      </div>
      <div className="blog-list-skeleton-grid">
        {Array.from({ length: count }).map((_, index) => (
          <BlogCardSkeleton key={`blog-card-skeleton-${index}`} />
        ))}
      </div>
    </section>
  );
}
