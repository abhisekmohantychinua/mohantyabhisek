"use client";

import { useGSAP } from "@gsap/react";
import gsap from "gsap";

export default function CtaContentAnimator() {
  useGSAP(() => {
    gsap.from(".cta-inner > *", {
      y: 50,
      opacity: 0,
      duration: 0.3,
      stagger: 0.15,
      ease: "none",
      scrollTrigger: {
        trigger: ".cta-section",
        start: "top 75%",
        end: "top 75%",
        toggleActions: "play none none reverse",
      },
    });
  });
  return null;
}
