"use client";

import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { CustomEase } from "gsap/CustomEase";
import { ScrollTrigger } from "gsap/ScrollTrigger";

// Register GSAP plugins
gsap.registerPlugin(ScrollTrigger, CustomEase);

/**
 * GSAPInit Component
 * Purpose: Initializes GSAP with custom easing functions for consistent animations.
 */
export default function GSAPInit() {
  useGSAP(() => {
    // Define a custom easing function named "materialEase", inspired by Material Design principles
    CustomEase.create("materialEase", "M0,0 C0.4,0 0.2,1 1,1");
  });
  return null;
}
