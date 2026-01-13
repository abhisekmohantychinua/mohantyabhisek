import ThinkingContentAnimator from "./thinking-content-animator";
import ThinkingProgressBar from "./thinking-progress-bar";
import ThinkingStepAnimator from "./thinking-step-animator";
import "./styles.css";

type ThinkingStep = {
  number: string;
  title: string;
  text: string[];
};

const steps: ThinkingStep[] = [
  {
    number: "01",
    title: "You don’t have to explain everything perfectly.",
    text: [
      "The messy parts are okay.",
      "The half-formed thoughts are okay.",
      "Nothing needs to be decided yet.",
    ],
  },
  {
    number: "02",
    title: "Loose ideas are shaped into clear decisions.",
    text: [
      "What needs to be built now.",
      "What can wait.",
      "What doesn’t belong at all.",
    ],
  },
  {
    number: "03",
    title: "Execution happens in small, visible steps.",
    text: [
      "Progress is shared early.",
      "Assumptions are validated before going too far.",
      "Adjustments happen while it’s still easy.",
    ],
  },
  {
    number: "04",
    title: "The outcome is a usable, intentional product.",
    text: [
      "Built for real users.",
      "Aligned with the original goals.",
      "Ready to evolve, not restart",
    ],
  },
];

export default function Thinking() {
  return (
    <section className="thinking-section" aria-labelledby="thinking-heading">
      <div className="thinking-divider" aria-hidden="true" />

      <div className="thinking-content">
        <h2 id="thinking-heading" className="thinking-heading">
          How solution takes shape
        </h2>
        <p className="thinking-intro">
          From here, moving forward feels straightforward.
        </p>

        <div
          className="thinking-steps"
          role="list"
          aria-label="How decisions are approached"
        >
          {steps.map((step) => {
            return (
              <div className="thinking-step" role="listitem" key={step.number}>
                <span className="thinking-step-number" aria-hidden="true">
                  {step.number}
                </span>
                <div className="thinking-step-body">
                  <h3 className="thinking-step-title">{step.title}</h3>
                  <p className="thinking-step-text">
                    {step.text.map((paragraph, index) => (
                      <span key={index}>{paragraph} </span>
                    ))}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
      <ThinkingProgressBar />
      <ThinkingContentAnimator />
      <ThinkingStepAnimator />
    </section>
  );
}
