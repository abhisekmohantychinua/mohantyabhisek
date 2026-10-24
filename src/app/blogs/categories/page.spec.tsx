import { renderToStaticMarkup } from "react-dom/server";
import { beforeEach, describe, expect, test, vi } from "vitest";

const { getCachedAllBlogCategoryMock } = vi.hoisted(() => ({
  getCachedAllBlogCategoryMock: vi.fn(),
}));

vi.mock("@/features/blogs/services/blog-category-service", () => ({
  getCachedAllBlogCategory: getCachedAllBlogCategoryMock,
}));

import BlogCategoriesPage, { metadata } from "./page";

describe("blog categories page", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  test("loads categories and renders the category collection JSON-LD", async () => {
    getCachedAllBlogCategoryMock.mockResolvedValue([
      {
        slug: "web-development",
        title: "Web Development",
        description: "Articles about web development.",
        createdAt: new Date("2026-01-01"),
        lastModifiedAt: new Date("2026-02-01"),
      },
    ]);

    const markup = renderToStaticMarkup(await BlogCategoriesPage());
    const jsonLdMarkup = markup.match(
      /<script type="application\/ld\+json">(.*?)<\/script>/,
    )?.[1];
    const jsonLd = JSON.parse(jsonLdMarkup ?? "{}");

    expect(getCachedAllBlogCategoryMock).toHaveBeenCalledOnce();
    expect(markup).toContain("Explore Blog");
    expect(markup).toContain("Web Development");
    expect(markup).toContain("/blogs/categories/web-development");
    expect(jsonLd).toMatchObject({
      "@type": "CollectionPage",
      url: "https://mohantyabhisek.com/blogs/categories",
      mainEntity: {
        "@type": "ItemList",
        itemListElement: [
          {
            "@type": "ListItem",
            position: 1,
            url: "https://mohantyabhisek.com/blogs/categories/web-development",
            name: "Web Development",
          },
        ],
      },
    });
  });

  test("provides canonical metadata for the category collection", () => {
    expect(metadata.alternates?.canonical).toBe(
      "https://mohantyabhisek.com/blogs/categories",
    );
    expect(metadata.title).toBe("Blog Categories | Abhisek");
  });
});
