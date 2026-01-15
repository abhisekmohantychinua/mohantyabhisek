"use client";

import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { CustomEase } from "gsap/CustomEase";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger, CustomEase);

export default function GSAPInit() {
  useGSAP(() => {
    CustomEase.create("materialEase", "M0,0 C0.4,0 0.2,1 1,1");
  });
  return null;
}
