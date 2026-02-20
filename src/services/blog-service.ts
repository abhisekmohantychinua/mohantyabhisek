import { getMongoDb } from "@/lib/mongodb";
import Blog, { BlogCard, BlogSitemap } from "@/models/blog";

export async function getBlogCards(): Promise<BlogCard[]> {
  const db = await getMongoDb();

  const blogs = await db
    .collection("blogs")
    .find(
      { status: "PUBLISHED" },
      {
        projection: {
          _id: 0,
          slug: 1,
          title: 1,
          description: 1,
          postedAt: 1,
        },
      },
    )
    .sort({ postedAt: -1 }) // latest first
    .toArray();

  return blogs.map(({ slug, title, description, postedAt }) => ({
    slug,
    title,
    description,
    postedAt,
  }));
}

export async function getLatestThreeBlogCardsExceptSlug(
  exceptSlug: string,
): Promise<BlogCard[]> {
  const db = await getMongoDb();

  const blogs = await db
    .collection("blogs")
    .find(
      {
        status: "PUBLISHED",
        slug: { $ne: exceptSlug },
      },
      {
        projection: {
          _id: 0,
          slug: 1,
          title: 1,
          description: 1,
          postedAt: 1,
        },
      },
    )
    .sort({ postedAt: -1 })
    .limit(3)
    .toArray();

  return blogs.map(({ slug, title, description, postedAt }) => ({
    slug,
    title,
    description,
    postedAt,
  }));
}

export async function getBlogCardsByQuery(query: string): Promise<BlogCard[]> {
  const db = await getMongoDb();

  const regex = new RegExp(query, "i");

  const blogs = await db
    .collection("blogs")
    .find(
      {
        status: "PUBLISHED",
        $or: [{ slug: { $regex: regex } }, { title: { $regex: regex } }],
      },
      {
        projection: {
          _id: 0,
          slug: 1,
          title: 1,
          description: 1,
          postedAt: 1,
        },
      },
    )
    .sort({ postedAt: -1 })
    .toArray();

  return blogs.map(({ slug, title, description, postedAt }) => ({
    slug,
    title,
    description,
    postedAt,
  }));
}

export async function getBySlug(slug: string): Promise<Blog | null> {
  const db = await getMongoDb();

  const doc = await db.collection("blogs").findOne(
    {
      slug,
      status: "PUBLISHED",
    },
    {
      projection: {
        _id: 0,
        slug: 1,
        title: 1,
        description: 1,
        content: 1,
        topics: 1,
        faqs: 1,
        postedAt: 1,
        lastModifiedAt: 1,
      },
    },
  );

  if (!doc) return null;

  return {
    slug: doc.slug,
    title: doc.title,
    description: doc.description,
    content: doc.content,
    topics: doc.topics,
    faqs: doc.faqs,
    postedAt: doc.postedAt,
    lastModifiedAt: doc.lastModifiedAt,
  };
}

export async function getAllBlogSitemap(): Promise<BlogSitemap[]> {
  const db = await getMongoDb();

  const blogs = await db
    .collection("blogs")
    .find(
      { status: "PUBLISHED" },
      {
        projection: {
          _id: 0,
          slug: 1,
          lastModifiedAt: 1,
        },
      },
    )
    .toArray();

  return blogs.map(({ slug, lastModifiedAt }) => ({
    slug,
    lastModifiedAt,
  }));
}
