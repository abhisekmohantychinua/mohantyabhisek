import { beforeEach, describe, expect, test, vi } from "vitest";

import { getMongoDb } from "@/lib/mongodb";

import {
  getAllBlogSitemap,
  getAllBlogSlugs,
  getBlogCardsPage,
  getBySlug,
  getCachedBlogCardsPage,
  getLatestThreeBlogCardsExceptSlug,
} from "./blog-service";

const { unstableCacheMock } = vi.hoisted(() => ({
  unstableCacheMock: vi.fn((callback) => callback),
}));

const toArrayMock = vi.fn();
const limitMock = vi.fn();
const skipMock = vi.fn();
const sortMock = vi.fn();
const findMock = vi.fn();
const findOneMock = vi.fn();
const collectionMock = vi.fn();

vi.mock("next/cache", () => ({
  unstable_cache: unstableCacheMock,
}));

vi.mock("@/lib/mongodb", () => ({
  getMongoDb: vi.fn(),
}));

describe("blog-service", () => {
  beforeEach(() => {
    vi.clearAllMocks();

    limitMock.mockReturnValue({
      toArray: toArrayMock,
    });

    skipMock.mockReturnValue({
      limit: limitMock,
    });

    sortMock.mockReturnValue({
      skip: skipMock,
      limit: limitMock,
    });

    findMock.mockReturnValue({
      sort: sortMock,
      skip: skipMock,
      limit: limitMock,
      toArray: toArrayMock,
    });

    collectionMock.mockReturnValue({
      find: findMock,
      findOne: findOneMock,
    });

    vi.mocked(getMongoDb).mockResolvedValue({
      collection: collectionMock,
    } as never);
  });

  describe("getCachedBlogCardsPage", () => {
    test("uses unstable_cache with the expected cache key and revalidation period", async () => {
      toArrayMock.mockResolvedValue([]);

      await getCachedBlogCardsPage(2);

      expect(unstableCacheMock).toHaveBeenCalledTimes(1);

      expect(unstableCacheMock).toHaveBeenCalledWith(
        expect.any(Function),
        ["blog-page-2"],
        {
          revalidate: 86400,
        },
      );
    });

    test("normalizes a negative index before generating the cache key", async () => {
      toArrayMock.mockResolvedValue([]);

      await getCachedBlogCardsPage(-1);

      expect(unstableCacheMock).toHaveBeenCalledWith(
        expect.any(Function),
        ["blog-page-0"],
        {
          revalidate: 86400,
        },
      );
    });

    test("uses page zero when index is undefined", async () => {
      toArrayMock.mockResolvedValue([]);

      await getCachedBlogCardsPage();

      expect(unstableCacheMock).toHaveBeenCalledWith(
        expect.any(Function),
        ["blog-page-0"],
        {
          revalidate: 86400,
        },
      );
    });

    test("returns the result from getBlogCardsPage", async () => {
      toArrayMock.mockResolvedValue([
        {
          slug: "blog-1",
          title: "Blog 1",
          description: "Description 1",
          postedAt: new Date("2025-01-01"),
        },
      ]);

      const result = await getCachedBlogCardsPage(0);

      expect(result).toEqual({
        items: [
          {
            slug: "blog-1",
            title: "Blog 1",
            description: "Description 1",
            postedAt: new Date("2025-01-01"),
          },
        ],
        currentIndex: 0,
        isLastIndex: true,
      });
    });
  });

  describe("getBlogCardsPage", () => {
    test("returns the first page when index is undefined", async () => {
      toArrayMock.mockResolvedValue([]);

      const result = await getBlogCardsPage();

      expect(skipMock).toHaveBeenCalledWith(0);

      expect(result).toEqual({
        items: [],
        currentIndex: 0,
        isLastIndex: true,
      });
    });

    test("normalizes a negative index to zero", async () => {
      toArrayMock.mockResolvedValue([]);

      const result = await getBlogCardsPage(-1);

      expect(skipMock).toHaveBeenCalledWith(0);

      expect(result.currentIndex).toBe(0);
    });

    test("queries only published blogs when no search query is provided", async () => {
      toArrayMock.mockResolvedValue([]);

      await getBlogCardsPage();

      expect(findMock).toHaveBeenCalledWith(
        {
          status: "PUBLISHED",
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
      );
    });

    test("filters by slug and title when a search query is provided", async () => {
      toArrayMock.mockResolvedValue([]);

      await getBlogCardsPage("react");

      const filter = findMock.mock.calls[0][0];

      expect(filter.status).toBe("PUBLISHED");

      expect(filter.$or).toHaveLength(2);

      expect(filter.$or[0].slug.$regex).toBeInstanceOf(RegExp);
      expect(filter.$or[1].title.$regex).toBeInstanceOf(RegExp);

      expect(filter.$or[0].slug.$regex.source).toBe("react");
      expect(filter.$or[0].slug.$regex.flags).toContain("i");
    });

    test("sorts blogs by latest post date first", async () => {
      toArrayMock.mockResolvedValue([]);

      await getBlogCardsPage();

      expect(sortMock).toHaveBeenCalledWith({
        postedAt: -1,
      });
    });

    test("returns blog cards mapped from database documents", async () => {
      const postedAt = new Date("2025-01-01");

      toArrayMock.mockResolvedValue([
        {
          slug: "blog-1",
          title: "Blog 1",
          description: "Description 1",
          postedAt,
        },
      ]);

      const result = await getBlogCardsPage();

      expect(result.items).toEqual([
        {
          slug: "blog-1",
          title: "Blog 1",
          description: "Description 1",
          postedAt,
        },
      ]);
    });

    test("marks the page as last when item count does not exceed the page limit", async () => {
      const blogs = Array.from({ length: 12 }, (_, index) => ({
        slug: `blog-${index}`,
        title: `Blog ${index}`,
        description: `Description ${index}`,
        postedAt: new Date(),
      }));

      toArrayMock.mockResolvedValue(blogs);

      const result = await getBlogCardsPage();

      expect(result.items).toHaveLength(12);
      expect(result.isLastIndex).toBe(true);
    });

    test("marks the page as not last when more than the page limit exists", async () => {
      const blogs = Array.from({ length: 13 }, (_, index) => ({
        slug: `blog-${index}`,
        title: `Blog ${index}`,
        description: `Description ${index}`,
        postedAt: new Date(),
      }));

      toArrayMock.mockResolvedValue(blogs);

      const result = await getBlogCardsPage();

      expect(result.items).toHaveLength(12);
      expect(result.isLastIndex).toBe(false);
    });

    test("uses the requested page index to calculate skip", async () => {
      toArrayMock.mockResolvedValue([]);

      await getBlogCardsPage(2);

      expect(skipMock).toHaveBeenCalledWith(24);
    });

    test("supports a search query with pagination", async () => {
      toArrayMock.mockResolvedValue([]);

      await getBlogCardsPage("nextjs", 3);

      expect(skipMock).toHaveBeenCalledWith(36);

      const filter = findMock.mock.calls[0][0];

      expect(filter.status).toBe("PUBLISHED");
    });
  });

  describe("getLatestThreeBlogCardsExceptSlug", () => {
    test("queries published blogs excluding the provided slug", async () => {
      toArrayMock.mockResolvedValue([]);

      await getLatestThreeBlogCardsExceptSlug("current-blog");

      expect(findMock).toHaveBeenCalledWith(
        {
          status: "PUBLISHED",
          slug: {
            $ne: "current-blog",
          },
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
      );
    });

    test("sorts blogs by latest post date first", async () => {
      toArrayMock.mockResolvedValue([]);

      await getLatestThreeBlogCardsExceptSlug("current-blog");

      expect(sortMock).toHaveBeenCalledWith({
        postedAt: -1,
      });
    });

    test("limits the result to three blogs", async () => {
      toArrayMock.mockResolvedValue([]);

      await getLatestThreeBlogCardsExceptSlug("current-blog");

      expect(limitMock).toHaveBeenCalledWith(3);
    });

    test("returns mapped blog cards", async () => {
      const firstPostedAt = new Date("2025-01-01");
      const secondPostedAt = new Date("2025-01-02");

      toArrayMock.mockResolvedValue([
        {
          slug: "blog-1",
          title: "Blog 1",
          description: "Description 1",
          postedAt: firstPostedAt,
        },
        {
          slug: "blog-2",
          title: "Blog 2",
          description: "Description 2",
          postedAt: secondPostedAt,
        },
      ]);

      const result = await getLatestThreeBlogCardsExceptSlug("current-blog");

      expect(result).toEqual([
        {
          slug: "blog-1",
          title: "Blog 1",
          description: "Description 1",
          postedAt: firstPostedAt,
        },
        {
          slug: "blog-2",
          title: "Blog 2",
          description: "Description 2",
          postedAt: secondPostedAt,
        },
      ]);
    });

    test("returns an empty array when no blogs are found", async () => {
      toArrayMock.mockResolvedValue([]);

      const result = await getLatestThreeBlogCardsExceptSlug("current-blog");

      expect(result).toEqual([]);
    });
  });

  describe("getBySlug", () => {
    test("queries a published blog by slug", async () => {
      findOneMock.mockResolvedValue(null);

      await getBySlug("my-blog");

      expect(findOneMock).toHaveBeenCalledWith(
        {
          slug: "my-blog",
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
    });

    test("returns a blog when a matching document exists", async () => {
      const postedAt = new Date("2025-01-01");
      const lastModifiedAt = new Date("2025-01-15");

      findOneMock.mockResolvedValue({
        slug: "my-blog",
        title: "My Blog",
        description: "Blog description",
        content: "# Blog Content",
        topics: ["react", "nextjs"],
        faqs: [
          {
            question: "Question 1",
            answer: "Answer 1",
          },
        ],
        postedAt,
        lastModifiedAt,
      });

      const result = await getBySlug("my-blog");

      expect(result).toEqual({
        slug: "my-blog",
        title: "My Blog",
        description: "Blog description",
        content: "# Blog Content",
        topics: ["react", "nextjs"],
        faqs: [
          {
            question: "Question 1",
            answer: "Answer 1",
          },
        ],
        postedAt,
        lastModifiedAt,
      });
    });

    test("returns null when the blog is not found", async () => {
      findOneMock.mockResolvedValue(null);

      const result = await getBySlug("missing-blog");

      expect(result).toBeNull();
    });

    test("preserves date fields from the database document", async () => {
      const postedAt = new Date("2025-01-01T10:00:00.000Z");
      const lastModifiedAt = new Date("2025-01-15T15:30:00.000Z");

      findOneMock.mockResolvedValue({
        slug: "my-blog",
        title: "My Blog",
        description: "Blog description",
        content: "Content",
        topics: [],
        faqs: [],
        postedAt,
        lastModifiedAt,
      });

      const result = await getBySlug("my-blog");

      expect(result?.postedAt).toBe(postedAt);
      expect(result?.lastModifiedAt).toBe(lastModifiedAt);
    });
  });

  describe("getAllBlogSitemap", () => {
    test("queries all published blogs", async () => {
      toArrayMock.mockResolvedValue([]);

      await getAllBlogSitemap();

      expect(findMock).toHaveBeenCalledWith(
        {
          status: "PUBLISHED",
        },
        {
          projection: {
            _id: 0,
            slug: 1,
            lastModifiedAt: 1,
          },
        },
      );
    });

    test("returns sitemap entries mapped from database documents", async () => {
      const firstModifiedAt = new Date("2025-01-01");
      const secondModifiedAt = new Date("2025-02-01");

      toArrayMock.mockResolvedValue([
        {
          slug: "first-blog",
          lastModifiedAt: firstModifiedAt,
        },
        {
          slug: "second-blog",
          lastModifiedAt: secondModifiedAt,
        },
      ]);

      const result = await getAllBlogSitemap();

      expect(result).toEqual([
        {
          slug: "first-blog",
          lastModifiedAt: firstModifiedAt,
        },
        {
          slug: "second-blog",
          lastModifiedAt: secondModifiedAt,
        },
      ]);
    });

    test("returns an empty array when no blogs are found", async () => {
      toArrayMock.mockResolvedValue([]);

      const result = await getAllBlogSitemap();

      expect(result).toEqual([]);
    });
  });

  describe("getAllBlogSlugs", () => {
    test("queries all published blogs", async () => {
      toArrayMock.mockResolvedValue([]);

      await getAllBlogSlugs();

      expect(findMock).toHaveBeenCalledWith(
        {
          status: "PUBLISHED",
        },
        {
          projection: {
            _id: 0,
            slug: 1,
          },
        },
      );
    });

    test("returns all blog slugs", async () => {
      toArrayMock.mockResolvedValue([
        {
          slug: "first-blog",
        },
        {
          slug: "second-blog",
        },
        {
          slug: "third-blog",
        },
      ]);

      const result = await getAllBlogSlugs();

      expect(result).toEqual(["first-blog", "second-blog", "third-blog"]);
    });

    test("returns an empty array when no blogs are found", async () => {
      toArrayMock.mockResolvedValue([]);

      const result = await getAllBlogSlugs();

      expect(result).toEqual([]);
    });
  });
});
