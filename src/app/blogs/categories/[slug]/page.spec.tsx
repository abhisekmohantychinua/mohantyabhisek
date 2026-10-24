import { renderToStaticMarkup } from "react-dom/server";
import { beforeEach, describe, expect, test, vi } from "vitest";

const {
  getBlogCategoryBySlugMock,
  getCachedBlogCardsByCategorySlugMock,
  getCachedAllBlogCategoryMock,
  notFoundMock,
} = vi.hoisted(() => ({
  getBlogCategoryBySlugMock: vi.fn(),
  getCachedBlogCardsByCategorySlugMock: vi.fn(),
  getCachedAllBlogCategoryMock: vi.fn(),
  notFoundMock: vi.fn(() => {
    throw new Error("NOT_FOUND");
  }),
}));

vi.mock("next/navigation", () => ({
  notFound: notFoundMock,
}));

vi.mock("@/features/blogs/services/blog-category-service", () => ({
  getBlogCategoryBySlug: getBlogCategoryBySlugMock,
  getCachedAllBlogCategory: getCachedAllBlogCategoryMock,
}));

vi.mock("@/features/blogs/services/blog-service", () => ({
  getCachedBlogCardsByCategorySlug: getCachedBlogCardsByCategorySlugMock,
}));

import BlogCategoryPage, {
  generateMetadata,
  generateStaticParams,
} from "./page";

const category = {
  slug: "web-development",
  title: "Web Development",
  description: "Articles about web development.",
  createdAt: new Date("2026-01-01"),
  lastModifiedAt: new Date("2026-02-01"),
};

describe("blog category detail page", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  test("fetches the category and renders its category JSON-LD", async () => {
    getBlogCategoryBySlugMock.mockResolvedValue(category);
    getCachedBlogCardsByCategorySlugMock.mockResolvedValue([
      {
        slug: "website-guide",
        title: "A Website Guide",
        description: "A guide for websites.",
        postedAt: new Date("2026-02-01"),
      },
    ]);

    const markup = renderToStaticMarkup(
      await BlogCategoryPage({
        params: Promise.resolve({ slug: category.slug }),
      }),
    );
    const jsonLdMarkup = markup.match(
      /<script type="application\/ld\+json">(.*?)<\/script>/,
    )?.[1];
    const jsonLd = JSON.parse(jsonLdMarkup ?? "{}");

    expect(getBlogCategoryBySlugMock).toHaveBeenCalledWith(category.slug);
    expect(getCachedBlogCardsByCategorySlugMock).toHaveBeenCalledWith(
      category.slug,
    );
    expect(markup).toContain("A Website Guide");
    expect(markup).toContain("/blogs/website-guide");
    expect(markup).toContain("Articles about web development.");
    expect(jsonLd).toMatchObject({
      "@type": "CollectionPage",
      url: "https://mohantyabhisek.com/blogs/categories/web-development",
      name: category.title,
      mainEntity: {
        "@type": "DefinedTerm",
        name: category.title,
        description: category.description,
      },
    });
  });

  test("returns category-specific canonical metadata", async () => {
    getBlogCategoryBySlugMock.mockResolvedValue(category);

    const result = await generateMetadata({
      params: Promise.resolve({ slug: category.slug }),
    });

    expect(result).toMatchObject({
      title: "Web Development | Blog Category | Abhisek",
      description: category.description,
      alternates: {
        canonical:
          "https://mohantyabhisek.com/blogs/categories/web-development",
      },
    });
  });

  test("generates static params from all categories", async () => {
    getCachedAllBlogCategoryMock.mockResolvedValue([category]);

    await expect(generateStaticParams()).resolves.toEqual([
      { slug: category.slug },
    ]);
  });

  test("calls notFound when the category does not exist", async () => {
    getBlogCategoryBySlugMock.mockResolvedValue(null);

    await expect(
      BlogCategoryPage({
        params: Promise.resolve({ slug: "missing" }),
      }),
    ).rejects.toThrow("NOT_FOUND");

    expect(notFoundMock).toHaveBeenCalledOnce();
  });
});
