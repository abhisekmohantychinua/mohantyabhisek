import "./styles.css";

import { ArrowUpRightIcon } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import type { JSX } from "react";

import BrandMark from "@/components/shared/brand-mark";
import CtaDialog from "@/components/shared/cta-dialog";
import { Button } from "@/components/ui/button";

export default function Hero(): JSX.Element {
  return (
    <section
      className="hero__section"
      role="banner"
      aria-labelledby="hero-headline"
      id="hero__section"
    >
      <div className="hero__content">
        <div className="hero__header">
          <h1 id="hero__heading" className="hero__heading">
            Custom Websites <br className="hero__heading-br-infrequent" /> And
            Web <br className="hero__heading-br-frequent" />
            Applications <br className="hero__heading-br-infrequent" /> Built
            With <br className="hero__heading-br-frequent" />
            <span className="highlight">Clarity</span>{" "}
            <br className="hero__heading-br-infrequent" />
            And Purpose.
          </h1>
          <p className="hero__description">
            Every project starts with understanding the business, defining clear
            objectives, and choosing the right solution before development
            begins. From websites to custom web applications, the focus remains
            on purpose, structure, and long-term value.
          </p>
        </div>

        <div className="hero__actions">
          <div className="hero__actions-cta-wrapper">
            <CtaDialog />
          </div>
          <div className="hero__actions-cta-secondary-wrapper">
            <Button
              variant="ghost"
              size="default"
              className="hero__cta-secondary"
              type="button"
              aria-describedby="secondary-cta-description"
              data-icon="inline-end"
              asChild
            >
              <Link href="/works">
                View my work
                <ArrowUpRightIcon />
              </Link>
            </Button>
          </div>
        </div>

        <figure className="hero__figure">
          <Image
            src="/hero.png"
            alt=""
            width={1140}
            height={510}
            className="hero__figure-image"
          />
          <figcaption className="hero__figure-caption">
            Every solution starts with understanding the business.
          </figcaption>
          <BrandMark
            className="hero__figure-brand-circle"
            variant="circle"
            height={100}
          />
        </figure>
      </div>
      <div className="hero__scroll-down">
        <BrandMark height={510} />
        <span className="hero__scroll-down-text">Scroll Down</span>
      </div>
    </section>
  );
}
