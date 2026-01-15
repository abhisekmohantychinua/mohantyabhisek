import { Instagram, Linkedin, Mail, Phone } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

// Navigation links for the footer
const navLinks = [
  { name: "Home", href: "/" },
  { name: "Work", href: "/work" },
  { name: "Contact", href: "/contact" },
];

/**
 * Footer component with company info, navigation, and social links
 */
export default function Footer() {
  return (
    <footer className="footer" role="contentinfo">
      {/* Footer divider */}
      <div className="footer-divider" aria-hidden="true" />

      <div className="footer-container">
        <div className="footer-top">
          {/* Footer identity section */}
          <div className="footer-identity">
            <Link href="/" className="footer-logo" aria-label="Abhisek home">
              <Image
                src="/logo.png"
                alt="Company Logo"
                width={150}
                height={45}
                className="footer-logo-image"
              />
            </Link>
            <p className="footer-tagline">
              Building digital systems with clarity and purpose.
            </p>
          </div>

          {/* Footer navigation links */}
          <nav className="footer-nav" aria-label="Footer navigation">
            {navLinks.map((item) => (
              <Link
                key={item.name}
                href={item.href}
                className="footer-nav-link"
              >
                {item.name}
              </Link>
            ))}
          </nav>

          {/* Social media links */}
          <div className="footer-social" aria-label="Social links">
            <Link
              href="https://www.linkedin.com/in/mohanty-abhisek"
              className="footer-social-link"
              aria-label="LinkedIn"
            >
              <Linkedin size={20} />
            </Link>
            <Link
              href="https://www.instagram.com/abhisek.mohanty/"
              className="footer-social-link"
              aria-label="Instagram"
            >
              <Instagram size={20} />
            </Link>
            <Link
              href="mailto:mohantyabhisek@hotmail.com"
              className="footer-social-link"
              aria-label="Email"
            >
              <Mail size={20} />
            </Link>
            <Link
              href="tel:+919439485166"
              className="footer-social-link"
              aria-label="Phone"
            >
              <Phone size={20} />
            </Link>
          </div>
        </div>

        <div className="footer-bottom">
          <p className="footer-meta">
            &copy; 2026 Abhisek. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
