import { MetadataRoute } from "next";

export default function sitemap(): MetadataRoute.Sitemap {
  return [
    {
      url: "https://mohantyabhisek.com",
      lastModified: new Date("2026-01-22T16:02:59.617Z"),
      changeFrequency: "monthly",
      priority: 1.0,
    },
    {
      url: "https://mohantyabhisek.com/contact",
      lastModified: new Date("2026-01-22T16:02:59.617Z"),
      changeFrequency: "yearly",
      priority: 0.8,
    },
    {
      url: "https://mohantyabhisek.com/blogs/focused-lead-generation-websites-and-landing-pages",
      lastModified: new Date("2026-02-01"),
      changeFrequency: "yearly",
      priority: 0.6,
    },
    {
      url: "https://mohantyabhisek.com/blogs/small-business-online-growth-structure-clarity-systems",
      lastModified: new Date("2026-02-08"),
      changeFrequency: "yearly",
      priority: 0.6,
    },
  ];
}
