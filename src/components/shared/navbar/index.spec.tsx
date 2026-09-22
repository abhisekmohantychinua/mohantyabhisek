import { act, fireEvent, render, screen, within } from "@testing-library/react";
import type { JSX } from "react";
import { beforeEach, describe, expect, test, vi } from "vitest";

import Navbar from "./index";

const { usePathnameMock } = vi.hoisted(() => ({
  usePathnameMock: vi.fn(),
}));

vi.mock("next/navigation", () => ({
  usePathname: usePathnameMock,
}));

vi.mock("next/image", () => ({
  default: ({
    alt,
    src,
    width,
    height,
    className,
  }: {
    alt: string;
    src: string;
    width?: number;
    height?: number;
    className?: string;
  }): JSX.Element => (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      alt={alt}
      src={src}
      width={width}
      height={height}
      className={className}
    />
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

vi.mock("../cta-link", () => ({
  CtaLink: ({
    children,
    href,
    ...props
  }: React.AnchorHTMLAttributes<HTMLAnchorElement> & {
    href: string;
  }): JSX.Element => (
    <a href={href} data-testid="cta-link" {...props}>
      {children}
    </a>
  ),
}));

const setScrollY = (value: number): void => {
  Object.defineProperty(window, "scrollY", {
    writable: true,
    configurable: true,
    value,
  });

  window.dispatchEvent(new Event("scroll"));
};

describe("Navbar", () => {
  beforeEach((): void => {
    vi.clearAllMocks();

    usePathnameMock.mockReturnValue("/");

    document.body.style.overflow = "";

    Object.defineProperty(window, "scrollY", {
      writable: true,
      configurable: true,
      value: 0,
    });
  });

  describe("rendering", () => {
    test("renders the navigation landmark", (): void => {
      render(<Navbar />);

      expect(
        screen.getByRole("navigation", {
          name: /primary navigation/i,
        }),
      ).toBeInTheDocument();
    });

    test("renders the logo link", (): void => {
      render(<Navbar />);

      expect(
        screen.getByRole("link", {
          name: /go to homepage/i,
        }),
      ).toHaveAttribute("href", "/");
    });

    test("renders the logo image", (): void => {
      render(<Navbar />);

      expect(
        screen.getByRole("img", {
          name: /company logo/i,
        }),
      ).toBeInTheDocument();
    });

    test("renders all desktop navigation links", (): void => {
      render(<Navbar />);

      const navigation = screen.getByRole("navigation", {
        name: /primary navigation/i,
      });

      expect(
        within(navigation).getByRole("link", {
          name: /^home$/i,
        }),
      ).toHaveAttribute("href", "/");

      expect(
        within(navigation).getByRole("link", {
          name: /^work$/i,
        }),
      ).toHaveAttribute("href", "/works");

      expect(
        within(navigation).getByRole("link", {
          name: /^contact$/i,
        }),
      ).toHaveAttribute("href", "/contact");

      expect(
        within(navigation).getByRole("link", {
          name: /^blogs$/i,
        }),
      ).toHaveAttribute("href", "/blogs");
    });

    test("renders call me cta link", (): void => {
      render(<Navbar />);

      const callLinks = screen.getAllByRole("link", {
        name: /call me/i,
      });

      expect(callLinks).toHaveLength(1);
      expect(callLinks[0]).toHaveAttribute("href", "tel:+919439485166");
    });

    test("renders mobile menu toggle button", (): void => {
      render(<Navbar />);

      expect(
        screen.getByRole("button", {
          name: /open navigation menu/i,
        }),
      ).toBeInTheDocument();
    });
  });

  describe("active navigation", () => {
    test("marks home as active on home route", (): void => {
      usePathnameMock.mockReturnValue("/");

      render(<Navbar />);

      const navigation = screen.getByRole("navigation", {
        name: /primary navigation/i,
      });

      const homeLink = within(navigation).getByRole("link", {
        name: /^home$/i,
      });

      expect(homeLink).toHaveClass("navbar-nav-link-active");
      expect(homeLink).toHaveAttribute("aria-current", "page");
    });

    test("marks work as active on work route", (): void => {
      usePathnameMock.mockReturnValue("/works");

      render(<Navbar />);

      const navigation = screen.getByRole("navigation", {
        name: /primary navigation/i,
      });

      const workLink = within(navigation).getByRole("link", {
        name: /^work$/i,
      });

      expect(workLink).toHaveClass("navbar-nav-link-active");
      expect(workLink).toHaveAttribute("aria-current", "page");
    });

    test("marks contact as active on contact route", (): void => {
      usePathnameMock.mockReturnValue("/contact");

      render(<Navbar />);

      const navigation = screen.getByRole("navigation", {
        name: /primary navigation/i,
      });

      const contactLink = within(navigation).getByRole("link", {
        name: /^contact$/i,
      });

      expect(contactLink).toHaveClass("navbar-nav-link-active");
      expect(contactLink).toHaveAttribute("aria-current", "page");
    });

    test("marks blogs as active on blog route", (): void => {
      usePathnameMock.mockReturnValue("/blogs/my-post");

      render(<Navbar />);

      const navigation = screen.getByRole("navigation", {
        name: /primary navigation/i,
      });

      const blogsLink = within(navigation).getByRole("link", {
        name: /^blogs$/i,
      });

      expect(blogsLink).toHaveClass("navbar-nav-link-active");
      expect(blogsLink).toHaveAttribute("aria-current", "page");
    });

    test("does not mark unrelated links as active", (): void => {
      usePathnameMock.mockReturnValue("/works");

      render(<Navbar />);

      const navigation = screen.getByRole("navigation", {
        name: /primary navigation/i,
      });

      const homeLink = within(navigation).getByRole("link", {
        name: /^home$/i,
      });

      const contactLink = within(navigation).getByRole("link", {
        name: /^contact$/i,
      });

      const blogsLink = within(navigation).getByRole("link", {
        name: /^blogs$/i,
      });

      expect(homeLink).not.toHaveClass("navbar-nav-link-active");
      expect(contactLink).not.toHaveClass("navbar-nav-link-active");
      expect(blogsLink).not.toHaveClass("navbar-nav-link-active");

      expect(homeLink).not.toHaveAttribute("aria-current");
      expect(contactLink).not.toHaveAttribute("aria-current");
      expect(blogsLink).not.toHaveAttribute("aria-current");
    });
  });

  describe("mobile menu", () => {
    test("is closed by default", (): void => {
      render(<Navbar />);

      const mobileMenu = document.getElementById("mobile-menu");

      expect(mobileMenu).toBeInTheDocument();
      expect(mobileMenu).toHaveAttribute("aria-hidden", "true");
      expect(mobileMenu).toHaveAttribute("inert");
      expect(mobileMenu).not.toHaveClass("navbar-mobile-menu-open");
    });

    test("opens when toggle button is clicked", (): void => {
      render(<Navbar />);

      const toggleButton = screen.getByRole("button", {
        name: /open navigation menu/i,
      });

      fireEvent.click(toggleButton);

      const mobileMenu = document.getElementById("mobile-menu");

      expect(toggleButton).toHaveAttribute("aria-expanded", "true");
      expect(toggleButton).toHaveAccessibleName("Close navigation menu");

      expect(mobileMenu).toHaveAttribute("aria-hidden", "false");
      expect(mobileMenu).not.toHaveAttribute("inert");
      expect(mobileMenu).toHaveClass("navbar-mobile-menu-open");
    });

    test("closes when toggle button is clicked again", (): void => {
      render(<Navbar />);

      const toggleButton = screen.getByRole("button", {
        name: /open navigation menu/i,
      });

      fireEvent.click(toggleButton);

      const closeButton = screen.getByRole("button", {
        name: /close navigation menu/i,
      });

      fireEvent.click(closeButton);

      const mobileMenu = document.getElementById("mobile-menu");

      expect(toggleButton).toHaveAttribute("aria-expanded", "false");
      expect(
        screen.getByRole("button", {
          name: /open navigation menu/i,
        }),
      ).toBeInTheDocument();

      expect(mobileMenu).toHaveAttribute("aria-hidden", "true");
      expect(mobileMenu).toHaveAttribute("inert");
      expect(mobileMenu).not.toHaveClass("navbar-mobile-menu-open");
    });

    test("renders mobile navigation links", (): void => {
      render(<Navbar />);

      const toggleButton = screen.getByRole("button", {
        name: /open navigation menu/i,
      });

      fireEvent.click(toggleButton);

      const mobileMenu = document.getElementById("mobile-menu");

      expect(mobileMenu).toBeInTheDocument();

      const mobileNavigation = within(mobileMenu as HTMLElement).getByRole(
        "navigation",
        {
          name: /mobile navigation/i,
          hidden: true,
        },
      );

      expect(
        within(mobileNavigation).getByRole("link", {
          name: /^home$/i,
          hidden: true,
        }),
      ).toBeInTheDocument();

      expect(
        within(mobileNavigation).getByRole("link", {
          name: /^work$/i,
          hidden: true,
        }),
      ).toBeInTheDocument();

      expect(
        within(mobileNavigation).getByRole("link", {
          name: /^contact$/i,
          hidden: true,
        }),
      ).toBeInTheDocument();

      expect(
        within(mobileNavigation).getByRole("link", {
          name: /^blogs$/i,
          hidden: true,
        }),
      ).toBeInTheDocument();
    });

    test("closes when overlay is clicked", (): void => {
      render(<Navbar />);

      fireEvent.click(
        screen.getByRole("button", {
          name: /open navigation menu/i,
        }),
      );

      const overlay = document.querySelector(
        ".navbar-mobile-overlay",
      ) as HTMLElement;

      expect(overlay).toBeInTheDocument();
      expect(overlay).toHaveClass("navbar-mobile-overlay-open");

      fireEvent.click(overlay);

      const mobileMenu = document.getElementById("mobile-menu");

      expect(mobileMenu).toHaveAttribute("aria-hidden", "true");
      expect(mobileMenu).toHaveAttribute("inert");
      expect(mobileMenu).not.toHaveClass("navbar-mobile-menu-open");
    });

    test("closes when a mobile navigation link is clicked", (): void => {
      render(<Navbar />);

      fireEvent.click(
        screen.getByRole("button", {
          name: /open navigation menu/i,
        }),
      );

      const mobileMenu = document.getElementById("mobile-menu");

      const mobileNavigation = within(mobileMenu as HTMLElement).getByRole(
        "navigation",
        {
          name: /mobile navigation/i,
          hidden: true,
        },
      );

      const homeLink = within(mobileNavigation).getByRole("link", {
        name: /^home$/i,
        hidden: true,
      });

      fireEvent.click(homeLink);

      expect(mobileMenu).toHaveAttribute("aria-hidden", "true");
      expect(mobileMenu).toHaveAttribute("inert");
      expect(mobileMenu).not.toHaveClass("navbar-mobile-menu-open");
    });
  });

  describe("body scroll locking", () => {
    test("locks body scroll when mobile menu opens", (): void => {
      render(<Navbar />);

      fireEvent.click(
        screen.getByRole("button", {
          name: /open navigation menu/i,
        }),
      );

      expect(document.body.style.overflow).toBe("hidden");
    });

    test("restores body scroll when mobile menu closes", (): void => {
      render(<Navbar />);

      const toggleButton = screen.getByRole("button", {
        name: /open navigation menu/i,
      });

      fireEvent.click(toggleButton);

      expect(document.body.style.overflow).toBe("hidden");

      fireEvent.click(
        screen.getByRole("button", {
          name: /close navigation menu/i,
        }),
      );

      expect(document.body.style.overflow).toBe("");
    });
  });

  describe("keyboard interaction", () => {
    test("closes mobile menu when Escape is pressed", (): void => {
      render(<Navbar />);

      const toggleButton = screen.getByRole("button", {
        name: /open navigation menu/i,
      });

      fireEvent.click(toggleButton);

      expect(
        screen.getByRole("button", {
          name: /close navigation menu/i,
        }),
      ).toBeInTheDocument();

      fireEvent.keyDown(document, {
        key: "Escape",
      });

      expect(
        screen.getByRole("button", {
          name: /open navigation menu/i,
        }),
      ).toBeInTheDocument();

      expect(
        screen.getByRole("button", {
          name: /open navigation menu/i,
        }),
      ).toHaveFocus();

      expect(document.body.style.overflow).toBe("");
    });

    test("does not close mobile menu for other keys", (): void => {
      render(<Navbar />);

      fireEvent.click(
        screen.getByRole("button", {
          name: /open navigation menu/i,
        }),
      );

      fireEvent.keyDown(document, {
        key: "Enter",
      });

      expect(
        screen.getByRole("button", {
          name: /close navigation menu/i,
        }),
      ).toBeInTheDocument();

      expect(document.body.style.overflow).toBe("hidden");
    });
  });

  describe("scroll behavior", () => {
    test("adds scrolled class after scrolling past threshold", (): void => {
      render(<Navbar />);

      const nav = screen.getByRole("navigation", {
        name: /primary navigation/i,
      });

      act(() => {
        setScrollY(60);
      });

      expect(nav).toHaveClass("navbar-scrolled");
    });

    test("removes scrolled class when above threshold", (): void => {
      render(<Navbar />);

      const nav = screen.getByRole("navigation", {
        name: /primary navigation/i,
      });

      act(() => {
        setScrollY(60);
      });

      expect(nav).toHaveClass("navbar-scrolled");

      act(() => {
        setScrollY(10);
      });

      expect(nav).not.toHaveClass("navbar-scrolled");
    });

    test("hides navbar when scrolling down", (): void => {
      render(<Navbar />);

      const nav = screen.getByRole("navigation", {
        name: /primary navigation/i,
      });

      act(() => {
        setScrollY(120);
      });

      expect(nav).toHaveClass("navbar-hidden");
      expect(nav).not.toHaveClass("navbar-visible");
    });

    test("shows navbar when scrolling up", (): void => {
      render(<Navbar />);

      const nav = screen.getByRole("navigation", {
        name: /primary navigation/i,
      });

      act(() => {
        setScrollY(200);
      });

      expect(nav).toHaveClass("navbar-hidden");

      act(() => {
        setScrollY(100);
      });

      expect(nav).toHaveClass("navbar-visible");
      expect(nav).not.toHaveClass("navbar-hidden");
    });
  });

  describe("accessibility", () => {
    test("has primary navigation label", (): void => {
      render(<Navbar />);

      expect(
        screen.getByRole("navigation", {
          name: /primary navigation/i,
        }),
      ).toBeInTheDocument();
    });

    test("has mobile navigation label", (): void => {
      render(<Navbar />);

      const mobileMenu = document.getElementById("mobile-menu");

      expect(
        within(mobileMenu as HTMLElement).getByRole("navigation", {
          name: /mobile navigation/i,
          hidden: true,
        }),
      ).toBeInTheDocument();
    });

    test("updates aria-expanded on mobile toggle", (): void => {
      render(<Navbar />);

      const toggleButton = screen.getByRole("button", {
        name: /open navigation menu/i,
      });

      expect(toggleButton).toHaveAttribute("aria-expanded", "false");

      fireEvent.click(toggleButton);

      expect(toggleButton).toHaveAttribute("aria-expanded", "true");
    });

    test("updates aria-hidden and inert on mobile menu", (): void => {
      render(<Navbar />);

      const mobileMenu = document.getElementById("mobile-menu");

      expect(mobileMenu).toHaveAttribute("aria-hidden", "true");
      expect(mobileMenu).toHaveAttribute("inert");

      fireEvent.click(
        screen.getByRole("button", {
          name: /open navigation menu/i,
        }),
      );

      expect(mobileMenu).toHaveAttribute("aria-hidden", "false");
      expect(mobileMenu).not.toHaveAttribute("inert");

      fireEvent.click(
        screen.getByRole("button", {
          name: /close navigation menu/i,
        }),
      );

      expect(mobileMenu).toHaveAttribute("aria-hidden", "true");
      expect(mobileMenu).toHaveAttribute("inert");
    });

    test("does not use menuitem or menubar roles", (): void => {
      render(<Navbar />);

      expect(
        screen.queryByRole("menuitem", {
          hidden: true,
        }),
      ).not.toBeInTheDocument();

      expect(
        screen.queryByRole("menubar", {
          hidden: true,
        }),
      ).not.toBeInTheDocument();
    });
  });
});
