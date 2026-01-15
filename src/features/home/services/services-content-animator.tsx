"use client";

import { useGSAP } from "@gsap/react";
import gsap from "gsap";

/**
 * ServicesContentAnimator Component
 * Purpose: Animates the entrance of the services content section.
 */
export default function ServicesContentAnimator() {
  useGSAP(() => {
    gsap.from(".services-content > *", {
      y: 50,
      opacity: 0,
      duration: 0.35,
      stagger: 0.25,
      ease: "materialEase",
      scrollTrigger: {
        trigger: ".services-content",
        start: "top 85%",
        end: "top 85%",
        toggleActions: "play none none reverse",
      },
    });
  });
  return null;
}
