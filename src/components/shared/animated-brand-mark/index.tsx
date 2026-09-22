"use client";

import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import type { JSX } from "react";
import { useRef } from "react";

import BrandMark, { type BrandMarkProps } from "@/components/shared/brand-mark";

export interface AnimatedBrandMarkProps extends BrandMarkProps {
  duration?: number;
}

export default function AnimatedBrandMark({
  variant = "line-vertical",
  accentPercent = 40,
  duration = 1,
  accentClassName = "animated-brand-mark-accent",
  ...props
}: AnimatedBrandMarkProps): JSX.Element {
  const containerRef = useRef<SVGSVGElement>(null);

  useGSAP(
    () => {
      const container = containerRef.current;

      if (!container) {
        return;
      }

      const accent = container.querySelector(`.${accentClassName}`);

      if (!accent) {
        return;
      }

      if (variant === "circle") {
        const size = props.height ?? 100;
        const strokeWidth = props.thickness ?? 24;
        const radius = (size - strokeWidth) / 2;
        const circumference = 2 * Math.PI * radius;
        const accentLength = circumference * (accentPercent / 100);

        gsap.fromTo(
          accent,
          {
            strokeDasharray: `0 ${circumference}`,
          },
          {
            strokeDasharray: `${accentLength} ${circumference - accentLength}`,
            duration,
            ease: "materialEase",
          },
        );

        return;
      }

      const length = props.height ?? 150;
      const accentLength = length * (accentPercent / 100);

      if (variant === "line-horizontal") {
        gsap.fromTo(
          accent,
          {
            width: 0,
          },
          {
            width: accentLength,
            duration,
            ease: "materialEase",
          },
        );

        return;
      }

      gsap.fromTo(
        accent,
        {
          height: 0,
        },
        {
          height: accentLength,
          duration,
          ease: "materialEase",
        },
      );
    },
    {
      scope: containerRef,
    },
  );

  return (
    <BrandMark
      {...props}
      ref={containerRef}
      variant={variant}
      accentPercent={accentPercent}
      accentClassName={accentClassName}
    />
  );
}
