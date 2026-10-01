import { NextRequest } from "next/server";
import { afterEach, beforeEach, describe, expect, test, vi } from "vitest";

import type { DownloadableArtifact } from "@/features/ctx/models/downloadable-artifact";
import type { GitHubRelease } from "@/features/ctx/models/github-artifact-release";
import { GitHubServiceError } from "@/features/ctx/models/github-service-error";
import {
  getDownloadableArtifact,
  getGitHubRelease,
} from "@/features/ctx/services/github-service";

import { GET } from "./route";

vi.mock("@/features/ctx/services/github-service", () => ({
  getDownloadableArtifact: vi.fn(),
  getGitHubRelease: vi.fn(),
}));

const BASE_URL = "http://localhost/api/ctx/download";
const ARCH = "linux-amd64";

function createRequest(query = ""): NextRequest {
  return new NextRequest(`${BASE_URL}${query}`);
}

function createRelease(): GitHubRelease {
  return {
    tag_name: "v1.2.3",
    assets: [],
  } as GitHubRelease;
}

function createArtifact(
  overrides: Partial<DownloadableArtifact> = {},
): DownloadableArtifact {
  return {
    arch: ARCH,
    version: "v1.2.3",
    filename: "ctx-cli-linux-amd64.zip",
    contentType: "application/zip",
    contentLength: 1024,
    stream: new Response("binary archive").body!,
    ...overrides,
  };
}

describe("GET /api/ctx/download", () => {
  beforeEach(() => {
    vi.mocked(getGitHubRelease).mockReset();
    vi.mocked(getDownloadableArtifact).mockReset();

    vi.spyOn(console, "error").mockImplementation(() => {});
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  describe("query parameter validation", () => {
    test("returns 400 when architecture is missing", async () => {
      const response = await GET(createRequest());

      expect(response.status).toBe(400);
      expect(await response.json()).toEqual({
        message: expect.any(String),
      });
      expect(getGitHubRelease).not.toHaveBeenCalled();
      expect(getDownloadableArtifact).not.toHaveBeenCalled();
    });

    test("returns 400 when architecture is unsupported", async () => {
      const response = await GET(createRequest("?arch=freebsd-amd64"));

      expect(response.status).toBe(400);
      expect(await response.json()).toEqual({
        message: expect.any(String),
      });
      expect(getGitHubRelease).not.toHaveBeenCalled();
      expect(getDownloadableArtifact).not.toHaveBeenCalled();
    });

    test("returns 400 when version has an invalid format", async () => {
      const response = await GET(createRequest(`?arch=${ARCH}&version=latest`));

      expect(response.status).toBe(400);
      expect(await response.json()).toEqual({
        message: "Version must be in the format vX.Y.Z or vX.Y.Z-SNAPSHOT.",
      });
      expect(getGitHubRelease).not.toHaveBeenCalled();
      expect(getDownloadableArtifact).not.toHaveBeenCalled();
    });

    test.each(["1.2.3", "v1.2", "v1.2.3-beta", "v1.2.3-SNAPSHOT-extra"])(
      "returns 400 for invalid version %s",
      async (version) => {
        const response = await GET(
          createRequest(`?arch=${ARCH}&version=${encodeURIComponent(version)}`),
        );

        expect(response.status).toBe(400);
        expect(getGitHubRelease).not.toHaveBeenCalled();
      },
    );
    const artifacts: DownloadableArtifact["arch"][] = [
      "windows-amd64",
      "linux-amd64",
      "linux-arm64",
      "macos-amd64",
      "macos-arm64",
    ];
    test.each(artifacts)(
      "accepts supported architecture %s",
      async (arch: DownloadableArtifact["arch"]) => {
        const release = createRelease();
        const artifact = createArtifact({ arch });

        vi.mocked(getGitHubRelease).mockResolvedValue(release);
        vi.mocked(getDownloadableArtifact).mockResolvedValue(artifact);

        const response = await GET(createRequest(`?arch=${arch}`));

        expect(response.status).toBe(200);
        expect(getGitHubRelease).toHaveBeenCalledWith(undefined);
        expect(getDownloadableArtifact).toHaveBeenCalledWith(release, { arch });
      },
    );
  });

  describe("successful downloads", () => {
    test("returns the artifact as a streamed response", async () => {
      const release = createRelease();
      const artifact = createArtifact({
        stream: new Response("binary archive").body!,
      });

      vi.mocked(getGitHubRelease).mockResolvedValue(release);
      vi.mocked(getDownloadableArtifact).mockResolvedValue(artifact);

      const response = await GET(createRequest(`?arch=${ARCH}`));

      expect(response.status).toBe(200);
      expect(response.headers.get("content-type")).toBe("application/zip");
      expect(await response.text()).toBe("binary archive");
    });

    test("retrieves the latest release when version is omitted", async () => {
      const release = createRelease();
      const artifact = createArtifact();

      vi.mocked(getGitHubRelease).mockResolvedValue(release);
      vi.mocked(getDownloadableArtifact).mockResolvedValue(artifact);

      await GET(createRequest(`?arch=${ARCH}`));

      expect(getGitHubRelease).toHaveBeenCalledOnce();
      expect(getGitHubRelease).toHaveBeenCalledWith(undefined);
    });

    test("passes the requested version to the release service", async () => {
      const release = createRelease();
      const artifact = createArtifact();

      vi.mocked(getGitHubRelease).mockResolvedValue(release);
      vi.mocked(getDownloadableArtifact).mockResolvedValue(artifact);

      const response = await GET(
        createRequest(`?arch=${ARCH}&version=v2.3.4-SNAPSHOT`),
      );

      expect(response.status).toBe(200);
      expect(getGitHubRelease).toHaveBeenCalledWith("v2.3.4-SNAPSHOT");
      expect(getDownloadableArtifact).toHaveBeenCalledWith(release, {
        arch: ARCH,
        version: "v2.3.4-SNAPSHOT",
      });
    });

    test("sets the content disposition using an encoded filename", async () => {
      const release = createRelease();
      const artifact = createArtifact({
        filename: "ctx cli archive.zip",
      });

      vi.mocked(getGitHubRelease).mockResolvedValue(release);
      vi.mocked(getDownloadableArtifact).mockResolvedValue(artifact);

      const response = await GET(createRequest(`?arch=${ARCH}`));

      expect(response.headers.get("content-disposition")).toBe(
        "attachment; filename=\"ctx cli archive.zip\"; filename*=UTF-8''ctx%20cli%20archive.zip",
      );
    });

    test("sets private no-store cache control", async () => {
      vi.mocked(getGitHubRelease).mockResolvedValue(createRelease());
      vi.mocked(getDownloadableArtifact).mockResolvedValue(createArtifact());

      const response = await GET(createRequest(`?arch=${ARCH}`));

      expect(response.headers.get("cache-control")).toBe("private, no-store");
    });

    test("sets content length when provided", async () => {
      vi.mocked(getGitHubRelease).mockResolvedValue(createRelease());
      vi.mocked(getDownloadableArtifact).mockResolvedValue(
        createArtifact({ contentLength: 2048 }),
      );

      const response = await GET(createRequest(`?arch=${ARCH}`));

      expect(response.headers.get("content-length")).toBe("2048");
    });

    test("omits content length when it is undefined", async () => {
      vi.mocked(getGitHubRelease).mockResolvedValue(createRelease());
      vi.mocked(getDownloadableArtifact).mockResolvedValue(
        createArtifact({ contentLength: undefined }),
      );

      const response = await GET(createRequest(`?arch=${ARCH}`));

      expect(response.status).toBe(200);
      expect(response.headers.has("content-length")).toBe(false);
    });

    test("does not fetch the artifact if release lookup fails", async () => {
      vi.mocked(getGitHubRelease).mockRejectedValue(
        new GitHubServiceError("GitHub release not found.", 404),
      );

      const response = await GET(createRequest(`?arch=${ARCH}`));

      expect(response.status).toBe(404);
      expect(getDownloadableArtifact).not.toHaveBeenCalled();
    });
  });

  describe("GitHub service errors", () => {
    test("returns the service message for a 404 error", async () => {
      vi.mocked(getGitHubRelease).mockRejectedValue(
        new GitHubServiceError("GitHub release not found.", 404),
      );

      const response = await GET(createRequest(`?arch=${ARCH}`));

      expect(response.status).toBe(404);
      expect(await response.json()).toEqual({
        message: "GitHub release not found.",
      });
    });

    test("returns the service message for a 4xx error", async () => {
      vi.mocked(getGitHubRelease).mockRejectedValue(
        new GitHubServiceError("Release access denied.", 403),
      );

      const response = await GET(createRequest(`?arch=${ARCH}`));

      expect(response.status).toBe(403);
      expect(await response.json()).toEqual({
        message: "Release access denied.",
      });
    });

    test.each([500, 502, 503])(
      "returns a generic message for a service error with status %i",
      async (status) => {
        vi.mocked(getGitHubRelease).mockRejectedValue(
          new GitHubServiceError("Internal service details", status),
        );

        const response = await GET(createRequest(`?arch=${ARCH}`));

        expect(response.status).toBe(status);
        expect(await response.json()).toEqual({
          message: "Failed to retrieve the CTX CLI release artifact",
        });
      },
    );

    test("handles a service error thrown while resolving the artifact", async () => {
      vi.mocked(getGitHubRelease).mockResolvedValue(createRelease());
      vi.mocked(getDownloadableArtifact).mockRejectedValue(
        new GitHubServiceError("No release asset found for architecture.", 404),
      );

      const response = await GET(createRequest(`?arch=${ARCH}`));

      expect(response.status).toBe(404);
      expect(await response.json()).toEqual({
        message: "No release asset found for architecture.",
      });
    });

    test("uses a generic message for an artifact service error with status 502", async () => {
      vi.mocked(getGitHubRelease).mockResolvedValue(createRelease());
      vi.mocked(getDownloadableArtifact).mockRejectedValue(
        new GitHubServiceError("Sensitive upstream detail", 502),
      );

      const response = await GET(createRequest(`?arch=${ARCH}`));

      expect(response.status).toBe(502);
      expect(await response.json()).toEqual({
        message: "Failed to retrieve the CTX CLI release artifact",
      });
    });
  });

  describe("unexpected errors", () => {
    test("returns 500 when release lookup throws an ordinary error", async () => {
      vi.mocked(getGitHubRelease).mockRejectedValue(
        new Error("Network failure"),
      );

      const response = await GET(createRequest(`?arch=${ARCH}`));

      expect(response.status).toBe(500);
      expect(await response.json()).toEqual({
        message: "Failed to download CTX CLI artifact",
      });
    });

    test("returns 500 when artifact resolution throws an ordinary error", async () => {
      vi.mocked(getGitHubRelease).mockResolvedValue(createRelease());
      vi.mocked(getDownloadableArtifact).mockRejectedValue(
        new Error("Unexpected failure"),
      );

      const response = await GET(createRequest(`?arch=${ARCH}`));

      expect(response.status).toBe(500);
      expect(await response.json()).toEqual({
        message: "Failed to download CTX CLI artifact",
      });
    });

    test("logs unexpected errors", async () => {
      const error = new Error("Network failure");
      const logSpy = vi.spyOn(console, "error");

      vi.mocked(getGitHubRelease).mockRejectedValue(error);

      await GET(createRequest(`?arch=${ARCH}`));

      expect(logSpy).toHaveBeenCalledWith(
        "Failed to download CTX CLI artifact",
        error,
      );
    });
  });
});
