import { render, screen } from "@testing-library/react";
import type { JSX } from "react";
import { describe, expect, test, vi } from "vitest";

import { CtaButton } from ".";

vi.mock("@/components/ui/button", () => ({
  Button: ({
    children,
    className,
    variant,
    size,
    ...props
  }: React.ComponentProps<"button"> & {
    variant?: string;
    size?: string;
  }): JSX.Element => (
    <button
      data-testid="button"
      data-variant={variant}
      data-size={size}
      className={className}
      {...props}
    >
      {children}
    </button>
  ),
}));

describe("CtaButton", () => {
  describe("rendering", () => {
    test("renders its children", () => {
      render(<CtaButton>Contact Me</CtaButton>);

      expect(screen.getByText("Contact Me")).toBeInTheDocument();
    });

    test("renders the button", () => {
      render(<CtaButton>Contact Me</CtaButton>);

      expect(screen.getByTestId("button")).toBeInTheDocument();
    });

    test("renders the arrow icon container", () => {
      render(<CtaButton>Contact Me</CtaButton>);

      expect(
        screen.getByText("Contact Me").nextElementSibling,
      ).toBeInTheDocument();
    });
  });
  describe("button props", () => {
    test("uses ghost variant", () => {
      render(<CtaButton>Contact Me</CtaButton>);

      expect(screen.getByTestId("button")).toHaveAttribute(
        "data-variant",
        "ghost",
      );
    });

    test("uses large size", () => {
      render(<CtaButton>Contact Me</CtaButton>);

      expect(screen.getByTestId("button")).toHaveAttribute("data-size", "lg");
    });

    test("forwards additional props", () => {
      render(<CtaButton disabled>Contact Me</CtaButton>);

      expect(screen.getByTestId("button")).toBeDisabled();
    });
  });
  describe("variants", () => {
    test("uses default variant when not provided", () => {
      render(<CtaButton>Contact Me</CtaButton>);

      expect(screen.getByTestId("button").className).toContain(
        "border-foreground",
      );
    });

    test("uses accent variant styles", () => {
      render(<CtaButton ctaVariant="accent">Contact Me</CtaButton>);

      expect(screen.getByTestId("button").className).toContain("border-accent");
    });

    test("merges custom class names", () => {
      render(<CtaButton className="custom-class">Contact Me</CtaButton>);

      expect(screen.getByTestId("button").className).toContain("custom-class");
    });
  });
});
