import Link from "next/link";

const navLinks = [
  { name: "Home", href: "/" },
  { name: "Work", href: "/work" },
  { name: "Services", href: "/#services" },
  { name: "Contact", href: "/contact" },
];

const socials = [
  {
    name: "LinkedIn",
    href: "https://www.linkedin.com/",
    icon: (
      <svg
        className="footer-icon"
        viewBox="0 0 24 24"
        fill="none"
        aria-hidden="true"
      >
        <path
          d="M6.94 9.5V18M11.5 18V13.75C11.5 12.7835 12.2835 12 13.25 12C14.2165 12 15 12.7835 15 13.75V18M9.5 7.5C9.5 8.32843 8.82843 9 8 9C7.17157 9 6.5 8.32843 6.5 7.5C6.5 6.67157 7.17157 6 8 6C8.82843 6 9.5 6.67157 9.5 7.5Z"
          strokeWidth="1.6"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <rect
          x="4.5"
          y="4.5"
          width="15"
          height="15"
          rx="2.5"
          strokeWidth="1.6"
        />
      </svg>
    ),
  },
  {
    name: "Instagram",
    href: "https://www.instagram.com/",
    icon: (
      <svg
        className="footer-icon"
        viewBox="0 0 24 24"
        fill="none"
        aria-hidden="true"
      >
        <rect x="4.5" y="4.5" width="15" height="15" rx="4" strokeWidth="1.6" />
        <circle cx="12" cy="12" r="3.25" strokeWidth="1.6" />
        <circle cx="16.5" cy="7.5" r="0.9" fill="currentColor" />
      </svg>
    ),
  },
  {
    name: "GitHub",
    href: "https://github.com/",
    icon: (
      <svg
        className="footer-icon"
        viewBox="0 0 24 24"
        fill="none"
        aria-hidden="true"
      >
        <path
          d="M9.5 20.5C9.5 19.9477 9.5 18.5 9.5 17.25C7.5 17.75 6.5 16.5 6 15.5C5.5 14.5 4.5 14.25 4.5 14C4.5 13.75 5.5 13.75 6 14C6.5 14.25 7.25 15.5 8.5 15.75C9.27614 15.75 10 15.5 10.5 15.25C10.6024 14.553 10.9659 13.9193 11.5 13.5C9.5 13.25 7.5 12.5 7.5 9.5C7.5 8.57174 7.86875 7.6815 8.52513 7.02513C9.1815 6.36875 10.0717 6 11 6C11.3975 5.99935 11.7925 6.06009 12.17 6.18C13.1872 6.00354 14.2341 6.05584 15.2261 6.33349C16.218 6.61115 17.1251 7.10686 17.875 7.78C17.875 7.78 18.125 7.03 18.75 7.03C18.875 7.03 18.996 7.043 19.115 7.068C19.234 7.093 19.35 7.129 19.46 7.175C19.57 7.221 19.675 7.277 19.772 7.343C19.869 7.409 19.958 7.484 20.036 7.566C20.114 7.648 20.181 7.737 20.235 7.831C20.289 7.925 20.329 8.024 20.355 8.126C20.381 8.228 20.393 8.333 20.39 8.438C20.39 8.75 20.25 9.75 19.5 10.03C19.5 11.0157 19.1366 11.9646 18.4853 12.6712C17.834 13.3778 16.9427 13.7875 16 13.81C16.4236 14.187 16.7549 14.6564 16.965 15.1824C17.1751 15.7085 17.2577 16.2771 17.206 16.84C17.206 18.25 17.206 19.5 17.206 20.5"
          strokeWidth="1.6"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    ),
  },
];

export default function Footer() {
  return (
    <footer className="footer" role="contentinfo">
      <div className="footer-divider" aria-hidden="true" />

      <div className="footer-container">
        <div className="footer-top">
          <div className="footer-identity">
            <Link href="/" className="footer-logo" aria-label="Abhisek home">
              Abhisek
            </Link>
            <p className="footer-tagline">
              Building digital systems with clarity and purpose.
            </p>
          </div>

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

          <div className="footer-social" aria-label="Social links">
            {socials.map((item) => (
              <Link
                key={item.name}
                href={item.href}
                className="footer-social-link"
                aria-label={item.name}
              >
                {item.icon}
              </Link>
            ))}
          </div>
        </div>

        <div className="footer-bottom">
          <p className="footer-meta">
            © Abhisek. Thoughtful work over quick output.
          </p>
        </div>
      </div>
    </footer>
  );
}
