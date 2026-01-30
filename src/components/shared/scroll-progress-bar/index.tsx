"use client";

import { useRef } from "react";
import { gsap } from "gsap";
import { useGSAP } from "@gsap/react";

interface ScrollProgressBarProps {
  containerClass: string; // class of container to track
  className?: string; // extra classes for styling
  scrollTriggerStart?: string;
  scrollTriggerEnd?: string;
}

export default function ScrollProgressBar({
  containerClass,
  className = "",
  scrollTriggerStart,
  scrollTriggerEnd,
}: ScrollProgressBarProps) {
  const progressFill = useRef<HTMLDivElement>(null);

  useGSAP(() => {
    gsap.to(progressFill.current, {
      height: "100%",
      scrollTrigger: {
        trigger: `.${containerClass}`,
        start: scrollTriggerStart || "top top",
        end: scrollTriggerEnd || "bottom bottom",
        scrub: 2,
      },
    });
  });

  return (
    <div
      className={`absolute left-4 top-1/2 transform -translate-y-1/2 h-4/5 w-[2px] bg-foreground/80 ${className}`}
    >
      <div ref={progressFill} className={`h-0 w-[2px] bg-accent origin-top`} />
    </div>
  );
}
