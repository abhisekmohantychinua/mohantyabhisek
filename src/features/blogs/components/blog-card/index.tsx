import "./styles.css";

import { ArrowUpRight } from "lucide-react";
import Link from "next/link";
import type { JSX } from "react";

import { Button } from "@/components/ui/button";
import type { BlogCard } from "@/features/blogs/models/blog";

type BlogCardProps = {
  blogCard: BlogCard;
};
export default function BlogCardComponent({
  blogCard,
}: BlogCardProps): JSX.Element {
  return (
    <Link href={`blogs/${blogCard.slug}`} className="blog-card">
      <article className="">
        <time
          className="blog-card-date"
          dateTime={new Date(blogCard.postedAt).toISOString()}
        >
          {new Date(blogCard.postedAt).toLocaleDateString(undefined, {
            year: "numeric",
            month: "long",
            day: "numeric",
          })}
        </time>
        <h3 className="blog-card-heading">{blogCard.title}</h3>
        <p className="blog-card-description">{blogCard.description}</p>
        <Button variant="ghost" size="sm">
          Read More
          <ArrowUpRight />
        </Button>
      </article>
    </Link>
  );
}
