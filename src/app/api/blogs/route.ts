import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";

import type { BlogCard } from "@/features/blogs/models/blog";
import {
  getBlogCardsPage,
  getCachedBlogCardsPage,
} from "@/features/blogs/services/blog-service";
import type ErrorResponse from "@/models/error-response";
import type PageResponse from "@/models/page-response";

/**
 * Fetches a paginated list of blog cards.
 *
 * Query searches are dynamically fetched while
 * non-query pages may use cached responses.
 *
 * @param request - Incoming Next.js request object containing search params.
 * @returns JSON response containing paginated blog cards or an error message.
 */
export async function GET(
  request: NextRequest,
): Promise<NextResponse<PageResponse<BlogCard> | ErrorResponse>> {
  try {
    const searchParams = request.nextUrl.searchParams;

    const query = searchParams.get("query")?.trim();

    const rawIndex = searchParams.get("index");

    const parsedIndex = Number(rawIndex);

    const index =
      Number.isNaN(parsedIndex) || parsedIndex < 0 ? 0 : parsedIndex;

    /**
     * Query searches are dynamic.
     * Non-query pages can use cache.
     */
    const response = query
      ? await getBlogCardsPage(query, index)
      : await getCachedBlogCardsPage(index);

    return NextResponse.json(response, {
      status: 200,
    });
  } catch (error) {
    console.error("Failed to fetch blog cards page", error);

    return NextResponse.json(
      {
        message: "Failed to fetch blogs",
      },
      {
        status: 500,
      },
    );
  }
}
