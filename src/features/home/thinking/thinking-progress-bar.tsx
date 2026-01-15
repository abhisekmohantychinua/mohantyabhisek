"use client";

import { useGSAP } from "@gsap/react";
import "./thinking-progress-bar.css";
import gsap from "gsap";
import { useRef } from "react";

/**
 * ThinkingProgressBar Component
 * Purpose: Displays a vertical progress bar that fills as the user scrolls through the thinking section.
 */
export default function ThinkingProgressBar() {
  const progressFill = useRef<HTMLDivElement>(null);
  useGSAP(() => {
    gsap.to(progressFill.current, {
      height: "100%",
      scrollTrigger: {
        trigger: ".thinking-section",
        start: "top+=100 center",
        end: "bottom-=100 center",
        scrub: 3,
      },
    });
  });

  return (
    <div className="progress-bar">
      <div ref={progressFill} className="progress-fill" />
    </div>
  );
}
