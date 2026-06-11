import type { Metadata } from "next";
import type { JSX } from "react";

import Header from "@/features/blogs/components/header";
import BlogList from "@/features/blogs/components/list";
import BlogSearch from "@/features/blogs/components/search";

type BlogsParams = {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
};

export default async function Blogs({
  searchParams,
}: BlogsParams): Promise<JSX.Element> {
  const q = (await searchParams).q;
  const query = Array.isArray(q) ? q[0] : q;

  return (
    <>
      <Header />
      <BlogSearch query={query} />
      <BlogList query={query} />
    </>
  );
}

export const metadata: Metadata = {
  title: "Blogs On Websites, Web Applications & Business Systems | Abhisek",
  description:
    "Explore blogs covering website development, web applications, business systems, software planning, digital strategy, and technology decisions for modern businesses.",
  openGraph: {
    type: "website",
    title: "Blogs On Websites, Web Applications & Business Systems | Abhisek",
    description:
      "Explore blogs covering website development, web applications, business systems, software planning, digital strategy, and technology decisions for modern businesses.",
    url: "https://mohantyabhisek.com/blogs",
    images: [
      {
        url: "https://mohantyabhisek.com/blogs-og-image.png",
        width: 1200,
        height: 630,
        alt: "Blogs On Websites, Web Applications & Business Systems | Abhisek",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Blogs On Websites, Web Applications & Business Systems | Abhisek",
    description:
      "Explore blogs covering website development, web applications, business systems, software planning, digital strategy, and technology decisions for modern businesses.",
    images: ["https://mohantyabhisek.com/works-og-image.png"],
  },
  alternates: {
    canonical: "https://mohantyabhisek.com/blogs",
  },
  robots: {
    index: true,
    follow: true,
  },
};
