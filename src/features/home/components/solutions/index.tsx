import "./styles.css";

import Image from "next/image";
import type { JSX } from "react";

import BrandMark from "@/components/shared/brand-mark";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
} from "@/components/ui/carousel";

type SolutionCard = {
  tag: string;
  heading: string;
  description: string;
  image: string;
  caption: string;
};
const solutions: SolutionCard[] = [
  {
    tag: "Website Development",
    heading: "Websites For Businesses",
    description:
      "Websites designed to communicate clearly, build credibility, and help people understand your business before the first conversation begins.",
    image: "/services/business-website.png",
    caption:
      "Helping people understand your business before the first conversation.",
  },
  {
    tag: "Web Application Development",
    heading: "Custom Web Applications & SaaS Products",
    description:
      "Applications designed around user workflows, product requirements, and business objectives, with scalability and usability considered from the start.",
    image: "/services/saas.png",
    caption: "From product ideas to usable software.",
  },
  {
    tag: "Business Systems",
    heading: "ERP, CRM & Internal Management Systems",
    description:
      "Custom systems that help teams manage operations, centralize information, and streamline day-to-day processes across the business.",
    image: "/services/business-operations.png",
    caption: "Bringing people, processes, and information together.",
  },
];

export default function Solutions(): JSX.Element {
  return (
    <section className="solutions">
      <span className="solutions__kicker kicker">Solutions</span>
      <h2 className="solutions__heading">
        Websites, Web Applications, And Business Systems
      </h2>
      <p className="solutions__description">
        From establishing an online presence to building products and improving
        internal operations, solutions are designed around business goals,
        practical requirements, and long-term usability.
      </p>
      <BrandMark
        variant="line-horizontal"
        className="solutions__brand-mark"
        height={1200}
      />
      <Carousel
        opts={{
          dragFree: true,
          align: "start",
        }}
        className="solutions__carousel"
      >
        <CarouselContent>
          {solutions.map((solution, index) => (
            <CarouselItem
              key={solution.heading}
              className="solutions__card-item"
            >
              <article className="solutions__card">
                <span className="solutions__card-tag">{solution.tag}</span>
                <h3 className="solutions__card-heading">{solution.heading}</h3>
                <hr className="solutions__card-divider divider" />
                <p className="solutions__card-description">
                  {solution.description}
                </p>
                <figure className="solutions__card-background">
                  <Image
                    src={solution.image}
                    alt={`${solution.heading} - ${solution.caption}`}
                    height={457}
                    width={750}
                    className="solutions__card-image"
                    priority={index === 0}
                  />
                  <figcaption className="solutions__card-caption">
                    {solution.caption}
                  </figcaption>
                </figure>
              </article>
            </CarouselItem>
          ))}
        </CarouselContent>
      </Carousel>
    </section>
  );
}
