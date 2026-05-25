import type { Metadata } from "next";
import type { JSX } from "react";

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
      <h1 className="text-4xl font-bold text-primary my-4 text-center">
        Blogs
      </h1>
      <p className="text-base text-foreground/80 mb-8 container px-6 lg:px-8 mx-auto text-center">
        Thoughtful writing on websites, structure, and practical execution.
      </p>
      <BlogSearch query={query} />
      <BlogList query={query} />
    </>
  );
}

export const metadata: Metadata = {
  title: "Blogs on Websites, Systems & Clarity | Abhisek",
  description:
    "Articles exploring clarity in web design, structure in digital systems, and practical execution for businesses.",
  openGraph: {
    type: "website",
    title: "Blogs on Websites, Systems & Clarity | Abhisek",
    description:
      "Articles exploring clarity in web design, structure in digital systems, and practical execution for businesses.",
    url: "https://mohantyabhisek.com/blogs",
  },
  twitter: {
    card: "summary_large_image",
    title: "Blogs on Websites, Systems & Clarity | Abhisek",
    description:
      "Articles exploring clarity in web design, structure in digital systems, and practical execution for businesses.",
  },
  alternates: {
    canonical: "https://mohantyabhisek.com/blogs",
  },
  robots: {
    index: true,
    follow: true,
  },
};
