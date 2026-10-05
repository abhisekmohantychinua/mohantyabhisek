import "./styles.css";

import {
  ArrowUpRight,
  Globe2,
  Instagram,
  Linkedin,
  Mail,
  MessageCircle,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import type { JSX } from "react";

const contactMethods: {
  name: string;
  value: string;
  href: string;
  icon: typeof Mail;
}[] = [
  {
    name: "Email",
    value: "mohantyabhisek@hotmail.com",
    href: "mailto:mohantyabhisek@hotmail.com",
    icon: Mail,
  },
  {
    name: "LinkedIn",
    value: "linkedin.com/in/mohanty-abhisek",
    href: "https://www.linkedin.com/in/mohanty-abhisek",
    icon: Linkedin,
  },
  {
    name: "Telegram",
    value: "https://t.me/mohantyabhisek",
    href: "https://t.me/mohantyabhisek",
    icon: Instagram,
  },
  {
    name: "WhatsApp",
    value: "wa.me/919439485166",
    href: "https://wa.me/919439485166",
    icon: MessageCircle,
  },
  {
    name: "Instagram",
    value: "@coderabhisek",
    href: "https://www.instagram.com/coderabhisek",
    icon: Instagram,
  },
] as const;

export default function ContactInfo(): JSX.Element {
  return (
    <section className="contact-info" aria-labelledby="contact-info-heading">
      <div className="contact-info__block">
        <figure className="contact-info__figure">
          <Image
            src="/developer.jpg"
            alt="Abhisek Mohanty"
            width={4080}
            height={3060}
            className="contact-info__image"
            priority
          />

          <figcaption className="contact-info__figcaption">
            Abhisek Mohanty
          </figcaption>
        </figure>

        <div className="contact-info__right">
          <h2 id="contact-info-heading" className="contact-info__right-heading">
            Available <span className="highlight">In</span>
          </h2>

          <div className="contact-info__links">
            {contactMethods.map((method) => {
              // eslint-disable-next-line @typescript-eslint/naming-convention
              const Icon = method.icon;
              const isExternal = method.href.startsWith("http");

              return (
                <Link
                  key={method.name}
                  href={method.href}
                  className="contact-info__link"
                  target={isExternal ? "_blank" : undefined}
                  rel={isExternal ? "noopener noreferrer" : undefined}
                  aria-label={`${method.name}: ${method.value}`}
                >
                  <span className="contact-info__icon">
                    <Icon className="contact-info__icon-svg" />
                  </span>

                  <span className="contact-info__link-content">
                    <span className="contact-info__link-name">
                      {method.name}
                    </span>

                    <span className="contact-info__link-value">
                      {method.value}
                    </span>
                  </span>

                  <ArrowUpRight
                    className="contact-info__arrow"
                    size={30}
                    strokeWidth={2}
                  />
                </Link>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
