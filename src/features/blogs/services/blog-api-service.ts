import type PageResponse from "@/models/page-response";

import type { BlogCard } from "../models/blog";

/**
 * Fetches a paginated list of blog cards from the blogs API.
 *
 * Supports optional search queries and request cancellation.
 *
 * @param index - Zero-based page index.
 * @param signal - Abort signal used to cancel the request.
 * @param query - Optional search query.
 * @returns Promise resolving to a paginated blog card response.
 */
export async function fetchBlogCardsPage(
  index: number,
  signal: AbortSignal,
  query?: string,
): Promise<PageResponse<BlogCard>> {
  const searchParams = new URLSearchParams();

  searchParams.set("index", String(index));

  if (query) {
    searchParams.set("query", query);
  }

  return fetch(`/api/blogs?${searchParams.toString()}`, {
    signal,
  }).then((response) => {
    if (!response.ok) {
      throw new Error("Failed to fetch blog cards.");
    }

    return response.json();
  });
}
