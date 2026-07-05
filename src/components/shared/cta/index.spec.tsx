import { render, screen } from "@testing-library/react";
import type { JSX } from "react";
import { describe, expect, test, vi } from "vitest";

import Cta from ".";

vi.mock("@/components/shared/cta-dialog", () => ({
  default: ({
    ctaButtonVariant,
  }: {
    ctaButtonVariant: string;
  }): JSX.Element => <div data-testid="cta-dialog">{ctaButtonVariant}</div>,
}));

describe("Cta", () => {
  describe("rendering", () => {
    test("renders the call-to-action section", () => {
      render(<Cta />);

      const section = screen.getByRole("region", {
        name: /let's find the right solution for your business/i,
      });

      expect(section).toBeInTheDocument();
    });

    test("renders the heading", () => {
      render(<Cta />);

      expect(
        screen.getByRole("heading", {
          level: 2,
          name: /let's find the right solution for your business/i,
        }),
      ).toBeInTheDocument();
    });

    test("renders the description", () => {
      render(<Cta />);

      expect(
        screen.getByText(
          /custom website development, web applications, and business systems/i,
        ),
      ).toBeInTheDocument();
    });
  });

  describe("cta dialog", () => {
    test("renders the cta dialog", () => {
      render(<Cta />);

      expect(screen.getByTestId("cta-dialog")).toBeInTheDocument();
    });

    test("passes the accent variant to the cta dialog", () => {
      render(<Cta />);

      expect(screen.getByTestId("cta-dialog")).toHaveTextContent("accent");
    });
  });

  describe("accessibility", () => {
    test("associates the section with its heading", () => {
      render(<Cta />);

      const section = screen.getByRole("region", {
        name: /let's find the right solution for your business/i,
      });

      const heading = screen.getByRole("heading", {
        level: 2,
        name: /let's find the right solution for your business/i,
      });

      expect(section).toHaveAttribute("aria-labelledby", heading.id);
    });
  });
});
