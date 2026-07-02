import "./styles.css";

import Image from "next/image";
import Link from "next/link";
import type { JSX } from "react";

import type { WorkCard as WorkCardType } from "../../models/work";

type WorkCardProps = {
  workCard: WorkCardType;
};

export default function WorkCard({ workCard }: WorkCardProps): JSX.Element {
  return (
    <Link href={`works/${workCard.slug}`} className="work-card__wrapper">
      <article className="work-card">
        <figure className="work-card__figure">
          <Image
            src={workCard.image.url}
            alt={workCard.image.alt}
            width={512}
            height={384}
            className="work-card__image"
          />
          <figcaption className="work-card__caption">
            {workCard.image.caption}
          </figcaption>
        </figure>
        <h3 className="work-card__heading">{workCard.title}</h3>
        <p className="work-card__description">{workCard.description}</p>
      </article>
    </Link>
  );
}
