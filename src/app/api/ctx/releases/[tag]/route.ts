import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";

import { GitHubServiceError } from "@/features/ctx/models/github-service-error";
import { getGitHubReleaseVerbose } from "@/features/ctx/services/github-service";
import type ErrorResponse from "@/models/error-response";

interface RouteContext {
  params: Promise<{
    tag: string;
  }>;
}

/**
 * Retrieves a published CTX CLI release by its tag.
 *
 * Fetches release details from GitHub and returns the release
 * in the public API format.
 *
 * @param _request - Incoming HTTP request.
 * @param context - Dynamic route parameters containing the release tag.
 * @param context.params
 * @returns A JSON response containing the release or an error.
 */
export async function GET(
  _request: NextRequest,
  { params }: RouteContext,
): Promise<NextResponse> {
  const { tag } = await params;

  try {
    const release = await getGitHubReleaseVerbose(tag);

    return NextResponse.json(release, {
      status: 200,
      headers: {
        "Cache-Control": "private, no-store",
      },
    });
  } catch (error: unknown) {
    console.error("Failed to retrieve CTX CLI release", error);

    if (error instanceof GitHubServiceError) {
      return NextResponse.json<ErrorResponse>(
        {
          message:
            error.status >= 500
              ? "Failed to retrieve the CTX CLI release"
              : error.message,
        },
        {
          status: error.status,
        },
      );
    }

    return NextResponse.json<ErrorResponse>(
      {
        message: "Failed to retrieve the CTX CLI release",
      },
      {
        status: 500,
      },
    );
  }
}
