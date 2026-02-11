import { BlogSitemap } from "@/models/blog";
import { getAllBlogSitemap } from "@/services/blog-service";
import { MetadataRoute } from "next";

export const revalidate = 86400; // 5 for testing

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const staticPaths: MetadataRoute.Sitemap = [
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
  ];

  const dynamicPaths = await getDynamicPaths();
  return staticPaths.concat(dynamicPaths);
}

async function getDynamicPaths(): Promise<MetadataRoute.Sitemap> {
  return getAllBlogSitemap()
    .then((blogs: BlogSitemap[]): MetadataRoute.Sitemap => {
      return blogs.map((blog: BlogSitemap) => {
        return {
          url: `https://mohantyabhisek.com/blogs/${blog.slug}`,
          lastModified: blog.lastModifiedAt,
          changeFrequency: "yearly",
          priority: 0.6,
        };
      });
    })
    .catch((err) => {
      console.error("Error fetching sitemap: ", err);
      return [];
    });
}
