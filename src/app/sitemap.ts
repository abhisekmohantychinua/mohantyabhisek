import type { MetadataRoute } from "next";

import type { BlogSitemap } from "@/features/blogs/models/blog";
import { getAllBlogSitemap } from "@/features/blogs/services/blog-service";
import { works } from "@/features/works/store/works-store";

export const revalidate = 86400; // 24 hours in seconds

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
    {
      url: "https://mohantyabhisek.com/blogs",
      lastModified: new Date("2026-02-15T12:00:00.000Z"),
      changeFrequency: "weekly",
      priority: 0.8,
    },
    {
      url: "https://mohantyabhisek.com/works",
      lastModified: new Date("2026-07-15T12:00:00.000Z"),
      changeFrequency: "weekly",
      priority: 0.8,
    },
  ];

  const workPaths = getWorkPaths();
  const dynamicPaths = await getDynamicPaths();
  return staticPaths.concat(workPaths).concat(dynamicPaths);
}

async function getDynamicPaths(): Promise<MetadataRoute.Sitemap> {
  return getAllBlogSitemap()
    .then((blogs: BlogSitemap[]): MetadataRoute.Sitemap => {
      return blogs.map((blog: BlogSitemap) => {
        return {
          url: `https://mohantyabhisek.com/blogs/${blog.slug}`,
          lastModified: blog.lastModifiedAt,
          changeFrequency: "yearly",
          priority: 0.9,
        };
      });
    })
    .catch((err) => {
      console.error("Error fetching sitemap: ", err);
      return [];
    });
}

function getWorkPaths(): MetadataRoute.Sitemap {
  return works.map((work) => {
    const galleryImages = work.gallery
      .filter((item) => !("thumbnail" in item))
      .map((image) => image.url);

    return {
      url: `https://mohantyabhisek.com/works/${work.slug}`,

      lastModified: work.lastModifiedAt,

      changeFrequency: "monthly",

      priority: 1.0,

      images: [work.featuredVideo.thumbnail.url, ...galleryImages],

      videos: [
        {
          title: work.featuredVideo.title,
          description: work.featuredVideo.description,
          thumbnail_loc: work.featuredVideo.thumbnail.url,
          content_loc: work.featuredVideo.url,
        },
      ],
    };
  });
}
