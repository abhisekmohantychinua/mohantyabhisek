import "./styles.css";

type ThinkingStep = {
  number: string;
  title: string;
  text: string;
};

const steps: ThinkingStep[] = [
  {
    number: "01",
    title: "I start with the problem, not the platform.",
    text: "Tools change. The problem usually doesn’t.",
  },
  {
    number: "02",
    title: "I ask what must exist, not what can be built.",
    text: "More features don’t always mean more value.",
  },
  {
    number: "03",
    title: "I reduce before I design.",
    text: "Simpler systems are easier to trust and maintain.",
  },
  {
    number: "04",
    title: "I treat systems as long-term assets.",
    text: "Not quick wins. Not experiments without direction.",
  },
];

export default function Thinking() {
  return (
    <section className="thinking-section" aria-labelledby="thinking-heading">
      <div className="thinking-divider" aria-hidden="true" />

      <div className="thinking-content">
        <p className="thinking-kicker">How I Think</p>

        <h2 id="thinking-heading" className="thinking-heading">
          How I approach decisions
        </h2>

        <p className="thinking-intro">
          Before writing code or designing screens, I focus on clarity.
        </p>

        <div
          className="thinking-steps"
          role="list"
          aria-label="How decisions are approached"
        >
          {steps.map((step, index) => {
            const baseDelay = 0.18 + index * 0.14;
            return (
              <div className="thinking-step" role="listitem" key={step.number}>
                <span
                  className="thinking-step-number"
                  style={{ animationDelay: `${baseDelay}s` }}
                  aria-hidden="true"
                >
                  {step.number}
                </span>
                <div className="thinking-step-body">
                  <p
                    className="thinking-step-title"
                    style={{ animationDelay: `${baseDelay + 0.08}s` }}
                  >
                    {step.title}
                  </p>
                  <p
                    className="thinking-step-text"
                    style={{ animationDelay: `${baseDelay + 0.16}s` }}
                  >
                    {step.text}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
