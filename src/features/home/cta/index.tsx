import { Button } from "@/components/ui/button";
import "./styles.css";
import CtaContentAnimator from "./cta-content-animator";

export default function Cta() {
  return (
    <section className="cta-section" aria-labelledby="cta-heading">
      <div className="cta-inner">
        <h2 id="cta-heading" className="cta-heading">
          The costliest mistakes usually happen before anything is built.
        </h2>

        <Button
          variant="accent"
          size="lg"
          className="cta-button"
          type="button"
          aria-describedby="primary-cta-description"
        >
          Start a conversation
        </Button>
        <p className="cta-reassure" aria-label="Response reassurance">
          One conversation for clarity. No commitment.
        </p>
      </div>
      <CtaContentAnimator />
    </section>
  );
}
