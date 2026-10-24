import "./styles.css";

import type { JSX } from "react";

type CategoryHeaderProps = {
  title?: string;
  description?: string;
};

export default function CategoryHeader({
  title = "Explore Blog Categories",
  description = "Browse thoughtful writing on websites, applications, business systems, and the decisions behind building digital solutions.",
}: CategoryHeaderProps): JSX.Element {
  return (
    <header className="blog-category-header">
      <h1
        id="blog-category-header__heading"
        className="blog-category-header__heading"
      >
        {title === "Explore Blog Categories" ? (
          <>
            Explore Blog <span className="highlight">Categories</span>
          </>
        ) : (
          title
        )}
      </h1>
      <p className="blog-category-header__description">{description}</p>
    </header>
  );
}
