import type { Metadata } from "next";
import type { JSX } from "react";

import AboutUs from "@/features/home/components/about-us";
import Blogs from "@/features/home/components/blogs";
import Hero from "@/features/home/components/hero";
import Solutions from "@/features/home/components/solutions";
import Testimonials from "@/features/home/components/testimonials";

export default function Home(): JSX.Element {
  return (
    <>
      <Hero />
      <AboutUs />
      <Solutions />
      <Testimonials />
      <Blogs />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(websiteJsonLd) }}
      />
    </>
  );
}

export const metadata: Metadata = {
  title: "Websites, Web Applications & Business Systems | Abhisek",
  description:
    "Custom website development, web applications, and business systems built with clarity and purpose. Helping businesses plan, design, and build digital solutions around real goals.",
  openGraph: {
    type: "website",
    title: "Websites, Web Applications & Business Systems | Abhisek",
    description:
      "Custom website development, web applications, and business systems built with clarity and purpose. Helping businesses plan, design, and build digital solutions around real goals.",
    url: "https://mohantyabhisek.com",
    images: [
      {
        url: "https://mohantyabhisek.com/og-image.png",
        width: 1200,
        height: 630,
        alt: "Websites, Web Applications & Business Systems | Abhisek",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Websites, Web Applications & Business Systems | Abhisek",
    description:
      "Custom website development, web applications, and business systems built with clarity and purpose. Helping businesses plan, design, and build digital solutions around real goals.",
    images: ["https://mohantyabhisek.com/og-image.png"],
  },
  alternates: {
    canonical: "https://mohantyabhisek.com",
  },
  robots: {
    index: true,
    follow: true,
  },
  keywords: ["abhisek", "abhishek", "mohantyabhisek", "mohantyabhishek"],
};

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "Organization",
  "@id": "https://mohantyabhisek.com/#organization",
  name: "Abhisek",
  url: "https://mohantyabhisek.com",
  logo: "https://mohantyabhisek.com/logo-transparent-512x512.png",
  founder: {
    "@type": "Person",
    "@id": "https://mohantyabhisek.com/#person",
    name: "Abhisek Mohanty",
    jobTitle: "Website & Web App Consultant",
    url: "https://mohantyabhisek.com",
  },
  sameAs: [
    "https://www.linkedin.com/in/mohanty-abhisek",
    "https://www.instagram.com/coderabhisek",
  ],
  description:
    "Custom website development, web applications, and business systems built with clarity, purpose, and a deep understanding of business goals.",
};
const websiteJsonLd = {
  "@context": "https://schema.org",
  "@type": "WebSite",
  "@id": "https://mohantyabhisek.com/#website",
  url: "https://mohantyabhisek.com",
  name: "Abhisek",
  description:
    "Custom website development, web applications, and business systems built with clarity, purpose, and a deep understanding of business goals.",
  publisher: {
    "@id": "https://mohantyabhisek.com/#organization",
  },
};
