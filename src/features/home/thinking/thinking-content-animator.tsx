"use client";

import { useGSAP } from "@gsap/react";
import gsap from "gsap";

export default function ThinkingContentAnimator() {
  useGSAP(() => {
    gsap.from(".thinking-content", {
      y: 50,
      opacity: 0,
      duration: 0.3,
      stagger: 1,
      ease: "none",
      scrollTrigger: {
        trigger: ".thinking-content",
        start: "top 75%",
        end: "top 75%",
        toggleActions: "play none none reverse",
      },
    });
  });
  return null;
}
