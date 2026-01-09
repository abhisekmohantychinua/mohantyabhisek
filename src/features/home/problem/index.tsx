import "./styles.css";

export default function Problem() {
  return (
    <section className="problem-section" aria-labelledby="problem-heading">
      <div className="problem-line" aria-hidden="true" />

      <div className="problem-content problem-animate">
        <p className="problem-kicker">Problem Framing</p>

        <h2 id="problem-heading" className="problem-heading">
          Most digital work starts too fast.
        </h2>

        <div
          className="problem-notes"
          aria-label="Observations about common project issues"
        >
          <p className="problem-note">Tools are chosen early.</p>
          <p className="problem-note">Features are added quickly.</p>
          <p className="problem-note">Structure is often missing.</p>
        </div>

        <p className="problem-secondary" aria-label="Consequences">
          The real cost shows up later.
          <br />
          Rework. Confusion. Lost time.
        </p>

        <p className="problem-closing" aria-label="Reframing the problem">
          This is not a skill problem.
          <br />
          It&apos;s a thinking problem.
        </p>
      </div>
    </section>
  );
}
