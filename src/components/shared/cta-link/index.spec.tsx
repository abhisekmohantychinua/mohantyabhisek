import { render, screen } from "@testing-library/react";
import type { JSX } from "react";
import { describe, expect, test, vi } from "vitest";

import { CtaLink } from ".";

vi.mock("next/link", () => ({
  default: ({
    children,
    href,
    className,
    ...props
  }: React.AnchorHTMLAttributes<HTMLAnchorElement> & {
    href: string;
  }): JSX.Element => (
    <a href={href} className={className} data-testid="link" {...props}>
      {children}
    </a>
  ),
}));

vi.mock("lucide-react", () => ({
  ArrowUpRight: (): JSX.Element => <svg data-testid="arrow-up-right" />,
}));

describe("CtaLink", () => {
  describe("rendering", () => {
    test("renders its children", (): void => {
      render(<CtaLink href="/contact">Contact Me</CtaLink>);

      expect(screen.getByText("Contact Me")).toBeInTheDocument();
    });

    test("renders a link", (): void => {
      render(<CtaLink href="/contact">Contact Me</CtaLink>);

      expect(screen.getByTestId("link")).toBeInTheDocument();
    });

    test("renders the arrow icon", (): void => {
      render(<CtaLink href="/contact">Contact Me</CtaLink>);

      expect(screen.getByTestId("arrow-up-right")).toBeInTheDocument();
    });

    test("renders the icon wrapper", (): void => {
      render(<CtaLink href="/contact">Contact Me</CtaLink>);

      const icon = screen.getByTestId("arrow-up-right");

      expect(icon.parentElement).toHaveAttribute("aria-hidden", "true");
    });
  });

  describe("link props", () => {
    test("forwards href", (): void => {
      render(<CtaLink href="/contact">Contact Me</CtaLink>);

      expect(screen.getByTestId("link")).toHaveAttribute("href", "/contact");
    });

    test("forwards additional props", (): void => {
      render(
        <CtaLink href="/contact" target="_blank">
          Contact Me
        </CtaLink>,
      );

      expect(screen.getByTestId("link")).toHaveAttribute("target", "_blank");
    });

    test("merges custom class names", (): void => {
      render(
        <CtaLink href="/contact" className="custom-class">
          Contact Me
        </CtaLink>,
      );

      expect(screen.getByTestId("link").className).toContain("custom-class");
    });
  });
});
