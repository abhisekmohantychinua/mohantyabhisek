import { render, screen, within } from "@testing-library/react";
import type { JSX } from "react";
import { describe, expect, test, vi } from "vitest";

import Footer from "./index";

vi.mock("next/image", () => ({
  default: ({
    alt,
    src,
    ...props
  }: React.ImgHTMLAttributes<HTMLImageElement>): JSX.Element => (
    // eslint-disable-next-line @next/next/no-img-element
    <img alt={alt} src={src} {...props} />
  ),
}));

vi.mock("next/link", () => ({
  default: ({
    href,
    children,
    ...props
  }: React.AnchorHTMLAttributes<HTMLAnchorElement> & {
    href: string;
  }): JSX.Element => (
    <a href={href} {...props}>
      {children}
    </a>
  ),
}));

describe("Footer", () => {
  test("renders footer element", (): void => {
    render(<Footer />);

    expect(screen.getByRole("contentinfo")).toBeInTheDocument();
  });

  test("renders company logo link", (): void => {
    render(<Footer />);

    const logoLink = screen.getByRole("link", {
      name: /abhisek home/i,
    });

    expect(logoLink).toHaveAttribute("href", "/");
  });

  test("renders company logo image", (): void => {
    render(<Footer />);

    const logo = screen.getByAltText(/company logo/i);

    expect(logo).toBeInTheDocument();
    expect(logo).toHaveAttribute("src", "/logo.png");
  });

  test("renders tagline", (): void => {
    render(<Footer />);

    expect(
      screen.getByText(/building digital systems with/i),
    ).toBeInTheDocument();

    expect(screen.getByText(/clarity and purpose/i)).toBeInTheDocument();
  });

  test("renders footer navigation", (): void => {
    render(<Footer />);

    const navigation = screen.getByRole("navigation", {
      name: /footer navigation/i,
    });

    expect(
      within(navigation).getByRole("link", { name: "Home" }),
    ).toHaveAttribute("href", "/");

    expect(
      within(navigation).getByRole("link", { name: "Work" }),
    ).toHaveAttribute("href", "/works");

    expect(
      within(navigation).getByRole("link", { name: "Contact" }),
    ).toHaveAttribute("href", "/contact");

    expect(
      within(navigation).getByRole("link", { name: "Blogs" }),
    ).toHaveAttribute("href", "/blogs");
  });

  test("renders copyright text", (): void => {
    render(<Footer />);

    expect(
      screen.getByText(/© 2026 abhisek\. all rights reserved\./i),
    ).toBeInTheDocument();
  });

  test("renders linkedin link", (): void => {
    render(<Footer />);

    expect(screen.getByRole("link", { name: /linkedin/i })).toHaveAttribute(
      "href",
      "https://www.linkedin.com/in/mohanty-abhisek",
    );
  });

  test("renders instagram link", (): void => {
    render(<Footer />);

    expect(screen.getByRole("link", { name: /instagram/i })).toHaveAttribute(
      "href",
      "https://www.instagram.com/abhisek.mohanty/",
    );
  });

  test("renders email link", (): void => {
    render(<Footer />);

    expect(screen.getByRole("link", { name: /email/i })).toHaveAttribute(
      "href",
      "mailto:mohantyabhisek@hotmail.com",
    );
  });

  test("renders phone link", (): void => {
    render(<Footer />);

    expect(screen.getByRole("link", { name: /phone/i })).toHaveAttribute(
      "href",
      "tel:+919439485166",
    );
  });

  test("renders social links container", (): void => {
    render(<Footer />);

    expect(screen.getByLabelText(/social links/i)).toBeInTheDocument();
  });
});
