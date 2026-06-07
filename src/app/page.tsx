import type { Metadata } from "next";
import type { JSX } from "react";

import AboutUs from "@/features/home/components/about-us";
import Cta from "@/features/home/components/cta";
import Hero from "@/features/home/components/hero";
import Services from "@/features/home/components/services";
import Thinking from "@/features/home/components/thinking";

export default function Home(): JSX.Element {
  return (
    <>
      <Hero />
      <AboutUs />
      <Thinking />
      <Services />
      <Cta />
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
  title: "Website & Web App Solutions for Businesses | Abhisek",
  description:
    "Struggling to decide what website or web app your business actually needs? Get clarity, structure, and purpose-driven solutions before building.",
  openGraph: {
    type: "website",
    title: "Website & Web App Solutions for Businesses",
    description:
      "Struggling to decide what website or web app your business actually needs? Get clarity, structure, and purpose-driven solutions before building.",
    url: "https://mohantyabhisek.com",
    images: [
      {
        url: "https://mohantyabhisek.com/og-image.png",
        width: 1200,
        height: 630,
        alt: "Website & Web App Solutions for Businesses | Abhisek",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Website & Web App Solutions for Businesses | Abhisek",
    description:
      "Struggling to decide what website or web app your business actually needs? Get clarity, structure, and purpose-driven solutions before building.",
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
    "Purpose & clarity-driven website and web app solutions for businesses, led by Abhisek.",
};
const websiteJsonLd = {
  "@context": "https://schema.org",
  "@type": "WebSite",
  "@id": "https://mohantyabhisek.com/#website",
  url: "https://mohantyabhisek.com",
  name: "Abhisek",
  description:
    "Purpose-driven website and web app consulting with structured insights on digital systems and execution.",
  publisher: {
    "@id": "https://mohantyabhisek.com/#organization",
  },
};
