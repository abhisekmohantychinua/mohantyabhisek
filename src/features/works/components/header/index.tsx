import "./styles.css";

import type { JSX } from "react";

export default function Header(): JSX.Element {
  return (
    <div className="header">
      <h1 id="header__heading" className="header__heading">
        Selected <span className="highlight">Case Studies</span> <br /> And
        Digital Projects
      </h1>
      <p className="header__description">
        A collection of projects, ideas, and digital solutions built across
        different industries, requirements, and business contexts. Each case
        study explores the challenge, approach, and outcome behind the work.
      </p>
    </div>
  );
}
