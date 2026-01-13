"use client";

import { useGSAP } from "@gsap/react";
import gsap from "gsap";

export default function ServicesCardAnimator() {
  useGSAP(() => {
    const stepCards = gsap.utils.toArray<HTMLElement>(".services-card");
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
        .from(card.querySelector(".services-title"), {
          y: 20,
          opacity: 0,
          duration: 0.3,
          ease: "none",
        })
        .from(card.querySelector(".services-image"), {
          scale: 0,
          opacity: 0,
          duration: 0.3,
          ease: "none",
        })
        .from(
          card.querySelector(".services-lines"),
          {
            y: 20,
            opacity: 0,
            duration: 0.3,
            ease: "none",
          },
          "-=0.5"
        );
    });
  });
  return null;
}
