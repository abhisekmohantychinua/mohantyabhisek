import "./styles.css";

import Link from "next/link";
import type { JSX } from "react";

import VideoPlayer from "@/components/shared/video-player";

import type Work from "../../models/work";

type HeroProps = Pick<
  Work,
  "title" | "description" | "sectors" | "featuredVideo"
>;

export default function Hero({
  title,
  description,
  sectors,
  featuredVideo,
}: HeroProps): JSX.Element {
  return (
    <>
      <section className="hero">
        <div className="hero__header">
          <h1 id="header__heading" className="hero__header-heading">
            {title}
          </h1>
          <p className="hero__header-description">{description}</p>
        </div>
        <div className="hero__bottom">
          <ul className="hero__bottom-sectors">
            {sectors.map((sector) => (
              <li className="hero__bottom-sector" key={sector}>
                <Link className="hero__bottom-sector-link" href="#">
                  {sector}
                </Link>
              </li>
            ))}
          </ul>
        </div>
        <VideoPlayer selectorPrefix="hero" video={featuredVideo} />
      </section>
    </>
  );
}
