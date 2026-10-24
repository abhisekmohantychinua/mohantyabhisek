import "./styles.css";

import type { JSX } from "react";

type CategoryHeaderProps = {
  title?: string;
  description?: string;
};

export default function CategoryHeader({
  title = "Explore Blog Categories",
  description = "Browse blog posts by topic, from website development and web applications to business systems, digital strategy, and the decisions behind building useful digital solutions.",
}: CategoryHeaderProps): JSX.Element {
  return (
    <header className="blog-category-header">
      <h1
        id="blog-category-header__heading"
        className="blog-category-header__heading"
      >
        {title === "Explore Blog Categories" ? (
          <>
            Explore Blogs By <span className="highlight">Category</span>
          </>
        ) : (
          title
        )}
      </h1>
      <p className="blog-category-header__description">{description}</p>
    </header>
  );
}
