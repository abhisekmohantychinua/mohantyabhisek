import { BlogCard } from "@/models/blog";
import Link from "next/link";

type BlogCardProps = {
  blogCard: BlogCard;
};
export default function BlogCardComponent({ blogCard }: BlogCardProps) {
  return (
    <article className="blog-card">
      <h3 className="blog-card-heading">
        <Link href={`/blogs/${blogCard.slug}`} className="blog-card-title">
          {blogCard.title}
        </Link>
      </h3>
      <p className="blog-card-description">{blogCard.description}</p>
      <div className="blog-card-footer">
        <time
          className="blog-card-date"
          dateTime={blogCard.postedAt.toISOString()}
        >
          {blogCard.postedAt.toLocaleDateString(undefined, {
            year: "numeric",
            month: "long",
            day: "numeric",
          })}
        </time>
      </div>
    </article>
  );
}
