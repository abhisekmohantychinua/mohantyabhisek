import { beforeEach, describe, expect, test, vi } from "vitest";

import { fetchBlogCardsPage } from "./blog-api-service";

describe("blog-client-service", () => {
  beforeEach(() => {
    vi.restoreAllMocks();
  });

  describe("fetchBlogCardsPage", () => {
    test("fetches the requested page", async () => {
      const signal = new AbortController().signal;

      const fetchMock = vi.spyOn(global, "fetch").mockResolvedValue(
        new Response(
          JSON.stringify({
            items: [],
            currentIndex: 2,
            isLastIndex: true,
          }),
          {
            status: 200,
            headers: {
              "Content-Type": "application/json",
            },
          },
        ),
      );

      await fetchBlogCardsPage(2, signal);

      expect(fetchMock).toHaveBeenCalledWith("/api/blogs?index=2", {
        signal,
      });
    });

    test("includes the search query when provided", async () => {
      const signal = new AbortController().signal;

      const fetchMock = vi.spyOn(global, "fetch").mockResolvedValue(
        new Response(
          JSON.stringify({
            items: [],
            currentIndex: 0,
            isLastIndex: true,
          }),
          {
            status: 200,
            headers: {
              "Content-Type": "application/json",
            },
          },
        ),
      );

      await fetchBlogCardsPage(0, signal, "react");

      expect(fetchMock).toHaveBeenCalledWith("/api/blogs?index=0&query=react", {
        signal,
      });
    });

    test("passes the abort signal to fetch", async () => {
      const controller = new AbortController();

      const fetchMock = vi.spyOn(global, "fetch").mockResolvedValue(
        new Response(
          JSON.stringify({
            items: [],
            currentIndex: 1,
            isLastIndex: true,
          }),
          {
            status: 200,
            headers: {
              "Content-Type": "application/json",
            },
          },
        ),
      );

      await fetchBlogCardsPage(1, controller.signal);

      expect(fetchMock).toHaveBeenCalledWith(expect.any(String), {
        signal: controller.signal,
      });
    });

    test("returns the parsed response body", async () => {
      const response = {
        items: [
          {
            slug: "blog-1",
            title: "Blog 1",
            description: "Description 1",
            postedAt: "2025-01-01",
          },
        ],
        currentIndex: 0,
        isLastIndex: true,
      };

      vi.spyOn(global, "fetch").mockResolvedValue(
        new Response(JSON.stringify(response), {
          status: 200,
          headers: {
            "Content-Type": "application/json",
          },
        }),
      );

      const result = await fetchBlogCardsPage(0, new AbortController().signal);

      expect(result).toEqual(response);
    });

    test("throws when the request fails", async () => {
      vi.spyOn(global, "fetch").mockResolvedValue(
        new Response(null, {
          status: 500,
        }),
      );

      await expect(
        fetchBlogCardsPage(0, new AbortController().signal),
      ).rejects.toThrow("Failed to fetch blog cards.");
    });
  });
});
