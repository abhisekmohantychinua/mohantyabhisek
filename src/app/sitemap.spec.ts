import { beforeEach, describe, expect, test, vi } from "vitest";

const { getAllBlogSitemapMock } = vi.hoisted(() => ({
  getAllBlogSitemapMock: vi.fn(),
}));

vi.mock("@/features/blogs/services/blog-service", () => ({
  getAllBlogSitemap: getAllBlogSitemapMock,
}));

vi.mock("@/features/works/store/works-store", () => ({
  works: [
    {
      slug: "sample-work",

      lastModifiedAt: new Date("2026-07-01T00:00:00.000Z"),

      featuredVideo: {
        url: "https://example.com/video.mp4",
        title: "Featured Video",
        description: "Featured video description",
        thumbnail: {
          url: "https://example.com/thumbnail.jpg",
        },
      },

      gallery: [
        {
          url: "https://example.com/gallery-1.jpg",
        },
        {
          url: "https://example.com/gallery-2.jpg",
        },
      ],
    },
  ],
}));

import sitemap, { revalidate } from "./sitemap";

describe("sitemap", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe("revalidate", () => {
    test("revalidates once every 24 hours", () => {
      expect(revalidate).toBe(86400);
    });
  });

  describe("sitemap", () => {
    test("returns static sitemap paths", async () => {
      getAllBlogSitemapMock.mockResolvedValue([]);

      const result = await sitemap();

      expect(result).toEqual(
        expect.arrayContaining([
          expect.objectContaining({
            url: "https://mohantyabhisek.com",
          }),
          expect.objectContaining({
            url: "https://mohantyabhisek.com/contact",
          }),
          expect.objectContaining({
            url: "https://mohantyabhisek.com/blogs",
          }),
          expect.objectContaining({
            url: "https://mohantyabhisek.com/works",
          }),
        ]),
      );
    });

    test("includes work sitemap entries", async () => {
      getAllBlogSitemapMock.mockResolvedValue([]);

      const result = await sitemap();

      expect(result).toEqual(
        expect.arrayContaining([
          expect.objectContaining({
            url: "https://mohantyabhisek.com/works/sample-work",

            lastModified: new Date("2026-07-01T00:00:00.000Z"),

            changeFrequency: "monthly",

            priority: 1,

            images: [
              "https://example.com/thumbnail.jpg",
              "https://example.com/gallery-1.jpg",
              "https://example.com/gallery-2.jpg",
            ],

            videos: [
              {
                title: "Featured Video",
                description: "Featured video description",
                thumbnail_loc: "https://example.com/thumbnail.jpg",
                content_loc: "https://example.com/video.mp4",
              },
            ],
          }),
        ]),
      );
    });

    test("includes blog sitemap entries", async () => {
      const lastModifiedAt = new Date("2026-06-15T00:00:00.000Z");

      getAllBlogSitemapMock.mockResolvedValue([
        {
          slug: "react-hooks",
          lastModifiedAt,
        },
      ]);

      const result = await sitemap();

      expect(result).toEqual(
        expect.arrayContaining([
          {
            url: "https://mohantyabhisek.com/blogs/react-hooks",
            lastModified: lastModifiedAt,
            changeFrequency: "yearly",
            priority: 0.9,
          },
        ]),
      );
    });

    test("returns static and work paths when blog retrieval fails", async () => {
      const consoleErrorSpy = vi
        .spyOn(console, "error")
        .mockImplementation(() => {});

      getAllBlogSitemapMock.mockRejectedValue(
        new Error("Database unavailable"),
      );

      const result = await sitemap();

      expect(
        result.some(
          (entry) =>
            entry.url === "https://mohantyabhisek.com/works/sample-work",
        ),
      ).toBe(true);

      expect(
        result.some(
          (entry) =>
            entry.url === "https://mohantyabhisek.com/blogs/react-hooks",
        ),
      ).toBe(false);

      expect(consoleErrorSpy).toHaveBeenCalled();

      consoleErrorSpy.mockRestore();
    });

    test("combines static, work and blog sitemap entries", async () => {
      getAllBlogSitemapMock.mockResolvedValue([
        {
          slug: "blog-1",
          lastModifiedAt: new Date(),
        },
        {
          slug: "blog-2",
          lastModifiedAt: new Date(),
        },
      ]);

      const result = await sitemap();

      expect(result).toHaveLength(7);
    });
  });
});
