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

      expect(rects[0]).toHaveAttribute("x", "0");
      expect(rects[0]).toHaveAttribute("y", "0");
      expect(rects[0]).toHaveAttribute("width", "1");
      expect(rects[0]).toHaveAttribute("height", "150");
      expect(rects[0]).toHaveAttribute("fill", "var(--color-primary)");

      expect(rects[1]).toHaveAttribute("x", "0");
      expect(rects[1]).toHaveAttribute("y", "0");
      expect(rects[1]).toHaveAttribute("width", "1");
      expect(rects[1]).toHaveAttribute("height", "75");
      expect(rects[1]).toHaveAttribute("fill", "var(--color-accent)");
    });

    test("renders a horizontal line", () => {
      const { container } = render(<BrandMark variant="line-horizontal" />);

      const svg = container.querySelector("svg");
      const rects = container.querySelectorAll("rect");

      expect(svg).toHaveAttribute("width", "150");
      expect(svg).toHaveAttribute("height", "1");
      expect(rects).toHaveLength(2);

      expect(rects[0]).toHaveAttribute("x", "0");
      expect(rects[0]).toHaveAttribute("y", "0");
      expect(rects[0]).toHaveAttribute("width", "150");
      expect(rects[0]).toHaveAttribute("height", "1");
      expect(rects[0]).toHaveAttribute("fill", "var(--color-primary)");

      expect(rects[1]).toHaveAttribute("x", "0");
      expect(rects[1]).toHaveAttribute("y", "0");
      expect(rects[1]).toHaveAttribute("width", "75");
      expect(rects[1]).toHaveAttribute("height", "1");
      expect(rects[1]).toHaveAttribute("fill", "var(--color-accent)");
    });

    test("renders a circle", () => {
      const { container } = render(<BrandMark variant="circle" />);

      const svg = container.querySelector("svg");
      const circles = container.querySelectorAll("circle");

      expect(svg).toHaveAttribute("width", "100");
      expect(svg).toHaveAttribute("height", "100");
      expect(circles).toHaveLength(2);

      expect(circles[0]).toHaveAttribute("stroke", "var(--color-primary)");
      expect(circles[1]).toHaveAttribute("stroke", "var(--color-accent)");
    });
  });

  describe("animation targets", () => {
    test("applies primary and accent classes to vertical line layers", () => {
      const { container } = render(
        <BrandMark
          primaryClassName="brand-primary"
          accentClassName="brand-accent"
        />,
      );

      const primary = container.querySelector(".brand-primary");
      const accent = container.querySelector(".brand-accent");

      expect(primary).toBeInTheDocument();
      expect(accent).toBeInTheDocument();

      expect(primary).toHaveAttribute("x", "0");
      expect(primary).toHaveAttribute("y", "0");
      expect(primary).toHaveAttribute("height", "150");

      expect(accent).toHaveAttribute("x", "0");
      expect(accent).toHaveAttribute("y", "0");
      expect(accent).toHaveAttribute("height", "75");
    });

    test("applies primary and accent classes to horizontal line layers", () => {
      const { container } = render(
        <BrandMark
          variant="line-horizontal"
          primaryClassName="brand-primary"
          accentClassName="brand-accent"
        />,
      );

      const primary = container.querySelector(".brand-primary");
      const accent = container.querySelector(".brand-accent");

      expect(primary).toBeInTheDocument();
      expect(accent).toBeInTheDocument();

      expect(primary).toHaveAttribute("x", "0");
      expect(primary).toHaveAttribute("y", "0");
      expect(primary).toHaveAttribute("width", "150");

      expect(accent).toHaveAttribute("x", "0");
      expect(accent).toHaveAttribute("y", "0");
      expect(accent).toHaveAttribute("width", "75");
    });

    test("applies primary and accent classes to circle layers", () => {
      const { container } = render(
        <BrandMark
          variant="circle"
          primaryClassName="brand-primary"
          accentClassName="brand-accent"
        />,
      );

      const primary = container.querySelector(".brand-primary");
      const accent = container.querySelector(".brand-accent");

      expect(primary).toBeInTheDocument();
      expect(accent).toBeInTheDocument();

      expect(primary).toHaveAttribute("stroke", "var(--color-primary)");
      expect(accent).toHaveAttribute("stroke", "var(--color-accent)");
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

      expect(rects[0]).toHaveAttribute("width", "4");
      expect(rects[0]).toHaveAttribute("height", "200");

      expect(rects[1]).toHaveAttribute("width", "4");
      expect(rects[1]).toHaveAttribute("height", "50");
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

      expect(rects[0]).toHaveAttribute("width", "200");
      expect(rects[0]).toHaveAttribute("height", "4");

      expect(rects[1]).toHaveAttribute("width", "50");
      expect(rects[1]).toHaveAttribute("height", "4");
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

      expect(circles[1]).toHaveAttribute(
        "stroke-dasharray",
        expect.stringContaining(""),
      );
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
