"use client";

import { useState, useEffect, startTransition } from "react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";

/**
 * Navbar Component
 * Purpose: Provides a responsive navigation bar with scroll behavior and mobile menu support.
 *
 * Key Features:
 * - Responsive design for desktop and mobile
 * - Scroll-triggered background appearance
 * - Optional hide/show behavior based on scroll direction
 * - Mobile menu with slide-in panel
 */
export default function Navbar() {
  // State management for scroll behavior and mobile menu
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [lastScrollY, setLastScrollY] = useState(0);
  const [isNavbarVisible, setIsNavbarVisible] = useState(true);

  const pathname = usePathname();

  /**
   * Navigation items with their display names and routes
   * Kept simple and focused on core user journeys
   */
  const navigationItems = [
    { name: "Home", href: "/" },
    { name: "Work", href: "/work" },
    { name: "Contact", href: "/contact" },
  ];

  /**
   * Handle scroll behavior for background appearance and navbar visibility
   * Background fades in after 40-60px of scroll
   * Optional hide/show behavior based on scroll direction
   */
  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;

      // Background appearance logic
      setIsScrolled(currentScrollY > 50);

      // Hide/show logic (optional behavior)
      if (currentScrollY > lastScrollY && currentScrollY > 100) {
        // Scrolling down - hide navbar
        setIsNavbarVisible(false);
      } else if (currentScrollY < lastScrollY) {
        // Scrolling up - show navbar
        setIsNavbarVisible(true);
      }

      setLastScrollY(currentScrollY);
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, [lastScrollY]);

  /**
   * Close mobile menu when route changes
   */
  useEffect(() => {
    // Defer the state update to avoid synchronous setState inside the effect
    startTransition(() => {
      setIsMobileMenuOpen(false);
    });
  }, [pathname]);

  /**
   * Prevent body scroll when mobile menu is open
   */
  useEffect(() => {
    if (isMobileMenuOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }

    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isMobileMenuOpen]);

  /**
   * Check if a navigation item is currently active
   */
  const isActiveLink = (href: string) => {
    if (href === "/") {
      return pathname === "/";
    }
    return pathname.startsWith(href);
  };

  return (
    <>
      {/* Main navbar container with conditional classes for scroll states */}
      <nav
        className={`navbar ${isScrolled ? "navbar-scrolled" : ""} ${
          isNavbarVisible ? "navbar-visible" : "navbar-hidden"
        }`}
        role="navigation"
        aria-label="Primary navigation"
      >
        {/* Inner container for content alignment */}
        <div className="navbar-container">
          {/* Logo zone - always routes to home */}
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

          {/* Desktop navigation items */}
          <div className="navbar-nav-desktop" role="menubar">
            {navigationItems.map((item) => (
              <Link
                key={item.name}
                href={item.href}
                className={`navbar-nav-link ${
                  isActiveLink(item.href) ? "navbar-nav-link-active" : ""
                }`}
                role="menuitem"
              >
                {item.name}
              </Link>
            ))}
          </div>

          {/* Utility zone - language selector */}
          <div className="navbar-utility-zone">
            {/* Language selector placeholder */}
            <div className="navbar-language-selector">
              <span className="navbar-language-text">EN</span>
              <svg
                className="navbar-language-arrow"
                width="12"
                height="8"
                viewBox="0 0 12 8"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                aria-hidden="true"
              >
                <path
                  d="M1 1.5L6 6.5L11 1.5"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </div>

            {/* Mobile menu toggle */}
            <button
              className="navbar-mobile-toggle"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              aria-expanded={isMobileMenuOpen}
              aria-controls="mobile-menu"
              aria-label="Toggle navigation menu"
            >
              <span className="navbar-mobile-toggle-line"></span>
              <span className="navbar-mobile-toggle-line"></span>
              <span className="navbar-mobile-toggle-line"></span>
            </button>
          </div>
        </div>
      </nav>

      {/* Mobile menu overlay */}
      {isMobileMenuOpen && (
        <div
          className="navbar-mobile-overlay"
          onClick={() => setIsMobileMenuOpen(false)}
          aria-hidden="true"
        />
      )}

      {/* Mobile slide-in menu panel */}
      <div
        id="mobile-menu"
        className={`navbar-mobile-menu ${
          isMobileMenuOpen ? "navbar-mobile-menu-open" : ""
        }`}
        role="menu"
        aria-hidden={!isMobileMenuOpen}
      >
        <div className="navbar-mobile-menu-content">
          {/* Mobile navigation links */}
          <nav className="navbar-mobile-nav" role="menubar">
            {navigationItems.map((item) => (
              <Link
                key={item.name}
                href={item.href}
                className={`navbar-mobile-nav-link ${
                  isActiveLink(item.href) ? "navbar-mobile-nav-link-active" : ""
                }`}
                role="menuitem"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                {item.name}
              </Link>
            ))}
          </nav>

          {/* Mobile language selector */}
          <div className="navbar-mobile-language">
            <span className="navbar-mobile-language-text">EN</span>
            <svg
              className="navbar-mobile-language-arrow"
              width="12"
              height="8"
              viewBox="0 0 12 8"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              aria-hidden="true"
            >
              <path
                d="M1 1.5L6 6.5L11 1.5"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </div>
        </div>
      </div>
    </>
  );
}
