import { render } from "@testing-library/react";
import * as React from "react";
import { beforeEach, describe, expect, test, vi } from "vitest";

import AnimatedBrandMark from ".";

const { gsapFromTo } = vi.hoisted(() => ({
  gsapFromTo: vi.fn(),
}));

vi.mock("@gsap/react", () => ({
  useGSAP: (callback: () => void): void => {
    React.useLayoutEffect(() => {
      callback();
    }, [callback]);
  },
}));

vi.mock("gsap", () => ({
  default: {
    fromTo: gsapFromTo,
  },
}));

describe("AnimatedBrandMark", () => {
  beforeEach(() => {
    gsapFromTo.mockClear();
  });

  describe("rendering", () => {
    test("renders a BrandMark", () => {
      const { container } = render(<AnimatedBrandMark />);

      expect(container.querySelector("svg")).toBeInTheDocument();
    });

    test("forwards BrandMark props", () => {
      const { container } = render(
        <AnimatedBrandMark
          variant="circle"
          height={120}
          thickness={12}
          accentPercent={25}
          className="custom-class"
        />,
      );

      const svg = container.querySelector("svg");

      expect(svg).toHaveAttribute("width", "120");
      expect(svg).toHaveAttribute("height", "120");
      expect(svg).toHaveClass("custom-class");
    });
  });

  describe("animation", () => {
    test("animates the accent of a vertical line when it enters the viewport", () => {
      render(
        <AnimatedBrandMark
          variant="line-vertical"
          height={200}
          thickness={4}
          accentPercent={25}
          duration={1.5}
        />,
      );

      const accent = document.querySelector(".animated-brand-mark-accent");

      expect(gsapFromTo).toHaveBeenCalledTimes(1);
      expect(gsapFromTo).toHaveBeenCalledWith(
        accent,
        {
          height: 0,
        },
        {
          height: 50,
          duration: 1.5,
          ease: "materialEase",
          scrollTrigger: {
            trigger: expect.any(SVGSVGElement),
            start: "top 90%",
            once: true,
          },
        },
      );
    });

    test("animates the accent of a horizontal line when it enters the viewport", () => {
      render(
        <AnimatedBrandMark
          variant="line-horizontal"
          height={200}
          thickness={4}
          accentPercent={25}
          duration={1.5}
        />,
      );

      const accent = document.querySelector(".animated-brand-mark-accent");

      expect(gsapFromTo).toHaveBeenCalledTimes(1);
      expect(gsapFromTo).toHaveBeenCalledWith(
        accent,
        {
          width: 0,
        },
        {
          width: 50,
          duration: 1.5,
          ease: "materialEase",
          scrollTrigger: {
            trigger: expect.any(SVGSVGElement),
            start: "top 90%",
            once: true,
          },
        },
      );
    });

    test("animates the accent of a circle when it enters the viewport", () => {
      render(
        <AnimatedBrandMark
          variant="circle"
          height={100}
          thickness={24}
          accentPercent={40}
          duration={1}
        />,
      );

      const size = 100;
      const strokeWidth = 24;
      const radius = (size - strokeWidth) / 2;
      const circumference = 2 * Math.PI * radius;
      const accentLength = circumference * 0.4;

      const accent = document.querySelector(".animated-brand-mark-accent");

      expect(gsapFromTo).toHaveBeenCalledTimes(1);
      expect(gsapFromTo).toHaveBeenCalledWith(
        accent,
        {
          strokeDasharray: `0 ${circumference}`,
        },
        {
          strokeDasharray: `${accentLength} ${circumference - accentLength}`,
          duration: 1,
          ease: "materialEase",
          scrollTrigger: {
            trigger: expect.any(SVGSVGElement),
            start: "top 90%",
            once: true,
          },
        },
      );
    });

    test("uses the configured accent class as the animation target", () => {
      const { container } = render(
        <AnimatedBrandMark
          variant="circle"
          accentClassName="hero-brand-accent"
        />,
      );

      const accent = container.querySelector(".hero-brand-accent");

      expect(accent).toBeInTheDocument();
      expect(gsapFromTo).toHaveBeenCalledWith(
        accent,
        expect.anything(),
        expect.objectContaining({
          scrollTrigger: expect.any(Object),
        }),
      );
    });

    test("uses the default vertical variant", () => {
      render(<AnimatedBrandMark height={200} accentPercent={25} />);

      expect(gsapFromTo).toHaveBeenCalledTimes(1);
      expect(gsapFromTo).toHaveBeenCalledWith(
        expect.anything(),
        {
          height: 0,
        },
        expect.objectContaining({
          height: 50,
          scrollTrigger: {
            trigger: expect.any(SVGSVGElement),
            start: "top 90%",
            once: true,
          },
        }),
      );
    });
  });
});
