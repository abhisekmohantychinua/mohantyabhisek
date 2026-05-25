import "./styles.css";

import type { JSX } from "react";

import BlogCardComponent from "@/features/blogs/components/blog-card";
import { getLatestThreeBlogCardsExceptSlug } from "@/features/blogs/services/blog-service";

type ReadMoreProps = {
  slug: string;
};

export default async function ReadMore({
  slug,
}: ReadMoreProps): Promise<JSX.Element | null> {
  const latestBlogs = await getLatestThreeBlogCardsExceptSlug(slug);

  if (latestBlogs.length === 0) {
    return null; // Don't render the section if there are no blogs to show
  }

  return (
    <section className="read-more-section" aria-labelledby="read-more-heading">
      <h3 className="read-more-heading">Read More</h3>
      <div className="read-more-grid">
        {latestBlogs.map((blog) => (
          <BlogCardComponent key={blog.slug} blogCard={blog} />
        ))}
      </div>
    </section>
  );
}
