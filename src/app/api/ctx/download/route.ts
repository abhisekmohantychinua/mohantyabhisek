import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";

import { GitHubServiceError } from "@/features/ctx/models/github-service-error";
import { downloadParamsSchema } from "@/features/ctx/schemas/download-params-schema";
import {
  getDownloadableArtifact,
  getGitHubRelease,
} from "@/features/ctx/services/github-service";
import type ErrorResponse from "@/models/error-response";

/**
 * Downloads a CTX CLI release artifact for the requested architecture.
 *
 * Validates the query parameters, retrieves the requested GitHub release,
 * resolves the matching asset, and streams the binary to the client.
 *
 * @param request - Incoming Next.js request containing download parameters.
 * @returns A streamed binary response or a JSON error response.
 */
export async function GET(request: NextRequest): Promise<NextResponse> {
  try {
    const searchParams = request.nextUrl.searchParams;

    const parsedParams = downloadParamsSchema.safeParse({
      arch: searchParams.get("arch"),
      version: searchParams.get("version") ?? undefined,
    });

    if (!parsedParams.success) {
      return NextResponse.json<ErrorResponse>(
        {
          message: parsedParams.error.issues[0].message,
        },
        {
          status: 400,
        },
      );
    }

    const release = await getGitHubRelease(parsedParams.data.version);
    const artifact = await getDownloadableArtifact(release, parsedParams.data);

    const headers = new Headers({
      "Content-Type": artifact.contentType,
      "Content-Disposition": `attachment; filename="${artifact.filename}"; filename*=UTF-8''${encodeURIComponent(artifact.filename)}`,
      "Cache-Control": "private, no-store",
    });

    if (artifact.contentLength !== undefined) {
      headers.set("Content-Length", String(artifact.contentLength));
    }

    return new NextResponse(artifact.stream, {
      status: 200,
      headers,
    });
  } catch (error: unknown) {
    console.error("Failed to download CTX CLI artifact", error);

    if (error instanceof GitHubServiceError) {
      return NextResponse.json<ErrorResponse>(
        {
          message:
            error.status >= 500
              ? "Failed to retrieve the CTX CLI release artifact"
              : error.message,
        },
        {
          status: error.status,
        },
      );
    }

    return NextResponse.json<ErrorResponse>(
      {
        message: "Failed to download CTX CLI artifact",
      },
      {
        status: 500,
      },
    );
  }
}
