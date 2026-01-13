"use client";

import { useGSAP } from "@gsap/react";
import gsap from "gsap";

export default function ServicesContentAnimator() {
  useGSAP(() => {
    gsap.from(".services-content", {
      y: 50,
      opacity: 0,
      duration: 0.3,
      stagger: 1,
      ease: "none",
      scrollTrigger: {
        trigger: ".services-content",
        start: "top 75%",
        end: "top 75%",
        toggleActions: "play none none reverse",
      },
    });
  });
  return null;
}
