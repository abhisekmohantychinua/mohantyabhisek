import { unstable_cache } from "next/cache";

import type BlogCategory from "@/features/blogs/models/blog-category";
import { getMongoDb } from "@/lib/mongodb";

/**
 * Fetches all blog categories, ordered by their most recent modification.
 *
 * @returns All blog categories, newest modification first.
 */
export async function getAllBlogCategory(): Promise<BlogCategory[]> {
  const db = await getMongoDb();

  const categories = await db
    .collection("blogcategories")
    .find(
      {},
      {
        projection: {
          _id: 0,
          slug: 1,
          title: 1,
          description: 1,
          createdAt: 1,
          lastModifiedAt: 1,
        },
      },
    )
    .sort({ lastModifiedAt: -1 })
    .toArray();

  return categories.map(
    ({ slug, title, description, createdAt, lastModifiedAt }) => ({
      slug,
      title,
      description,
      createdAt,
      lastModifiedAt,
    }),
  );
}

/**
 * Fetches and caches all blog categories for one day.
 *
 * @returns All blog categories, newest modification first.
 */
export async function getCachedAllBlogCategory(): Promise<BlogCategory[]> {
  return unstable_cache(async () => getAllBlogCategory(), ["blog-categories"], {
    revalidate: 86400,
  })();
}

/**
 * Fetches a blog category by its slug.
 *
 * @param slug - Unique identifier of the category.
 * @returns The matching category, or `null` when it does not exist.
 */
export async function getBlogCategoryBySlug(
  slug: string,
): Promise<BlogCategory | null> {
  const db = await getMongoDb();

  const category = await db.collection("blogcategories").findOne(
    { slug },
    {
      projection: {
        _id: 0,
        slug: 1,
        title: 1,
        description: 1,
        createdAt: 1,
        lastModifiedAt: 1,
      },
    },
  );

  if (!category) {
    return null;
  }

  return {
    slug: category.slug,
    title: category.title,
    description: category.description,
    createdAt: category.createdAt,
    lastModifiedAt: category.lastModifiedAt,
  };
}
