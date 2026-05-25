"use client";

import { sendGTMEvent } from "@next/third-parties/google";
import type { JSX } from "react";
import { useEffect, useRef } from "react";

type SectionViewProps = {
  targetId: string;
};

export default function SectionView({
  targetId,
}: SectionViewProps): JSX.Element | null {
  const fired = useRef(false);

  useEffect(() => {
    const element = document.getElementById(targetId);
    if (!element || fired.current) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !fired.current) {
          sendGTMEvent({ event: "section_view" });
          fired.current = true;
          observer.disconnect();
        }
      },
      { threshold: 0.1 },
    );

    observer.observe(element);

    return (): void => observer.disconnect();
  }, [targetId]);

  return null;
}
