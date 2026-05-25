"use client";

import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import type { JSX } from "react";

export default function CtaContentAnimator(): JSX.Element | null {
  useGSAP(() => {
    gsap.from(".cta-inner > *", {
      y: 50,
      opacity: 0,
      duration: 0.35,
      stagger: 0.25,
      ease: "materialEase",
      scrollTrigger: {
        trigger: ".cta-section",
        start: "top 85%",
        end: "top 85%",
        toggleActions: "play none none reverse",
      },
    });
  });
  return null;
}
