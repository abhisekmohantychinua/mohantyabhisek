import { afterEach, beforeEach, describe, expect, test, vi } from "vitest";

import { GitHubServiceError } from "@/features/ctx/models/github-service-error";
import type Release from "@/features/ctx/models/release";
import { getGitHubReleases } from "@/features/ctx/services/github-service";

import { GET } from "./route";

vi.mock("@/features/ctx/services/github-service", () => ({
  getGitHubReleases: vi.fn(),
}));

function createRelease(overrides: Partial<Release> = {}): Release {
  return {
    tag: "v1.2.3",
    name: "CTX CLI v1.2.3",
    releasedAt: "2026-09-20T12:00:00Z",
    ...overrides,
  };
}

describe("GET /api/ctx/releases", () => {
  beforeEach(() => {
    vi.mocked(getGitHubReleases).mockReset();

    vi.spyOn(console, "error").mockImplementation(() => {});
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  describe("successful responses", () => {
    test("returns published releases as JSON", async () => {
      const releases = [
        createRelease(),
        createRelease({
          tag: "v1.2.2",
          name: "CTX CLI v1.2.2",
          releasedAt: "2026-08-15T10:30:00Z",
        }),
      ];

      vi.mocked(getGitHubReleases).mockResolvedValue(releases);

      const response = await GET();

      expect(response.status).toBe(200);
      expect(await response.json()).toEqual(releases);
      expect(getGitHubReleases).toHaveBeenCalledOnce();
    });

    test("returns an empty array when no releases are available", async () => {
      vi.mocked(getGitHubReleases).mockResolvedValue([]);

      const response = await GET();

      expect(response.status).toBe(200);
      expect(await response.json()).toEqual([]);
      expect(getGitHubReleases).toHaveBeenCalledOnce();
    });

    test("sets the JSON content type", async () => {
      vi.mocked(getGitHubReleases).mockResolvedValue([createRelease()]);

      const response = await GET();

      expect(response.headers.get("content-type")).toContain(
        "application/json",
      );
    });

    test("sets private no-store cache control", async () => {
      vi.mocked(getGitHubReleases).mockResolvedValue([createRelease()]);

      const response = await GET();

      expect(response.headers.get("cache-control")).toBe("private, no-store");
    });
  });

  describe("GitHub service errors", () => {
    test("returns the service message for a 404 error", async () => {
      vi.mocked(getGitHubReleases).mockRejectedValue(
        new GitHubServiceError("GitHub repository not found.", 404),
      );

      const response = await GET();

      expect(response.status).toBe(404);
      expect(await response.json()).toEqual({
        message: "GitHub repository not found.",
      });
    });

    test("returns the service message for a 4xx error", async () => {
      vi.mocked(getGitHubReleases).mockRejectedValue(
        new GitHubServiceError("Release access denied.", 403),
      );

      const response = await GET();

      expect(response.status).toBe(403);
      expect(await response.json()).toEqual({
        message: "Release access denied.",
      });
    });

    test.each([500, 502, 503])(
      "returns a generic message for a service error with status %i",
      async (status) => {
        vi.mocked(getGitHubReleases).mockRejectedValue(
          new GitHubServiceError("Internal service details", status),
        );

        const response = await GET();

        expect(response.status).toBe(status);
        expect(await response.json()).toEqual({
          message: "Failed to retrieve CTX CLI releases",
        });
      },
    );
  });

  describe("unexpected errors", () => {
    test("returns 500 when the service throws an ordinary error", async () => {
      vi.mocked(getGitHubReleases).mockRejectedValue(
        new Error("Network failure"),
      );

      const response = await GET();

      expect(response.status).toBe(500);
      expect(await response.json()).toEqual({
        message: "Failed to retrieve CTX CLI releases",
      });
    });

    test("logs unexpected errors", async () => {
      const error = new Error("Network failure");
      const logSpy = vi.spyOn(console, "error");

      vi.mocked(getGitHubReleases).mockRejectedValue(error);

      await GET();

      expect(logSpy).toHaveBeenCalledWith(
        "Failed to retrieve CTX CLI releases",
        error,
      );
    });

    test("logs GitHub service errors", async () => {
      const error = new GitHubServiceError("Release access denied.", 403);
      const logSpy = vi.spyOn(console, "error");

      vi.mocked(getGitHubReleases).mockRejectedValue(error);

      await GET();

      expect(logSpy).toHaveBeenCalledWith(
        "Failed to retrieve CTX CLI releases",
        error,
      );
    });
  });
});
