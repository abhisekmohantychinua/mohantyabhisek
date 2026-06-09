import "./styles.css";

import { Instagram, Linkedin, Mail, Phone } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import type { JSX } from "react";

// Navigation links for the footer
const navLinks = [
  { name: "Home", href: "/" },
  { name: "Work", href: "/work" },
  { name: "Contact", href: "/contact" },
  { name: "Blogs", href: "/blogs" },
];

export default function Footer(): JSX.Element {
  return (
    <footer className="footer" role="contentinfo">
      <div className="footer__left">
        <Link href="/" className="footer__left-logo" aria-label="Abhisek home">
          <Image
            src="/logo.png"
            alt="Company Logo"
            width={150}
            height={45}
            className="footer__left-logo-image"
          />
        </Link>
        <p className="footer__left-tagline">
          Building digital systems with <br /> clarity and purpose.
        </p>
      </div>
      <div className="footer__right">
        <div className="footer__right-top">
          {/* Footer navigation links */}
          <nav className="footer__right-nav" aria-label="Footer navigation">
            {navLinks.map((item) => (
              <Link
                key={item.name}
                href={item.href}
                className="footer__right-nav-link"
              >
                {item.name}
              </Link>
            ))}
          </nav>
        </div>
        <hr className="divider footer__right-divider" />
        <div className="footer__right-bottom">
          <p className="footer__right-meta">
            &copy; 2026 Abhisek. All rights reserved.
          </p>
          <span>|</span>
          {/* Social media links */}
          <div className="footer__right-social" aria-label="Social links">
            <Link
              href="https://www.linkedin.com/in/mohanty-abhisek"
              className="footer__right-social-link"
              aria-label="LinkedIn"
            >
              <Linkedin size={20} />
            </Link>
            <Link
              href="https://www.instagram.com/abhisek.mohanty/"
              className="footer__right-social-link"
              aria-label="Instagram"
            >
              <Instagram size={20} />
            </Link>
            <Link
              href="mailto:mohantyabhisek@hotmail.com"
              className="footer__right-social-link"
              aria-label="Email"
            >
              <Mail size={20} />
            </Link>
            <Link
              href="tel:+919439485166"
              className="footer__right-social-link"
              aria-label="Phone"
            >
              <Phone size={20} />
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
