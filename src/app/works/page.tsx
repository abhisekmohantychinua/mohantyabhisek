import type { Metadata } from "next";
import type { JSX } from "react";

import Header from "@/features/works/components/header";

export default function Works(): JSX.Element {
  return (
    <>
      <Header />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
    </>
  );
}

export const metadata: Metadata = {
  title: "Selected Case Studies & Digital Projects | Abhisek",
  description:
    "A collection of projects, ideas, and digital solutions built across different industries, requirements, and business contexts. Each case study explores the challenge, approach, and outcome behind the work.",
  openGraph: {
    type: "website",
    title: "Selected Case Studies & Digital Projects | Abhisek",
    description:
      "A collection of projects, ideas, and digital solutions built across different industries, requirements, and business contexts. Each case study explores the challenge, approach, and outcome behind the work.",
    url: "https://mohantyabhisek.com",
    images: [
      {
        url: "https://mohantyabhisek.com/works-og-image.png",
        width: 1200,
        height: 630,
        alt: "Selected Case Studies & Digital Projects | Abhisek",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Selected Case Studies & Digital Projects | Abhisek",
    description:
      "A collection of projects, ideas, and digital solutions built across different industries, requirements, and business contexts. Each case study explores the challenge, approach, and outcome behind the work.",
    images: ["https://mohantyabhisek.com/works-og-image.png"],
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
  "@type": "CollectionPage",
  "@id": "https://mohantyabhisek.com/work#collection",
  url: "https://mohantyabhisek.com/work",
  name: "Selected Case Studies And Digital Projects",
  description:
    "A collection of projects, ideas, and digital solutions built across different industries, requirements, and business contexts. Each case study explores the challenge, approach, and outcome behind the work.",
  isPartOf: {
    "@id": "https://mohantyabhisek.com/#website",
  },
  about: [
    {
      "@type": "Thing",
      name: "Website Development",
    },
    {
      "@type": "Thing",
      name: "Web Application Development",
    },
    {
      "@type": "Thing",
      name: "Business Systems",
    },
  ],
};
