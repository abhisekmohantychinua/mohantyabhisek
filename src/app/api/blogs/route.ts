import { NextRequest, NextResponse } from "next/server";

import {
  getBlogCardsPage,
  getCachedBlogCardsPage,
} from "@/services/blog-service";

export async function GET(request: NextRequest) {
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
