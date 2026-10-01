import type { NextRequest } from "next/server";
import { afterEach, beforeEach, describe, expect, test, vi } from "vitest";

import { GitHubServiceError } from "@/features/ctx/models/github-service-error";
import type { ReleaseVerbose } from "@/features/ctx/models/release-detailed";
import { getGitHubReleaseVerbose } from "@/features/ctx/services/github-service";

import { GET } from "./route";

vi.mock("@/features/ctx/services/github-service", () => ({
  getGitHubReleaseVerbose: vi.fn(),
}));

function createRelease(
  overrides: Partial<ReleaseVerbose> = {},
): ReleaseVerbose {
  return {
    tag: "v1.2.3",
    name: "CTX CLI v1.2.3",
    releasedAt: "2026-09-20T12:00:00Z",
    content: "## What's Changed\n- Added new features.",
    ...overrides,
  };
}

function createRequest(): NextRequest {
  return new Request("http://localhost/api/ctx/releases/v1.2.3") as NextRequest;
}

function createContext(tag = "v1.2.3") {
  return {
    params: Promise.resolve({ tag }),
  };
}

describe("GET /api/ctx/releases/[tag]", () => {
  beforeEach(() => {
    vi.mocked(getGitHubReleaseVerbose).mockReset();

    vi.spyOn(console, "error").mockImplementation(() => {});
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  describe("successful responses", () => {
    test("returns a published release as JSON", async () => {
      const release = createRelease();

      vi.mocked(getGitHubReleaseVerbose).mockResolvedValue(release);

      const response = await GET(createRequest(), createContext());

      expect(response.status).toBe(200);
      expect(await response.json()).toEqual(release);
      expect(getGitHubReleaseVerbose).toHaveBeenCalledOnce();
      expect(getGitHubReleaseVerbose).toHaveBeenCalledWith("v1.2.3");
    });

    test("passes the requested tag to the service", async () => {
      const tag = "v2.0.0";

      vi.mocked(getGitHubReleaseVerbose).mockResolvedValue(
        createRelease({ tag }),
      );

      const response = await GET(createRequest(), createContext(tag));

      expect(response.status).toBe(200);
      expect(getGitHubReleaseVerbose).toHaveBeenCalledWith(tag);
    });

    test("returns release notes in the response", async () => {
      const release = createRelease({
        content: "## Changes\n- Improved performance.",
      });

      vi.mocked(getGitHubReleaseVerbose).mockResolvedValue(release);

      const response = await GET(createRequest(), createContext());

      expect(response.status).toBe(200);
      expect(await response.json()).toEqual(release);
    });

    test("returns null content when release notes are unavailable", async () => {
      const release = createRelease({ content: null });

      vi.mocked(getGitHubReleaseVerbose).mockResolvedValue(release);

      const response = await GET(createRequest(), createContext());

      expect(response.status).toBe(200);
      expect(await response.json()).toEqual(release);
    });

    test("sets the JSON content type", async () => {
      vi.mocked(getGitHubReleaseVerbose).mockResolvedValue(createRelease());

      const response = await GET(createRequest(), createContext());

      expect(response.headers.get("content-type")).toContain(
        "application/json",
      );
    });

    test("sets private no-store cache control", async () => {
      vi.mocked(getGitHubReleaseVerbose).mockResolvedValue(createRelease());

      const response = await GET(createRequest(), createContext());

      expect(response.headers.get("cache-control")).toBe("private, no-store");
    });
  });

  describe("GitHub service errors", () => {
    test("returns the service message for a 404 error", async () => {
      vi.mocked(getGitHubReleaseVerbose).mockRejectedValue(
        new GitHubServiceError("GitHub release not found.", 404),
      );

      const response = await GET(createRequest(), createContext());

      expect(response.status).toBe(404);
      expect(await response.json()).toEqual({
        message: "GitHub release not found.",
      });
    });

    test("returns the service message for a 4xx error", async () => {
      vi.mocked(getGitHubReleaseVerbose).mockRejectedValue(
        new GitHubServiceError("Release access denied.", 403),
      );

      const response = await GET(createRequest(), createContext());

      expect(response.status).toBe(403);
      expect(await response.json()).toEqual({
        message: "Release access denied.",
      });
    });

    test.each([500, 502, 503])(
      "returns a generic message for a service error with status %i",
      async (status) => {
        vi.mocked(getGitHubReleaseVerbose).mockRejectedValue(
          new GitHubServiceError("Internal service details", status),
        );

        const response = await GET(createRequest(), createContext());

        expect(response.status).toBe(status);
        expect(await response.json()).toEqual({
          message: "Failed to retrieve the CTX CLI release",
        });
      },
    );
  });

  describe("unexpected errors", () => {
    test("returns 500 when the service throws an ordinary error", async () => {
      vi.mocked(getGitHubReleaseVerbose).mockRejectedValue(
        new Error("Network failure"),
      );

      const response = await GET(createRequest(), createContext());

      expect(response.status).toBe(500);
      expect(await response.json()).toEqual({
        message: "Failed to retrieve the CTX CLI release",
      });
    });

    test("logs unexpected errors", async () => {
      const error = new Error("Network failure");
      const logSpy = vi.spyOn(console, "error");

      vi.mocked(getGitHubReleaseVerbose).mockRejectedValue(error);

      await GET(createRequest(), createContext());

      expect(logSpy).toHaveBeenCalledWith(
        "Failed to retrieve CTX CLI release",
        error,
      );
    });

    test("logs GitHub service errors", async () => {
      const error = new GitHubServiceError("Release access denied.", 403);
      const logSpy = vi.spyOn(console, "error");

      vi.mocked(getGitHubReleaseVerbose).mockRejectedValue(error);

      await GET(createRequest(), createContext());

      expect(logSpy).toHaveBeenCalledWith(
        "Failed to retrieve CTX CLI release",
        error,
      );
    });
  });
});
