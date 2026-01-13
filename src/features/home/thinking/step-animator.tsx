"use client";

import { useGSAP } from "@gsap/react";
import gsap from "gsap";

export default function StepAnimator() {
  useGSAP(() => {
    const stepCards = gsap.utils.toArray<HTMLElement>(".thinking-step");
    stepCards.forEach((card) => {
      const cardTimeline = gsap.timeline({
        scrollTrigger: {
          trigger: card,
          start: "top 70%",
          end: "top 30%",
          toggleActions: "play none none reverse",
        },
      });
      cardTimeline
        .to(card.querySelector(".thinking-step-number"), {
          backgroundColor: "var(--color-secondary)",
          color: "var(--color-background)",
          duration: 0.3,
          ease: "none",
        })
        .from(card.querySelector(".thinking-step-title"), {
          y: 20,
          opacity: 0,
          duration: 0.3,
          ease: "none",
        })
        .from(
          card.querySelector(".thinking-step-text"),
          {
            y: 20,
            opacity: 0,
            duration: 0.3,
            ease: "none",
          },
          "-=0.2"
        );
    });
  });
  return null;
}
