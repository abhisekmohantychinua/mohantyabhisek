"use client";

import { useGSAP } from "@gsap/react";
import "./thinking-progress-bar.css";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useRef } from "react";

gsap.registerPlugin(ScrollTrigger);

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
