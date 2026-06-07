import "./styles.css";

import type { JSX } from "react";

import BrandMark from "@/components/shared/brand-mark";

export default function AboutUs(): JSX.Element {
  return (
    <section className="about-us">
      <span className="about-us__kicker kicker">About</span>
      <h2 className="about-us__heading">
        Helping Businesses Build Websites and Web Applications
      </h2>
      <p className="about-us__description">
        I work with businesses that need more than a website and less than
        unnecessary complexity. From{" "}
        <span className="highlight">Business Websites</span> and{" "}
        <span className="highlight">Landing Pages</span> to{" "}
        <span className="highlight">SaaS Products</span> and{" "}
        <span className="highlight">Internal Systems</span>, each solution is
        designed around clear objectives, practical requirements, and long-term
        usability.
      </p>
      <hr className="about-us__divider divider"></hr>
      <ul className="about-us__stats-container">
        <li className="about-us__stats stats">
          <p className="about-us__stats-value stats-value">
            <span className="about-us__stats-number stats-number">3</span>+
          </p>
          <BrandMark
            variant="line-horizontal"
            className="about-us__stats-brand-line stats-brand-line"
          />
          <p>Years of experience</p>
        </li>
        <li className="about-us__stats stats">
          <p className="about-us__stats-value stats-value">
            <span className="about-us__stats-number stats-number">25</span>+
          </p>
          <BrandMark
            variant="line-horizontal"
            className="about-us__stats-brand-line stats-brand-line"
          />
          <p>Projects Delivered</p>
        </li>
        <li className="about-us__stats stats">
          <p className="about-us__stats-value stats-value">
            <span className="about-us__stats-number stats-number">90</span>%
          </p>
          <BrandMark
            variant="line-horizontal"
            className="about-us__stats-brand-line stats-brand-line"
          />
          <p className="about-us__stats-label">Client Satisfaction</p>
        </li>
        <li className="about-us__stats stats">
          <p className="about-us__stats-value stats-value">
            <span className="about-us__stats-number stats-number">4</span>+
          </p>
          <BrandMark
            variant="line-horizontal"
            className="about-us__stats-brand-line stats-brand-line"
          />
          <p className="about-us__stats-label">Industries Served</p>
        </li>
      </ul>
    </section>
  );
}
