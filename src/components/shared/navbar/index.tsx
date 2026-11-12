"use client";

import "./styles.css";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import type { JSX } from "react";
import { useEffect, useRef, useState } from "react";

import { CtaLink } from "../cta-link";

interface NavigationItem {
  name: string;
  href: string;
}

const navigationItems: NavigationItem[] = [
  { name: "Home", href: "/" },
  { name: "Work", href: "/works" },
  { name: "Contact", href: "/contact" },
  { name: "Blogs", href: "/blogs" },
];

export default function Navbar(): JSX.Element {
  const pathname = usePathname();

  const [isScrolled, setIsScrolled] = useState(false);
  const [isNavbarVisible, setIsNavbarVisible] = useState(true);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const lastScrollY = useRef(0);
  const mobileMenuToggleRef = useRef<HTMLButtonElement>(null);

  /**
   * Update the navbar appearance and visibility based on scroll position.
   *
   * The previous scroll position is kept in a ref so the scroll listener
   * only needs to be registered once.
   */
  useEffect(() => {
    const handleScroll = (): void => {
      const currentScrollY = window.scrollY;
      const previousScrollY = lastScrollY.current;

      setIsScrolled(currentScrollY > 50);

      if (currentScrollY > previousScrollY && currentScrollY > 100) {
        // Scrolling down: hide the navbar.
        setIsNavbarVisible(false);
      } else if (currentScrollY < previousScrollY) {
        // Scrolling up: show the navbar.
        setIsNavbarVisible(true);
      }

      lastScrollY.current = currentScrollY;
    };

    window.addEventListener("scroll", handleScroll, { passive: true });

    return (): void => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  /**
   * Prevent the document from scrolling while the mobile menu is open.
   *
   * This effect synchronizes React state with the external DOM API.
   */
  useEffect(() => {
    if (isMobileMenuOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }

    return (): void => {
      document.body.style.overflow = "";
    };
  }, [isMobileMenuOpen]);

  /**
   * Close the mobile menu when Escape is pressed.
   *
   * Focus is returned to the menu toggle so keyboard users retain
   * a predictable position in the navigation.
   */
  useEffect(() => {
    if (!isMobileMenuOpen) {
      return;
    }

    const handleKeyDown = (event: KeyboardEvent): void => {
      if (event.key !== "Escape") {
        return;
      }

      setIsMobileMenuOpen(false);
      mobileMenuToggleRef.current?.focus();
    };

    document.addEventListener("keydown", handleKeyDown);

    return (): void => {
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [isMobileMenuOpen]);

  /**
   * Determine whether a navigation item represents the current route.
   */
  const isActiveLink = (href: string): boolean => {
    if (href === "/") {
      return pathname === "/";
    }

    return pathname.startsWith(href);
  };

  /**
   * Close the mobile menu.
   */
  const closeMobileMenu = (): void => {
    setIsMobileMenuOpen(false);
  };

  return (
    <>
      {/* Primary navigation */}
      <nav
        className={`navbar ${isScrolled ? "navbar-scrolled" : ""} ${
          isNavbarVisible ? "navbar-visible" : "navbar-hidden"
        }`}
        aria-label="Primary navigation"
      >
        <div className="navbar-container">
          {/* Logo */}
          <div className="navbar-logo-zone">
            <Link
              href="/"
              className="navbar-logo-link"
              aria-label="Go to homepage"
            >
              <Image
                src="/logo.png"
                alt="Company Logo"
                width={120}
                height={34}
                priority
                className="navbar-logo-image"
              />
            </Link>
          </div>

          {/* Desktop navigation */}
          <div className="navbar-nav-desktop">
            {navigationItems.map((item) => {
              const active = isActiveLink(item.href);

              return (
                <Link
                  key={item.name}
                  href={item.href}
                  className={`navbar-nav-link ${
                    active ? "navbar-nav-link-active" : ""
                  }`}
                  aria-current={active ? "page" : undefined}
                >
                  {item.name}
                </Link>
              );
            })}
          </div>

          {/* Utility actions and mobile menu toggle */}
          <div className="navbar-utility-zone">
            <CtaLink
              href="tel:+919439485166"
              target="_blank"
              rel="noopener noreferrer"
              className="hidden md:inline-flex"
            >
              Call Me
            </CtaLink>

            <button
              ref={mobileMenuToggleRef}
              type="button"
              className="navbar-mobile-toggle"
              onClick={() => setIsMobileMenuOpen((open) => !open)}
              aria-expanded={isMobileMenuOpen}
              aria-controls="mobile-menu"
              aria-label={
                isMobileMenuOpen
                  ? "Close navigation menu"
                  : "Open navigation menu"
              }
            >
              <span className="navbar-mobile-toggle-line" />
              <span className="navbar-mobile-toggle-line" />
              <span className="navbar-mobile-toggle-line" />
            </button>
          </div>
        </div>
      </nav>

      {/* Mobile menu backdrop */}
      <div
        className={`navbar-mobile-overlay ${
          isMobileMenuOpen ? "navbar-mobile-overlay-open" : ""
        }`}
        aria-hidden="true"
        onClick={closeMobileMenu}
      />

      {/* Mobile navigation */}
      <div
        id="mobile-menu"
        className={`navbar-mobile-menu ${
          isMobileMenuOpen ? "navbar-mobile-menu-open" : ""
        }`}
        aria-hidden={!isMobileMenuOpen}
        inert={!isMobileMenuOpen}
      >
        <div className="navbar-mobile-menu-content">
          <nav className="navbar-mobile-nav" aria-label="Mobile navigation">
            {navigationItems.map((item) => {
              const active = isActiveLink(item.href);

              return (
                <Link
                  key={item.name}
                  href={item.href}
                  className={`navbar-mobile-nav-link ${
                    active ? "navbar-mobile-nav-link-active" : ""
                  }`}
                  aria-current={active ? "page" : undefined}
                  onClick={closeMobileMenu}
                >
                  {item.name}
                </Link>
              );
            })}
          </nav>

          <CtaLink
            href="tel:+919439485166"
            target="_blank"
            rel="noopener noreferrer"
            onClick={closeMobileMenu}
          >
            Call Me
          </CtaLink>
        </div>
      </div>
    </>
  );
}
