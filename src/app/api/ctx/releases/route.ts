import { NextResponse } from "next/server";

import { GitHubServiceError } from "@/features/ctx/models/github-service-error";
import { getGitHubReleases } from "@/features/ctx/services/github-service";
import type ErrorResponse from "@/models/error-response";

/**
 * Retrieves published CTX CLI releases.
 *
 * Fetches release metadata from GitHub and returns the published
 * releases in the public API format.
 *
 * @returns A JSON response containing published releases or an error.
 */
export async function GET(): Promise<NextResponse> {
  try {
    const releases = await getGitHubReleases();

    return NextResponse.json(releases, {
      status: 200,
      headers: {
        "Cache-Control": "private, no-store",
      },
    });
  } catch (error: unknown) {
    console.error("Failed to retrieve CTX CLI releases", error);

    if (error instanceof GitHubServiceError) {
      return NextResponse.json<ErrorResponse>(
        {
          message:
            error.status >= 500
              ? "Failed to retrieve CTX CLI releases"
              : error.message,
        },
        {
          status: error.status,
        },
      );
    }

    return NextResponse.json<ErrorResponse>(
      {
        message: "Failed to retrieve CTX CLI releases",
      },
      {
        status: 500,
      },
    );
  }
}
