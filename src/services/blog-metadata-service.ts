import { getMongoDb } from "@/lib/mongodb";
import BlogMetadata from "@/models/blog-metadata";

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
