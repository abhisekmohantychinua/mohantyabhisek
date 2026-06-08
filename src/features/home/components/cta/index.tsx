import "./styles.css";

import type { JSX } from "react";

import CtaDialog from "@/components/shared/cta-dialog";

import CtaContentAnimator from "./cta-content-animator";

export default function Cta(): JSX.Element {
  return (
    <section className="cta-section" aria-labelledby="cta-heading">
      <div className="cta-inner">
        <h2 id="cta-heading" className="cta-heading">
          The costliest mistakes usually happen before anything is built.
        </h2>
        <div className="cta-popover-wrap">
          <CtaDialog />
        </div>
        <p className="cta-reassure" aria-label="Response reassurance">
          One conversation for clarity. No commitment.
        </p>
      </div>
      <CtaContentAnimator />
    </section>
  );
}
