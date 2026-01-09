import { Button } from "@/components/ui/button";
import "./styles.css";

export default function Cta() {
  return (
    <section className="cta-section" aria-labelledby="cta-heading">
      <div className="cta-inner">
        <h2 id="cta-heading" className="cta-heading">
          Let&apos;s talk through your situation
        </h2>

        <p className="cta-copy" aria-label="What to share">
          You don&apos;t need a final brief.
          <br />
          You don&apos;t need technical answers.
          <br />
          Just share what feels unclear right now.
        </p>

        <Button
          className="cta-button"
          type="button"
          aria-label="Start the conversation"
        >
          Start the conversation
        </Button>

        <p className="cta-reassure" aria-label="Response reassurance">
          No pressure.
          <br />
          I&apos;ll respond thoughtfully.
        </p>
      </div>
    </section>
  );
}
