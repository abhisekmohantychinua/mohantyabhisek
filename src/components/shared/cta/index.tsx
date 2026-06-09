import "./styles.css";

import type { JSX } from "react";

import CtaDialog from "@/components/shared/cta-dialog";

export default function Cta(): JSX.Element {
  return (
    <section className="cta-section" aria-labelledby="cta-heading">
      <h2 id="cta-heading" className="cta-section__heading">
        Let&apos;s Find The Right Solution For Your Business
      </h2>
      <p className="cta-section__description">
        Custom website development, web applications, and business systems built
        with clarity and purpose. Helping businesses plan, design, and build
        digital solutions around real goals.
      </p>
      <CtaDialog ctaButtonVariant="accent" />
    </section>
  );
}
