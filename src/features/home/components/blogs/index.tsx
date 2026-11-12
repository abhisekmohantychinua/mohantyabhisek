import "./styles.css";

import type { JSX } from "react";

import { CtaLink } from "@/components/shared/cta-link";
import { BlogCardComponent } from "@/features/blogs/shared/components";
import type { BlogCard } from "@/features/blogs/shared/models";
import { getBySlug } from "@/features/blogs/shared/services";

const blogSlugs: string[] = [
  "how-websites-are-becoming-business-systems-and-operational-platforms",
  "ai-built-vs-developer-built-websites-2026-time-cost-quality-comparison",
  "before-you-build-an-app-decide-where-it-should-exist-web-vs-native-app-decision-guide",
];

export default async function Blogs(): Promise<JSX.Element> {
  const blogCards: BlogCard[] = (
    await Promise.all(
      blogSlugs.map(async (blogSlug) => {
        const blog = await getBySlug(blogSlug);

        if (!blog) return null;

        return {
          slug: blog.slug,
          title: blog.title,
          description: blog.description,
          postedAt: blog.postedAt,
        } satisfies BlogCard;
      }),
    )
  ).filter((blogCard): blogCard is BlogCard => blogCard !== null);
  return (
    <section className="blogs">
      <span className="blogs__kicker kicker">Blog</span>
      <h2 className="blogs__heading">
        Thoughtful Writing On Websites,
        <br /> Applications, And Business Systems
      </h2>
      <p className="blogs__description">
        Articles exploring website strategy, web application development,
        business systems, and the decisions behind building digital solutions
        with clarity and purpose.
      </p>
      <ul className="blogs__card-items">
        {blogCards.map((blogCard) => (
          <li className="blogs__card-item" key={blogCard.slug}>
            <BlogCardComponent blogCard={blogCard} />
          </li>
        ))}
      </ul>
      <CtaLink href="/blogs">View More</CtaLink>
    </section>
  );
}
