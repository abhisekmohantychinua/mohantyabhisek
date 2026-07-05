import "./styles.css";

import { ArrowUpRight } from "lucide-react";
import Link from "next/link";
import type { JSX } from "react";

import { Button } from "@/components/ui/button";
import type { BlogCard as BlogCardType } from "@/features/blogs/models/blog";

type BlogCardProps = {
  blogCard: BlogCardType;
};
export default function BlogCard({ blogCard }: BlogCardProps): JSX.Element {
  return (
    <Link href={`blogs/${blogCard.slug}`} className="blog-card__wrapper">
      <article className="blog-card">
        <time
          className="blog-card__date"
          dateTime={new Date(blogCard.postedAt).toISOString()}
        >
          {new Date(blogCard.postedAt).toLocaleDateString(undefined, {
            year: "numeric",
            month: "long",
            day: "numeric",
          })}
        </time>
        <h3 className="blog-card__heading">{blogCard.title}</h3>
        <p className="blog-card__description">{blogCard.description}</p>
        <Button variant="ghost" size="sm">
          Read More
          <ArrowUpRight />
        </Button>
      </article>
    </Link>
  );
}
