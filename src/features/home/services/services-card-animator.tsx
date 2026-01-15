"use client";

import { useGSAP } from "@gsap/react";
import gsap from "gsap";

export default function ServicesCardAnimator() {
  useGSAP(() => {
    const stepCards = gsap.utils.toArray<HTMLElement>(".services-card");
    stepCards.forEach((card) => {
      gsap.from(Array.from(card.children), {
        y: 50,
        opacity: 0,
        scale: 1,
        duration: 0.35,
        ease: "materialEase",
        stagger: 0.25,
        scrollTrigger: {
          trigger: card,
          start: "top 85%",
          end: "top 15%",
          toggleActions: "play none none reverse",
        },
      });
    });
  });
  return null;
}
