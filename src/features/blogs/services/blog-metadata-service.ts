import type BlogMetadata from "@/features/blogs/models/blog-metadata";
import { getMongoDb } from "@/lib/mongodb";

/**
 * Fetches blog metadata for a given slug.
 *
 * Queries the database for a blog entry matching the provided slug and
 * returns only the public metadata fields required for rendering
 * (title and description).
 *
 * @param slug - Unique identifier of the blog post.
 * @returns Blog metadata if found, otherwise `null`.
 */
export async function getBlogMetadataBySlug(
  slug: string,
): Promise<BlogMetadata | null> {
  const db = await getMongoDb();

  const doc = await db.collection("blogmetadatas").findOne(
    { slug },
    {
      projection: {
        _id: 0,
        slug: 1,
        title: 1,
        description: 1,
      },
    },
  );

  if (!doc) return null;

  return {
    slug: doc.slug,
    title: doc.title,
    description: doc.description,
  };
}
