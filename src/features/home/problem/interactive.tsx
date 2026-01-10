"use client";

import { useEffect, useRef, useState, type CSSProperties } from "react";

const lines = [
  "You know something needs to be done, but not what should come first.",
  "Everyone suggests a solution. Few understand your context.",
  "Time, money, and credibility are already involved.",
  "Fixing later often costs more than thinking now.",
];

export default function ProblemInteractive() {
  const sectionRef = useRef<HTMLDivElement | null>(null);
  const [inView, setInView] = useState(false);
  const [showText, setShowText] = useState(false);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const node = sectionRef.current;
    if (!node) return;

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          setInView(true);
        }
      },
      { threshold: 0.25 }
    );

    observer.observe(node);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (!inView) return;
    const timer = setTimeout(() => setShowText(true), 420);
    return () => clearTimeout(timer);
  }, [inView]);

  useEffect(() => {
    if (!inView) return;
    const node = sectionRef.current;
    if (!node) return;

    let rafId: number | null = null;

    const compute = () => {
      const rect = node.getBoundingClientRect();
      const start = rect.top + window.scrollY;
      const end = rect.bottom + window.scrollY - window.innerHeight;
      const span = Math.max(end - start, 1);
      const raw = (window.scrollY - start) / span;
      const clamped = Math.min(Math.max(raw, 0), 1);
      setProgress(clamped);
    };

    const handleScroll = () => {
      if (rafId) cancelAnimationFrame(rafId);
      rafId = requestAnimationFrame(compute);
    };

    handleScroll();
    window.addEventListener("scroll", handleScroll, { passive: true });
    window.addEventListener("resize", handleScroll);

    return () => {
      if (rafId) cancelAnimationFrame(rafId);
      window.removeEventListener("scroll", handleScroll);
      window.removeEventListener("resize", handleScroll);
    };
  }, [inView]);

  const totalSteps = lines.length;
  const segment = progress * totalSteps;
  const baseIndex = Math.min(totalSteps - 1, Math.floor(segment));
  const fracRaw = segment - Math.floor(segment);
  const frac = Math.min(Math.max(fracRaw, 0), 1);
  const blendStart = 0.35;
  const blend = Math.min(
    Math.max((frac - blendStart) / (1 - blendStart), 0),
    1
  );
  const activeIndex = baseIndex;
  const nextIndex = Math.min(totalSteps - 1, baseIndex + 1);
  const isLast = baseIndex >= totalSteps - 1;
  const effectiveBlend = isLast ? 0 : blend;
  const showNext =
    !isLast && effectiveBlend > 0 && lines[nextIndex] !== lines[activeIndex];

  return (
    <div
      ref={sectionRef}
      className="problem-body"
      style={{ "--problem-steps": totalSteps } as CSSProperties}
    >
      <div
        className="problem-pin"
        style={
          {
            "--problem-blend": effectiveBlend,
            "--problem-frac": frac,
          } as CSSProperties
        }
      >
        <div className="problem-heading-wrap">
          <p className="problem-kicker">Problem Framing</p>
          <h2 id="problem-heading" className="problem-heading">
            Before moving forward
          </h2>
        </div>

        <div
          className={`problem-line ${inView ? "problem-line-straight" : ""}`}
          aria-hidden="true"
        >
          <span className="problem-line-bar" />
        </div>

        <div
          className="problem-text-slot"
          aria-live="polite"
          aria-atomic="true"
        >
          {showText && (
            <>
              <p
                key={`current-${activeIndex}`}
                className="problem-text-line current"
                aria-hidden={false}
              >
                {lines[activeIndex]}
              </p>
              {showNext && (
                <p
                  key={`next-${nextIndex}`}
                  className="problem-text-line next"
                  aria-hidden={true}
                >
                  {lines[nextIndex]}
                </p>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
}
