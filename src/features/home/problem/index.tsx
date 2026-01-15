import ScrollReplace from "./scroll-replace";
import "./styles.css";

const lines = [
  "You know something needs to be done, but not what should come first.",
  "Everyone suggests a solution, but few understand your context.",
  "Time, money, and credibility are already involved.",
  "Fixing later often costs far more than thinking now.",
];

/**
 * Problem Framing Section Component
 */
export default function Problem() {
  return (
    <>
      <section
        className="problem-section"
        id="problem-section"
        aria-labelledby="problem-heading"
      >
        <div className="problem-heading-wrap">
          <p className="problem-kicker">Problem Framing</p>
          <h2 id="problem-heading" className="problem-heading">
            Before moving forward
          </h2>
        </div>
        <div className="problem-divider" />
        <div className="problem-pin-wrap">
          <div className="problem-content">
            <div className="problem-text-slot">
              {lines.map((text, i) => (
                <p key={i} className="problem-text-line">
                  {text}
                </p>
              ))}
            </div>
          </div>
        </div>
      </section>
      <ScrollReplace />
    </>
  );
}
