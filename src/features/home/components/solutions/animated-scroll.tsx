"use client";

import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import type { JSX } from "react";
import { useEffect, useRef, useState } from "react";

import BrandMark from "@/components/shared/brand-mark";
import type { CarouselApi } from "@/components/ui/carousel";

gsap.registerPlugin(ScrollTrigger);

const INITIAL_PROGRESS = 20;
const MAX_PROGRESS = 100;

interface AnimatedScrollProps {
  api?: CarouselApi;
}

export default function AnimatedScroll({
  api,
}: AnimatedScrollProps): JSX.Element {
  const containerRef = useRef<HTMLDivElement>(null);
  const progressRef = useRef(0);

  const [progress, setProgress] = useState(0);
  const [entranceComplete, setEntranceComplete] = useState(false);

  useGSAP(
    () => {
      const container = containerRef.current;

      if (!container) {
        return;
      }

      const progress = {
        value: 0,
      };

      gsap.to(progress, {
        value: INITIAL_PROGRESS,
        duration: 1,
        ease: "materialEase",
        onUpdate: () => {
          progressRef.current = progress.value;
          setProgress(progress.value);
        },
        onComplete: () => {
          progressRef.current = INITIAL_PROGRESS;
          setProgress(INITIAL_PROGRESS);
          setEntranceComplete(true);
        },
        scrollTrigger: {
          trigger: container,
          start: "top 90%",
          once: true,
        },
      });
    },
    {
      scope: containerRef,
    },
  );

  useEffect(() => {
    if (!api || !entranceComplete) {
      return;
    }

    const updateProgress = (): void => {
      const carouselProgress = api.scrollProgress();

      const nextProgress =
        INITIAL_PROGRESS + carouselProgress * (MAX_PROGRESS - INITIAL_PROGRESS);

      progressRef.current = nextProgress;
      setProgress(nextProgress);
    };

    updateProgress();

    api.on("scroll", updateProgress);

    return (): void => {
      api.off("scroll", updateProgress);
    };
  }, [api, entranceComplete]);

  return (
    <div ref={containerRef}>
      <BrandMark
        variant="line-horizontal"
        className="solutions__brand-mark"
        height={1200}
        accentPercent={progress}
      />
    </div>
  );
}
