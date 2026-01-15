"use client";

import { useGSAP } from "@gsap/react";
import gsap from "gsap";

/**
 * ThinkingStepAnimator Component
 * Purpose: Animates each thinking step card as it scrolls into view.
 */
export default function ThinkingStepAnimator() {
  useGSAP(() => {
    const stepCards = gsap.utils.toArray<HTMLElement>(".thinking-step");
    stepCards.forEach((card) => {
      const cardTimeline = gsap.timeline({
        scrollTrigger: {
          trigger: card,
          start: "top 85%",
          end: "top 15%",
          toggleActions: "play none none reverse",
        },
      });
      cardTimeline
        .to(card.querySelector(".thinking-step-number"), {
          backgroundColor: "var(--color-secondary)",
          color: "var(--color-background)",
          duration: 0.35,
          ease: "materialEase",
        })
        .from(card.querySelector(".thinking-step-title"), {
          y: 20,
          opacity: 0,
          duration: 0.35,
          ease: "materialEase",
        })
        .from(
          card.querySelector(".thinking-step-text"),
          {
            y: 20,
            opacity: 0,
            duration: 0.35,
            ease: "materialEase",
          },
          "-=0.25"
        );
    });
  });
  return null;
}
