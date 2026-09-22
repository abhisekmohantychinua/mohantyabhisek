import { Instagram, Linkedin, Mail, Phone } from "lucide-react";
import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import type { JSX } from "react";

export default async function Contact(): Promise<JSX.Element> {
  return (
    <section className="container mx-auto flex h-[80vh] flex-col items-center justify-center">
      <div className="mb-5 h-60 w-60 overflow-hidden rounded-full object-cover">
        <Image
          src="/developer.jpg"
          alt="Developer Photo"
          width={4080}
          height={3060}
          className="h-full w-full object-cover"
          priority
        />
      </div>

      <h1
        id="contact-heading"
        className="font-break text-primary text-center text-4xl font-bold md:text-6xl"
      >
        Abhisek Mohanty
      </h1>
      <p className="text-xl md:text-2xl">Website & Web App Consultant</p>
      <div className="bg-secondary my-4 h-px w-full max-w-md"></div>
      <p className="text-foreground/80 text-sm md:text-lg">
        Start with clarity, build with purpose.
        <br />A practical,structured approach.
      </p>

      {/* Social media links */}
      <div
        className="my-2 flex w-full items-center justify-center space-x-4"
        aria-label="Social links"
      >
        <Link
          href="https://www.linkedin.com/in/mohanty-abhisek"
          className="bg-accent/0 hover:bg-accent/20 hover:text-accent inline-flex items-center justify-center rounded-full p-2 transition-colors duration-200"
          aria-label="LinkedIn"
          target="_blank"
          rel="noopener noreferrer"
        >
          <Linkedin size={20} />
        </Link>
        <Link
          href="https://www.instagram.com/abhisek.mohanty/"
          className="bg-accent/0 hover:bg-accent/20 hover:text-accent inline-flex items-center justify-center rounded-full p-2 transition-colors duration-200"
          aria-label="Instagram"
          target="_blank"
          rel="noopener noreferrer"
        >
          <Instagram size={20} />
        </Link>
        <Link
          href="mailto:mohantyabhisek@hotmail.com"
          className="bg-accent/0 hover:bg-accent/20 hover:text-accent inline-flex items-center justify-center rounded-full p-2 transition-colors duration-200"
          aria-label="Email"
          target="_blank"
          rel="noopener noreferrer"
        >
          <Mail size={20} />
        </Link>
        <Link
          href="tel:+919439485166"
          className="bg-accent/0 hover:bg-accent/20 hover:text-accent inline-flex items-center justify-center rounded-full p-2 transition-colors duration-200"
          aria-label="Phone"
          target="_blank"
          rel="noopener noreferrer"
        >
          <Phone size={20} />
        </Link>
      </div>

      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
    </section>
  );
}

export const metadata: Metadata = {
  title: "Clarity Before You Build | Contact Abhisek",
  description:
    "For businesses unsure what website or web app they actually need. A structured conversation to bring clarity before decisions are made.",
  openGraph: {
    type: "website",
    title: "Clarity Before You Build — Contact Abhisek",
    description:
      "A structured conversation for businesses and founders who want clarity before building a website or web app.",
    url: "https://mohantyabhisek.com/contact",
    images: [
      {
        url: "https://mohantyabhisek.com/og-image.jpg",
        width: 1200,
        height: 630,
        alt: "Website & Web App Solutions for Businesses | Abhisek",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Clarity Before You Build — Contact Abhisek",
    description:
      "For those who want clarity and structure before committing to a website or web app.",
    images: ["https://mohantyabhisek.com/og-image.jpg"],
  },
  alternates: {
    canonical: "https://mohantyabhisek.com/contact",
  },
  robots: { index: true, follow: true },
  keywords: ["abhisek", "abhishek", "mohantyabhisek", "mohantyabhishek"],
};

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "Person",
  "@id": "https://mohantyabhisek.com/#person",
  name: "Abhisek Mohanty",
  url: "https://mohantyabhisek.com/contact",
  image: "https://mohantyabhisek.com/developer.jpg",
  jobTitle: "Website & Web App Consultant",
  sameAs: [
    "https://www.linkedin.com/in/mohanty-abhisek",
    "https://www.instagram.com/coderabhisek",
  ],
  contactPoint: [
    {
      "@type": "ContactPoint",
      telephone: "+919439485166",
      email: "mohantyabhisek@hotmail.com",
      contactType: "consulting",
      availableLanguage: ["English", "Hindi", "Odia"],
    },
  ],
  worksFor: {
    "@type": "Organization",
    "@id": "https://mohantyabhisek.com/#organization",
  },
  description:
    "Website and web app consultant focused on clarity, structure, and purpose-driven digital solutions for businesses.",
};
