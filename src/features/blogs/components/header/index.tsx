import "./styles.css";

import type { JSX } from "react";

export default function Header(): JSX.Element {
  return (
    <div className="header">
      <h1 id="header__heading" className="header__heading">
        Thoughtful <span className="highlight">Writing</span> On Websites,
        Applications, And Business Systems
      </h1>
      <p className="header__description">
        A collection of blog posts exploring websites, web applications,
        business systems, and the decisions behind building digital solutions
        with clarity and purpose.
      </p>
    </div>
  );
}
