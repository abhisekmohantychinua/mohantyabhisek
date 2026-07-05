import { fireEvent, render, screen, within } from "@testing-library/react";
import { act, waitFor } from "@testing-library/react";
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
    document.body.style.overflow = "unset";

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

      expect(
        screen.getByRole("menuitem", {
          name: /^home$/i,
        }),
      ).toHaveAttribute("href", "/");

      expect(
        screen.getByRole("menuitem", {
          name: /^work$/i,
        }),
      ).toHaveAttribute("href", "/works");

      expect(
        screen.getByRole("menuitem", {
          name: /^contact$/i,
        }),
      ).toHaveAttribute("href", "/contact");

      expect(
        screen.getByRole("menuitem", {
          name: /^blogs$/i,
        }),
      ).toHaveAttribute("href", "/blogs");
    });

    test("renders call me cta link", (): void => {
      render(<Navbar />);

      expect(
        screen.getByRole("link", {
          name: /call me/i,
        }),
      ).toHaveAttribute("href", "tel:+919439485166");
      fireEvent.click(
        screen.getByRole("button", {
          name: /toggle navigation menu/i,
        }),
      );

      expect(
        screen.getAllByRole("link", {
          name: /call me/i,
        }),
      ).toHaveLength(2);
    });

    test("renders mobile menu toggle button", (): void => {
      render(<Navbar />);

      expect(
        screen.getByRole("button", {
          name: /toggle navigation menu/i,
        }),
      ).toBeInTheDocument();
    });
  });

  describe("active navigation", () => {
    test("marks home as active on home route", (): void => {
      usePathnameMock.mockReturnValue("/");

      render(<Navbar />);

      const homeLinks = screen.getAllByRole("menuitem", {
        name: /^home$/i,
      });

      for (const link of homeLinks) {
        expect(link).toHaveClass("navbar-nav-link-active", {
          exact: false,
        });
      }
    });

    test("marks work as active on work route", (): void => {
      usePathnameMock.mockReturnValue("/works");

      render(<Navbar />);

      const workLinks = screen.getAllByRole("menuitem", {
        name: /^work$/i,
      });

      for (const link of workLinks) {
        expect(link.className).toContain("active");
      }
    });

    test("marks contact as active on contact route", (): void => {
      usePathnameMock.mockReturnValue("/contact");

      render(<Navbar />);

      const contactLinks = screen.getAllByRole("menuitem", {
        name: /^contact$/i,
      });

      for (const link of contactLinks) {
        expect(link.className).toContain("active");
      }
    });

    test("marks blogs as active on blog route", (): void => {
      usePathnameMock.mockReturnValue("/blogs/my-post");

      render(<Navbar />);

      const blogLinks = screen.getAllByRole("menuitem", {
        name: /^blogs$/i,
      });

      for (const link of blogLinks) {
        expect(link.className).toContain("active");
      }
    });

    test("does not mark unrelated links as active", (): void => {
      usePathnameMock.mockReturnValue("/works");

      render(<Navbar />);

      const homeLinks = screen.getAllByRole("menuitem", {
        name: /^home$/i,
      });

      const contactLinks = screen.getAllByRole("menuitem", {
        name: /^contact$/i,
      });

      const blogLinks = screen.getAllByRole("menuitem", {
        name: /^blogs$/i,
      });

      for (const link of [...homeLinks, ...contactLinks, ...blogLinks]) {
        expect(link.className).not.toContain("active");
      }
    });
  });

  describe("mobile menu", () => {
    test("is closed by default", (): void => {
      usePathnameMock.mockReturnValue("/");

      render(<Navbar />);

      const mobileMenu = screen.getByRole("menu", {
        hidden: true,
      });

      expect(mobileMenu).toHaveAttribute("aria-hidden", "true");
      expect(mobileMenu.className).not.toContain("navbar-mobile-menu-open");
    });

    test("opens when toggle button is clicked", (): void => {
      usePathnameMock.mockReturnValue("/");

      render(<Navbar />);

      const toggleButton = screen.getByRole("button", {
        name: /toggle navigation menu/i,
      });

      fireEvent.click(toggleButton);

      const mobileMenu = screen.getByRole("menu", {
        hidden: true,
      });

      expect(toggleButton).toHaveAttribute("aria-expanded", "true");
      expect(mobileMenu.className).toContain("navbar-mobile-menu-open");
      expect(mobileMenu).toHaveAttribute("aria-hidden", "false");
    });

    test("closes when toggle button is clicked again", (): void => {
      usePathnameMock.mockReturnValue("/");

      render(<Navbar />);

      const toggleButton = screen.getByRole("button", {
        name: /toggle navigation menu/i,
      });

      fireEvent.click(toggleButton);
      fireEvent.click(toggleButton);

      const mobileMenu = screen.getByRole("menu", {
        hidden: true,
      });

      expect(toggleButton).toHaveAttribute("aria-expanded", "false");
      expect(mobileMenu.className).not.toContain("navbar-mobile-menu-open");
      expect(mobileMenu).toHaveAttribute("aria-hidden", "true");
    });

    test("renders mobile navigation links", (): void => {
      usePathnameMock.mockReturnValue("/");

      render(<Navbar />);

      fireEvent.click(
        screen.getByRole("button", {
          name: /toggle navigation menu/i,
        }),
      );

      const mobileMenu = screen.getByRole("menu", {
        hidden: true,
      });

      const mobileNav = within(mobileMenu).getByRole("menubar");

      expect(
        within(mobileNav).getByRole("menuitem", { name: /home/i }),
      ).toBeInTheDocument();
      expect(
        within(mobileNav).getByRole("menuitem", { name: /work/i }),
      ).toBeInTheDocument();
      expect(
        within(mobileNav).getByRole("menuitem", { name: /contact/i }),
      ).toBeInTheDocument();
      expect(
        within(mobileNav).getByRole("menuitem", { name: /blogs/i }),
      ).toBeInTheDocument();
    });

    test("closes when overlay is clicked", (): void => {
      usePathnameMock.mockReturnValue("/");

      render(<Navbar />);

      fireEvent.click(
        screen.getByRole("button", {
          name: /toggle navigation menu/i,
        }),
      );

      const overlay = document.querySelector(
        ".navbar-mobile-overlay",
      ) as HTMLElement;

      expect(overlay).toBeTruthy();

      fireEvent.click(overlay);

      const mobileMenu = screen.getByRole("menu", {
        hidden: true,
      });

      expect(mobileMenu).toHaveAttribute("aria-hidden", "true");
      expect(mobileMenu.className).not.toContain("navbar-mobile-menu-open");
    });

    test("closes when a mobile navigation link is clicked", (): void => {
      usePathnameMock.mockReturnValue("/");

      render(<Navbar />);

      fireEvent.click(
        screen.getByRole("button", {
          name: /toggle navigation menu/i,
        }),
      );

      const homeLink = screen.getAllByRole("menuitem", {
        name: /home/i,
      })[1]; // mobile version

      fireEvent.click(homeLink);

      const mobileMenu = screen.getByRole("menu", {
        hidden: true,
      });

      expect(mobileMenu).toHaveAttribute("aria-hidden", "true");
      expect(mobileMenu.className).not.toContain("navbar-mobile-menu-open");
    });
  });

  describe("route changes", () => {
    test("closes mobile menu when pathname changes", (): void => {
      usePathnameMock.mockReturnValue("/");

      const { rerender } = render(<Navbar />);

      // open menu first
      fireEvent.click(
        screen.getByRole("button", {
          name: /toggle navigation menu/i,
        }),
      );

      expect(screen.getByRole("menu", { hidden: true })).toHaveAttribute(
        "aria-hidden",
        "false",
      );

      // simulate route change
      usePathnameMock.mockReturnValue("/works");

      rerender(<Navbar />);

      const mobileMenu = screen.getByRole("menu", { hidden: true });

      expect(mobileMenu).toHaveAttribute("aria-hidden", "true");
      expect(mobileMenu.className).not.toContain("navbar-mobile-menu-open");
    });
  });

  describe("body scroll locking", () => {
    test("locks body scroll when mobile menu opens", (): void => {
      usePathnameMock.mockReturnValue("/");

      render(<Navbar />);

      fireEvent.click(
        screen.getByRole("button", {
          name: /toggle navigation menu/i,
        }),
      );

      expect(document.body.style.overflow).toBe("hidden");
    });
    test("restores body scroll when mobile menu closes", (): void => {
      usePathnameMock.mockReturnValue("/");

      render(<Navbar />);

      const toggleButton = screen.getByRole("button", {
        name: /toggle navigation menu/i,
      });

      // open
      fireEvent.click(toggleButton);
      expect(document.body.style.overflow).toBe("hidden");

      // close
      fireEvent.click(toggleButton);
      expect(document.body.style.overflow).toBe("unset");
    });
  });

  describe("scroll behavior", () => {
    test("adds scrolled class after scrolling past threshold", async () => {
      usePathnameMock.mockReturnValue("/");

      render(<Navbar />);

      const nav = screen.getByRole("navigation", {
        name: /primary navigation/i,
      });

      act(() => {
        setScrollY(60);
      });

      await waitFor(() => {
        expect(nav).toHaveClass("navbar-scrolled");
      });
    });

    test("removes scrolled class when above threshold", async () => {
      usePathnameMock.mockReturnValue("/");

      render(<Navbar />);

      const nav = screen.getByRole("navigation", {
        name: /primary navigation/i,
      });

      act(() => {
        setScrollY(60);
      });

      await waitFor(() => {
        expect(nav).toHaveClass("navbar-scrolled");
      });

      act(() => {
        setScrollY(10);
      });

      await waitFor(() => {
        expect(nav).not.toHaveClass("navbar-scrolled");
      });

      setScrollY(10);

      expect(nav.className).not.toContain("navbar-scrolled");
    });

    test("hides navbar when scrolling down", async () => {
      usePathnameMock.mockReturnValue("/");

      render(<Navbar />);

      const nav = screen.getByRole("navigation", {
        name: /primary navigation/i,
      });
      act(() => {
        setScrollY(120);
      });

      act(() => {
        setScrollY(200);
      });

      await waitFor(() => {
        expect(nav).toHaveClass("navbar-hidden");
      });
    });

    test("shows navbar when scrolling up", async () => {
      usePathnameMock.mockReturnValue("/");

      render(<Navbar />);

      const nav = screen.getByRole("navigation", {
        name: /primary navigation/i,
      });

      act(() => {
        setScrollY(200);
      });

      await waitFor(() => {
        expect(nav).toHaveClass("navbar-hidden");
      });

      act(() => {
        setScrollY(100);
      });

      await waitFor(() => {
        expect(nav).toHaveClass("navbar-visible");
        expect(nav).not.toHaveClass("navbar-hidden");
      });
    });
  });

  describe("accessibility", () => {
    test("has primary navigation label", (): void => {
      usePathnameMock.mockReturnValue("/");

      render(<Navbar />);

      expect(
        screen.getByRole("navigation", {
          name: /primary navigation/i,
        }),
      ).toBeInTheDocument();
    });

    test("updates aria-expanded on mobile toggle", (): void => {
      usePathnameMock.mockReturnValue("/");

      render(<Navbar />);

      const toggleButton = screen.getByRole("button", {
        name: /toggle navigation menu/i,
      });

      expect(toggleButton).toHaveAttribute("aria-expanded", "false");

      fireEvent.click(toggleButton);

      expect(toggleButton).toHaveAttribute("aria-expanded", "true");
    });

    test("updates aria-hidden on mobile menu", (): void => {
      usePathnameMock.mockReturnValue("/");

      render(<Navbar />);

      const toggleButton = screen.getByRole("button", {
        name: /toggle navigation menu/i,
      });

      fireEvent.click(toggleButton);

      const mobileMenu = screen.getByRole("menu", {
        hidden: true,
      });

      expect(mobileMenu).toHaveAttribute("aria-hidden", "false");

      fireEvent.click(toggleButton);

      expect(mobileMenu).toHaveAttribute("aria-hidden", "true");
    });
  });
});
