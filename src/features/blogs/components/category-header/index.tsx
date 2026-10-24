import "./styles.css";

import type { JSX } from "react";

export default function CategoryHeader(): JSX.Element {
  return (
    <header className="blog-category-header">
      <h1
        id="blog-category-header__heading"
        className="blog-category-header__heading"
      >
        Explore Blog <span className="highlight">Categories</span>
      </h1>
      <p className="blog-category-header__description">
        Browse thoughtful writing on websites, applications, business systems,
        and the decisions behind building digital solutions.
      </p>
    </header>
  );
}
