import type { Metadata } from "next";
import type { JSX } from "react";

import ContactInfo from "@/features/contact/components/contact-info";
import Header from "@/features/contact/components/header";

export default async function Contact(): Promise<JSX.Element> {
  return (
    <>
      <Header />
      <ContactInfo />
    </>
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
