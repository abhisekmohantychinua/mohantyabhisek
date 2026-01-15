"use client";

import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

// Register the ScrollTrigger plugin with GSAP
gsap.registerPlugin(ScrollTrigger);

/**
 * ScrollReplace Component
 *
 * Purpose: Implements a scroll-triggered text replacement animation for problem framing.
 *
 * Key Behaviors:
 * - Pins the problem section during scroll
 * - Sequentially scales out old text and brings in new text
 * - Smooth transitions to maintain user focus
 *
 * Note: Since there is no reliable solution found for nested scroll replace, this component
 * tweaks the scroll stack to achieve the desired effect. This creates an illusion of scroll
 * replace by not scaling down the previous line and aligning the vertical position of the new line
 * with the previous line.
 */
export default function ScrollReplace() {
  useGSAP(() => {
    // Select all problem text lines
    const lines = gsap.utils.toArray<HTMLElement>(".problem-text-line");

    gsap.set(lines, (i: number) => ({ opacity: i === 0 ? 1 : 0 }));

    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: ".problem-pin-wrap", // Trigger element for the scroll animation
        start: "top top", // Start when the top of the trigger hits the top of the viewport
        end: `+=${lines.length * 150}`, // End after scrolling through all lines
        scrub: 1, // Smooth scrubbing effect
        pin: true, // Pin the trigger element during the animation
        anticipatePin: 1, // Anticipate pinning for smoother experience
        onUpdate: (self) => {
          const min = 20; // vh
          const max = window.innerWidth <= 560 ? 40 : 70; // vh
          const value = min + (max - min) * self.progress;

          gsap.set(".problem-pin-wrap", {
            "--line-growth": `${value}vh`,
          });
        },
      },
    });
    lines.forEach((line, i) => {
      // Skip the first line since there's no previous line to replace
      if (i === 0) return;
      const previousLine: HTMLElement = lines[i - 1]; // Get the previous line
      // Animate the previous line scaling out and the current line scaling in
      tl.to(
        previousLine,
        { scale: 1, opacity: 0, duration: 1.35, ease: "materialEase" },
        i
      );
      // Instead of scaling down the previous line, we just move the new line into place and fade it in
      tl.from(
        line,
        {
          y: window.innerHeight,
          scale: 1.8,
          opacity: 0,
          duration: 1.35,
          ease: "materialEase",
        },
        i
      ).to(
        line,
        { scale: 1, opacity: 1, duration: 1.35, ease: "materialEase" },
        i + 0.8
      );
    });
  });

  useGSAP(() => {
    gsap.fromTo(
      ".problem-pin-wrap",
      { "--after-y": "100%" },
      {
        "--after-y": "0%",
        duration: 0.35,
        ease: "materialEase",
        scrollTrigger: {
          trigger: ".problem-pin-wrap",
          start: "top 10%",
          toggleActions: "play none none reverse",
        },
      }
    );
  });

  // This component does not render any visible elements itself
  return null;
}
