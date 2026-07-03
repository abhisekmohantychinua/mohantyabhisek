import "./styles.css";

import Link from "next/link";
import type { JSX } from "react";

import type Work from "../../models/work";

type WorkTopProps = Pick<Work, "title" | "description" | "sectors">;

export default function WorkTop({
  title,
  description,
  sectors,
}: WorkTopProps): JSX.Element {
  return (
    <>
      <div className="work-top__header">
        <h1 id="header__heading" className="work-top__header-heading">
          {title}
        </h1>
        <p className="work-top__header-description">{description}</p>
      </div>
      <div className="work-top__bottom">
        <ul className="work-top__bottom-sectors">
          {sectors.map((sector) => (
            <li className="work-top__bottom-sector" key={sector}>
              <Link className="work-top__bottom-sector-link" href="#">
                {sector}
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </>
  );
}
