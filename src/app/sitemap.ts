import type { MetadataRoute } from "next";

import type { BlogSitemap } from "@/features/blogs/models/blog";
import type BlogCategory from "@/features/blogs/models/blog-category";
import { getCachedAllBlogCategory } from "@/features/blogs/services/blog-category-service";
import { getAllBlogSitemap } from "@/features/blogs/services/blog-service";
import { works } from "@/features/works/store/works-store";

const SITE_URL = "https://mohantyabhisek.com";

export const revalidate = 86400; // 24 hours in seconds

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const staticPaths: MetadataRoute.Sitemap = [
    {
      url: SITE_URL,
      lastModified: new Date("2026-01-22T16:02:59.617Z"),
      changeFrequency: "monthly",
      priority: 1.0,
    },
    {
      url: `${SITE_URL}/contact`,
      lastModified: new Date("2026-01-22T16:02:59.617Z"),
      changeFrequency: "yearly",
      priority: 0.8,
    },
    {
      url: `${SITE_URL}/blogs`,
      lastModified: new Date("2026-02-15T12:00:00.000Z"),
      changeFrequency: "weekly",
      priority: 0.8,
    },
    {
      url: `${SITE_URL}/blogs/categories`,
      lastModified: new Date("2026-10-24T00:00:00.000Z"),
      changeFrequency: "weekly",
      priority: 0.7,
    },
    {
      url: `${SITE_URL}/works`,
      lastModified: new Date("2026-07-15T12:00:00.000Z"),
      changeFrequency: "weekly",
      priority: 0.8,
    },
  ];

  const workPaths = getWorkPaths();
  const [dynamicPaths, blogCategoryPaths] = await Promise.all([
    getDynamicPaths(),
    getBlogCategoryPaths(),
  ]);
  return staticPaths
    .concat(workPaths)
    .concat(dynamicPaths)
    .concat(blogCategoryPaths);
}

async function getDynamicPaths(): Promise<MetadataRoute.Sitemap> {
  return getAllBlogSitemap()
    .then((blogs: BlogSitemap[]): MetadataRoute.Sitemap => {
      return blogs.map((blog: BlogSitemap) => {
        return {
          url: `${SITE_URL}/blogs/${blog.slug}`,
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

async function getBlogCategoryPaths(): Promise<MetadataRoute.Sitemap> {
  return getCachedAllBlogCategory()
    .then((categories: BlogCategory[]): MetadataRoute.Sitemap => {
      return categories.map((category: BlogCategory) => ({
        url: `${SITE_URL}/blogs/categories/${category.slug}`,
        lastModified: category.lastModifiedAt,
        changeFrequency: "monthly",
        priority: 0.7,
      }));
    })
    .catch((error: unknown) => {
      console.error("Error fetching blog category sitemap entries: ", error);
      return [];
    });
}

function getWorkPaths(): MetadataRoute.Sitemap {
  return works.map((work) => {
    const galleryImages = work.gallery
      .filter((item) => !("thumbnail" in item))
      .map((image) => `${SITE_URL}${image.url}`);

    return {
      url: `${SITE_URL}/works/${work.slug}`,

      lastModified: work.lastModifiedAt,

      changeFrequency: "monthly",

      priority: 1.0,

      images: [
        `${SITE_URL}${work.featuredVideo.thumbnail.url}`,
        ...galleryImages,
      ],

      videos: [
        {
          title: work.featuredVideo.title,
          description: work.featuredVideo.description,
          thumbnail_loc: `${SITE_URL}${work.featuredVideo.thumbnail.url}`,
          content_loc: `${SITE_URL}${work.featuredVideo.url}`,
        },
      ],
    };
  });
}
