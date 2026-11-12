import type { Metadata } from "next";
import type { JSX } from "react";

import ContactEnquiries from "@/features/contact/components/contact-enquiries";
import ContactInfo from "@/features/contact/components/contact-info";
import Header from "@/features/contact/components/header";

export default async function Contact(): Promise<JSX.Element> {
  return (
    <>
      <Header />
      <ContactInfo />
      <ContactEnquiries />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
    </>
  );
}

export const metadata: Metadata = {
  title: "Reach Out In A Way That Works For You | Abhisek",
  description:
    "Reach out to Abhisek Mohanty by email, WhatsApp, LinkedIn, Instagram, Telegram, or phone for websites, web applications, and business systems.",
  openGraph: {
    type: "website",
    title: "Reach Out In A Way That Works For You | Abhisek",
    description:
      "Reach out to Abhisek Mohanty by email, WhatsApp, LinkedIn, Instagram, Telegram, or phone for websites, web applications, and business systems.",
    url: "https://mohantyabhisek.com/contact",
    images: [
      {
        url: "https://mohantyabhisek.com/contact-og-image.jpg",
        width: 1200,
        height: 630,
        alt: "Reach Out In A Way That Works For You | Abhisek",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Reach Out In A Way That Works For You | Abhisek",
    description:
      "Reach out to Abhisek Mohanty by email, WhatsApp, LinkedIn, Instagram, Telegram, or phone for websites, web applications, and business systems.",
    images: ["https://mohantyabhisek.com/contact-og-image.jpg"],
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
  url: "https://mohantyabhisek.com/",
  image: "https://mohantyabhisek.com/developer.jpg",
  jobTitle: "Website & Web Application Consultant",
  sameAs: [
    "https://www.linkedin.com/in/mohanty-abhisek",
    "https://github.com/abhisekmohantychinua",
    "https://www.instagram.com/coderabhisek",
    "https://t.me/mohantyabhisek",
    "https://wa.me/919439485166",
  ],
  contactPoint: [
    {
      "@type": "ContactPoint",
      telephone: "+919439485166",
      email: "mohantyabhisek@hotmail.com",
      url: "https://wa.me/919439485166",
      contactType: "consulting",
      availableLanguage: ["English", "Hindi", "Odia"],
    },
  ],
  worksFor: {
    "@type": "Organization",
    "@id": "https://mohantyabhisek.com/#organization",
  },
  description:
    "Website and web application consultant focused on clarity, structure, and purpose-driven digital solutions for businesses.",
};
