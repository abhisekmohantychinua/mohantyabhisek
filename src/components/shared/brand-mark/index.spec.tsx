import { render } from "@testing-library/react";
import { describe, expect, test } from "vitest";

import BrandMark from ".";

describe("BrandMark", () => {
  describe("rendering", () => {
    test("renders a vertical line by default", () => {
      const { container } = render(<BrandMark />);

      const svg = container.querySelector("svg");
      const rects = container.querySelectorAll("rect");

      expect(svg).toHaveAttribute("width", "1");
      expect(svg).toHaveAttribute("height", "150");

      expect(rects).toHaveLength(2);

      expect(rects[0]).toHaveAttribute("height", "75");
      expect(rects[0]).toHaveAttribute("fill", "var(--color-accent)");

      expect(rects[1]).toHaveAttribute("height", "75");
      expect(rects[1]).toHaveAttribute("fill", "var(--color-primary)");
    });

    test("renders a horizontal line", () => {
      const { container } = render(<BrandMark variant="line-horizontal" />);

      const svg = container.querySelector("svg");
      const rects = container.querySelectorAll("rect");

      expect(svg).toHaveAttribute("width", "150");
      expect(svg).toHaveAttribute("height", "1");

      expect(rects).toHaveLength(2);
      expect(rects[0]).toHaveAttribute("width", "75");
      expect(rects[1]).toHaveAttribute("width", "75");
    });

    test("renders a circle", () => {
      const { container } = render(<BrandMark variant="circle" />);

      const svg = container.querySelector("svg");
      const circles = container.querySelectorAll("circle");

      expect(svg).toHaveAttribute("width", "100");
      expect(svg).toHaveAttribute("height", "100");

      expect(circles).toHaveLength(2);
    });
  });

  describe("animation targets", () => {
    test("applies primary and accent classes to vertical line segments", () => {
      const { container } = render(
        <BrandMark
          primaryClassName="brand-primary"
          accentClassName="brand-accent"
        />,
      );

      const rects = container.querySelectorAll("rect");

      expect(rects[0]).toHaveClass("brand-accent");
      expect(rects[1]).toHaveClass("brand-primary");
    });

    test("applies primary and accent classes to horizontal line segments", () => {
      const { container } = render(
        <BrandMark
          variant="line-horizontal"
          primaryClassName="brand-primary"
          accentClassName="brand-accent"
        />,
      );

      const rects = container.querySelectorAll("rect");

      expect(rects[0]).toHaveClass("brand-accent");
      expect(rects[1]).toHaveClass("brand-primary");
    });

    test("applies primary and accent classes to circle segments", () => {
      const { container } = render(
        <BrandMark
          variant="circle"
          primaryClassName="brand-primary"
          accentClassName="brand-accent"
        />,
      );

      const circles = container.querySelectorAll("circle");

      expect(circles[0]).toHaveClass("brand-primary");
      expect(circles[1]).toHaveClass("brand-accent");
    });
  });

  describe("customization", () => {
    test("applies custom dimensions to vertical lines", () => {
      const { container } = render(
        <BrandMark thickness={4} height={200} accentPercent={25} />,
      );

      const svg = container.querySelector("svg");
      const rects = container.querySelectorAll("rect");

      expect(svg).toHaveAttribute("width", "4");
      expect(svg).toHaveAttribute("height", "200");

      expect(rects[0]).toHaveAttribute("height", "50");
      expect(rects[1]).toHaveAttribute("height", "150");
    });

    test("applies custom dimensions to horizontal lines", () => {
      const { container } = render(
        <BrandMark
          variant="line-horizontal"
          thickness={4}
          height={200}
          accentPercent={25}
        />,
      );

      const rects = container.querySelectorAll("rect");

      expect(rects[0]).toHaveAttribute("width", "50");
      expect(rects[1]).toHaveAttribute("width", "150");
    });

    test("applies custom dimensions to circles", () => {
      const { container } = render(
        <BrandMark
          variant="circle"
          height={120}
          thickness={12}
          accentPercent={25}
        />,
      );

      const svg = container.querySelector("svg");
      const circles = container.querySelectorAll("circle");

      expect(svg).toHaveAttribute("width", "120");
      expect(svg).toHaveAttribute("height", "120");

      expect(circles[0]).toHaveAttribute("stroke-width", "12");
      expect(circles[1]).toHaveAttribute("stroke-width", "12");
    });
  });

  describe("ref", () => {
    test("forwards ref to the svg element", () => {
      let svg: SVGSVGElement | null = null;

      render(
        <BrandMark
          ref={(element) => {
            svg = element;
          }}
        />,
      );

      expect(svg).toBeInstanceOf(SVGSVGElement);
    });
  });

  describe("svg attributes", () => {
    test("forwards svg attributes", () => {
      const { container } = render(
        <BrandMark data-testid="brand-mark" role="img" />,
      );

      const svg = container.querySelector("svg");

      expect(svg).toHaveAttribute("data-testid", "brand-mark");
      expect(svg).toHaveAttribute("role", "img");
    });

    test("applies the custom class name to the svg", () => {
      const { container } = render(<BrandMark className="custom-class" />);

      const svg = container.querySelector("svg");

      expect(svg).toHaveClass("custom-class");
      expect(svg).toHaveClass("shrink-0");
    });
  });
});
