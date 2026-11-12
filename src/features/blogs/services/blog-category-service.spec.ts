import { beforeEach, describe, expect, test, vi } from "vitest";

import { getMongoDb } from "@/lib/mongodb";

import {
  getAllBlogCategory,
  getBlogCategoryBySlug,
  getCachedAllBlogCategory,
} from "./blog-category-service";

const { unstableCacheMock } = vi.hoisted(() => ({
  unstableCacheMock: vi.fn((callback) => callback),
}));

const toArrayMock = vi.fn();
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

describe("blog-category-service", () => {
  beforeEach(() => {
    vi.clearAllMocks();

    sortMock.mockReturnValue({
      toArray: toArrayMock,
    });

    findMock.mockReturnValue({
      sort: sortMock,
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

  test("gets all categories sorted by latest modification", async () => {
    const categories = [
      {
        slug: "web-development",
        title: "Web Development",
        description: "Articles about web development.",
        createdAt: new Date("2026-01-01"),
        lastModifiedAt: new Date("2026-02-01"),
      },
    ];
    toArrayMock.mockResolvedValue(categories);

    const result = await getAllBlogCategory();

    expect(collectionMock).toHaveBeenCalledWith("blogcategories");
    expect(findMock).toHaveBeenCalledWith(
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
    );
    expect(sortMock).toHaveBeenCalledWith({ lastModifiedAt: -1 });
    expect(result).toEqual(categories);
  });

  test("caches all categories for one day", async () => {
    toArrayMock.mockResolvedValue([]);

    await getCachedAllBlogCategory();

    expect(unstableCacheMock).toHaveBeenCalledWith(
      expect.any(Function),
      ["blog-categories"],
      { revalidate: 86400 },
    );
  });

  test("gets a category by slug", async () => {
    const category = {
      slug: "web-development",
      title: "Web Development",
      description: "Articles about web development.",
      createdAt: new Date("2026-01-01"),
      lastModifiedAt: new Date("2026-02-01"),
    };
    findOneMock.mockResolvedValue(category);

    const result = await getBlogCategoryBySlug("web-development");

    expect(collectionMock).toHaveBeenCalledWith("blogcategories");
    expect(findOneMock).toHaveBeenCalledWith(
      { slug: "web-development" },
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
    expect(result).toEqual(category);
  });

  test("returns null when no category matches the slug", async () => {
    findOneMock.mockResolvedValue(null);

    await expect(getBlogCategoryBySlug("missing")).resolves.toBeNull();
  });
});
