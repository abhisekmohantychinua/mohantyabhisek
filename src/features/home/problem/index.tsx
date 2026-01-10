import ProblemInteractive from "./interactive";
import "./styles.css";

export default function Problem() {
  return (
    <section className="problem-section" aria-labelledby="problem-heading">
      <div className="problem-shell">
        <ProblemInteractive />
      </div>
    </section>
  );
}
