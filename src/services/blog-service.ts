import { getMongoDb } from "@/lib/mongodb";
import Blog, { BlogCard, BlogSitemap } from "@/models/blog";
import PageResponse from "@/models/page-response";
import { Filter } from "mongodb";
import { unstable_cache } from "next/cache";

const PAGE_LIMIT = 12;

export async function getCachedBlogCardsPage(
  index?: number,
): Promise<PageResponse<BlogCard>> {
  const normalizedIndex = index === undefined || index < 0 ? 0 : index;

  return unstable_cache(
    async () => getBlogCardsPage(normalizedIndex),
    [`blog-page-${normalizedIndex}`],
    {
      revalidate: 86400,
    },
  )();
}

export async function getBlogCardsPage(
  index?: number,
): Promise<PageResponse<BlogCard>>;
export async function getBlogCardsPage(
  query: string,
  index?: number,
): Promise<PageResponse<BlogCard>>;

export async function getBlogCardsPage(
  queryOrIndex?: string | number,
  index?: number,
): Promise<PageResponse<BlogCard>> {
  let query: string | undefined;

  // Handle overloads
  if (typeof queryOrIndex === "string") {
    query = queryOrIndex;
  } else {
    index = queryOrIndex;
  }

  if (!index || index < 0) {
    index = 0;
  }
  const skip = index * PAGE_LIMIT;

  let filter;

  if (query) {
    const regex = new RegExp(query, "i");

    filter = {
      status: "PUBLISHED",
      $or: [{ slug: { $regex: regex } }, { title: { $regex: regex } }],
    };
  } else {
    filter = {
      status: "PUBLISHED",
    };
  }

  const db = await getMongoDb();

  const blogs = await db
    .collection("blogs")
    .find(filter, {
      projection: {
        _id: 0,
        slug: 1,
        title: 1,
        description: 1,
        postedAt: 1,
      },
    })
    .sort({ postedAt: -1 }) // latest first
    .skip(skip)
    .limit(PAGE_LIMIT + 1)
    .toArray();

  const hasMore = blogs.length > PAGE_LIMIT;

  return {
    items: (hasMore ? blogs.slice(0, PAGE_LIMIT) : blogs).map(
      ({ slug, title, description, postedAt }) => ({
        slug,
        title,
        description,
        postedAt,
      }),
    ),
    currentIndex: index,
    isLastIndex: !hasMore,
  };
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

export async function getAllBlogSlugs(): Promise<string[]> {
  const db = await getMongoDb();

  const blogs = await db
    .collection("blogs")
    .find(
      {
        status: "PUBLISHED",
      },
      {
        projection: {
          _id: 0,
          slug: 1,
        },
      },
    )
    .toArray();

  return blogs.map((blog) => blog.slug);
}
