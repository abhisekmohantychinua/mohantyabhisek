import { afterEach, beforeEach, describe, expect, test, vi } from "vitest";

import type { DownloadParams } from "../models/download-params";
import type { GitHubRelease } from "../models/github-release";
import type { GitHubReleaseAsset } from "../models/github-release-asset";
import type {
  GitHubReleaseSummary,
  GitHubReleaseVerbose,
} from "../models/github-release-summery";
import {
  getDownloadableArtifact,
  getGitHubRelease,
  getGitHubReleases,
  getGitHubReleaseVerbose,
} from "./github-service";

const REPOSITORY = "owner/ctx-cli";
const PAT = "test-token";
const ARCH: DownloadParams["arch"] = "linux-amd64";
const RELEASE_TAG = "v1.2.3";
const ASSET_URL =
  "https://api.github.com/repos/owner/ctx-cli/releases/assets/123";

function createAsset(
  overrides: Partial<GitHubReleaseAsset> = {},
): GitHubReleaseAsset {
  return {
    name: `ctx-cli-${ARCH}.zip`,
    url: ASSET_URL,
    size: 1024,
    content_type: "application/zip",
    ...overrides,
  };
}

function createRelease(overrides: Partial<GitHubRelease> = {}): GitHubRelease {
  return {
    tag_name: RELEASE_TAG,
    assets: [createAsset()],
    ...overrides,
  };
}

function createJsonResponse(data: unknown, status = 200): Response {
  return new Response(JSON.stringify(data), {
    status,
    headers: { "content-type": "application/json" },
  });
}

function createAssetResponse(
  options: {
    status?: number;
    body?: ReadableStream<Uint8Array> | null;
    headers?: Record<string, string>;
  } = {},
): Response {
  const {
    status = 200,
    body = new Response("archive").body,
    headers = { "content-type": "application/zip" },
  } = options;

  return new Response(body, { status, headers });
}

/**
 * Captures both synchronous throws and rejected promises.
 * This is needed because artifact validation throws before fetch,
 * while the download itself is asynchronous.
 */
async function captureError(
  operation: () => unknown | Promise<unknown>,
): Promise<unknown> {
  try {
    await operation();
  } catch (error) {
    return error;
  }

  throw new Error("Expected operation to fail, but it succeeded.");
}

describe("github-service", () => {
  let fetchMock: ReturnType<typeof vi.fn>;

  beforeEach(() => {
    vi.stubEnv("CTX_CLI_GITHUB_REPO", REPOSITORY);
    vi.stubEnv("CTX_CLI_GITHUB_PAT", PAT);

    fetchMock = vi.fn();
    vi.stubGlobal("fetch", fetchMock);
  });

  afterEach(() => {
    vi.unstubAllGlobals();
    vi.unstubAllEnvs();
  });

  describe("getGitHubRelease", () => {
    test("retrieves the latest release when no version is supplied", async () => {
      const release = createRelease();
      fetchMock.mockResolvedValue(createJsonResponse(release));

      await expect(getGitHubRelease()).resolves.toEqual(release);

      expect(fetchMock).toHaveBeenCalledTimes(1);
      expect(fetchMock).toHaveBeenCalledWith(
        `https://api.github.com/repos/${REPOSITORY}/releases/latest`,
        {
          method: "GET",
          headers: {
            Accept: "application/vnd.github+json",
            Authorization: `Bearer ${PAT}`,
            "X-GitHub-Api-Version": "2026-03-10",
          },
          cache: "no-store",
        },
      );
    });

    test("retrieves a release by its encoded version tag", async () => {
      const release = createRelease();
      fetchMock.mockResolvedValue(createJsonResponse(release));

      await expect(getGitHubRelease("v1.2.3")).resolves.toEqual(release);

      expect(fetchMock).toHaveBeenCalledWith(
        `https://api.github.com/repos/${REPOSITORY}/releases/tags/v1.2.3`,
        expect.any(Object),
      );
    });

    test("encodes special characters in the version tag", async () => {
      fetchMock.mockResolvedValue(createJsonResponse(createRelease()));

      await getGitHubRelease("v1.2.3+build");

      expect(fetchMock).toHaveBeenCalledWith(
        `https://api.github.com/repos/${REPOSITORY}/releases/tags/v1.2.3%2Bbuild`,
        expect.any(Object),
      );
    });

    test("rejects when the repository configuration is missing", async () => {
      vi.stubEnv("CTX_CLI_GITHUB_REPO", "");

      const error = await captureError(() => getGitHubRelease());

      expect(error).toMatchObject({
        name: "GitHubServiceError",
        message: "GitHub integration is not configured.",
        status: 500,
      });
      expect(fetchMock).not.toHaveBeenCalled();
    });

    test("rejects when the personal access token is missing", async () => {
      vi.stubEnv("CTX_CLI_GITHUB_PAT", "");

      const error = await captureError(() => getGitHubRelease());

      expect(error).toMatchObject({
        name: "GitHubServiceError",
        message: "GitHub integration is not configured.",
        status: 500,
      });
      expect(fetchMock).not.toHaveBeenCalled();
    });

    test("maps a missing release to 404", async () => {
      fetchMock.mockResolvedValue(new Response(null, { status: 404 }));

      await expect(getGitHubRelease()).rejects.toMatchObject({
        name: "GitHubServiceError",
        message: "GitHub release not found.",
        status: 404,
      });
    });

    test.each([400, 401, 403, 429])(
      "maps GitHub HTTP status %i to 502",
      async (status) => {
        fetchMock.mockResolvedValue(new Response(null, { status }));

        await expect(getGitHubRelease()).rejects.toMatchObject({
          name: "GitHubServiceError",
          message: "Unable to retrieve release information from GitHub.",
          status: 502,
        });
      },
    );

    test.each([500, 502, 503])(
      "maps GitHub server status %i to 503",
      async (status) => {
        fetchMock.mockResolvedValue(new Response(null, { status }));

        await expect(getGitHubRelease()).rejects.toMatchObject({
          name: "GitHubServiceError",
          status: 503,
        });
      },
    );

    test.each([
      null,
      "invalid",
      123,
      {},
      { tag_name: "v1.2.3" },
      { assets: [] },
      { tag_name: 123, assets: [] },
      { tag_name: "v1.2.3", assets: {} },
      { tag_name: "v1.2.3", assets: [null] },
      {
        tag_name: "v1.2.3",
        assets: [{ name: "asset" }],
      },
      {
        tag_name: "v1.2.3",
        assets: [{ name: "asset", url: ASSET_URL, size: -1 }],
      },
      {
        tag_name: "v1.2.3",
        assets: [{ name: "asset", url: ASSET_URL, size: Number.NaN }],
      },
    ])("rejects an invalid release response: %j", async (data) => {
      fetchMock.mockResolvedValue(createJsonResponse(data));

      await expect(getGitHubRelease()).rejects.toMatchObject({
        name: "GitHubServiceError",
        message: "GitHub release response is missing required fields.",
        status: 502,
      });
    });

    test("rejects when the parsed JSON value is undefined", async () => {
      fetchMock.mockResolvedValue({
        ok: true,
        status: 200,
        json: vi.fn().mockResolvedValue(undefined),
      });

      await expect(getGitHubRelease()).rejects.toMatchObject({
        name: "GitHubServiceError",
        message: "GitHub release response is missing required fields.",
        status: 502,
      });
    });

    test("propagates network errors", async () => {
      const error = new TypeError("Network unavailable");
      fetchMock.mockRejectedValue(error);

      await expect(getGitHubRelease()).rejects.toBe(error);
    });

    test("propagates JSON parsing errors", async () => {
      const error = new SyntaxError("Invalid JSON");
      fetchMock.mockResolvedValue({
        ok: true,
        status: 200,
        json: vi.fn().mockRejectedValue(error),
      });

      await expect(getGitHubRelease()).rejects.toBe(error);
    });
  });

  describe("getDownloadableArtifact", () => {
    const RELEASE_ARCHIVES = {
      "linux-amd64": "ctx-linux-amd64.tar.gz",
      "linux-arm64": "ctx-linux-arm64.tar.gz",
      "windows-amd64": "ctx-windows-amd64.zip",
      "macos-amd64": "ctx-macos-amd64.tar.gz",
      "macos-arm64": "ctx-macos-arm64.tar.gz",
    } as const;

    type Architecture = keyof typeof RELEASE_ARCHIVES;

    const createReleaseForArch = (
      arch: Architecture,
      assetOverrides: Partial<ReturnType<typeof createAsset>> = {},
    ): GitHubRelease =>
      createRelease({
        assets: [
          createAsset({
            name: RELEASE_ARCHIVES[arch],
            ...assetOverrides,
          }),
        ],
      });

    describe("successful downloads", () => {
      test.each(Object.entries(RELEASE_ARCHIVES) as [Architecture, string][])(
        "downloads the exact release asset for %s",
        async (arch, filename) => {
          const release = createReleaseForArch(arch);
          const response = createAssetResponse({
            headers: {
              "content-type": "application/octet-stream",
              "content-length": "2048",
            },
          });
          fetchMock.mockResolvedValue(response);

          const result = await getDownloadableArtifact(release, { arch });

          expect(result).toEqual({
            arch,
            version: RELEASE_TAG,
            filename,
            contentType: "application/octet-stream",
            contentLength: 2048,
            stream: response.body,
          });

          expect(fetchMock).toHaveBeenCalledTimes(1);
          expect(fetchMock).toHaveBeenCalledWith(ASSET_URL, {
            method: "GET",
            headers: {
              Accept: "application/octet-stream",
              Authorization: `Bearer ${PAT}`,
              "X-GitHub-Api-Version": "2026-03-10",
            },
            cache: "no-store",
          });
        },
      );

      test("uses the exact expected filename when other assets share the architecture identifier", async () => {
        const arch = "linux-amd64";
        const expectedFilename = RELEASE_ARCHIVES[arch];
        const release = createRelease({
          assets: [
            createAsset({ name: "ctx-linux-amd64.sha256" }),
            createAsset({ name: "ctx-linux-amd64-debug.tar.gz" }),
            createAsset({ name: expectedFilename }),
          ],
        });
        const response = createAssetResponse();
        fetchMock.mockResolvedValue(response);

        const result = await getDownloadableArtifact(release, { arch });

        expect(result.filename).toBe(expectedFilename);
        expect(fetchMock).toHaveBeenCalledTimes(1);
        expect(fetchMock).toHaveBeenCalledWith(
          ASSET_URL,
          expect.objectContaining({
            method: "GET",
          }),
        );
      });

      test("preserves the exact case of the release asset filename", async () => {
        const arch = "linux-amd64";
        const filename = RELEASE_ARCHIVES[arch];
        const release = createReleaseForArch(arch);
        fetchMock.mockResolvedValue(createAssetResponse());

        const result = await getDownloadableArtifact(release, { arch });

        expect(result.filename).toBe(filename);
      });
    });

    describe("configuration", () => {
      test("rejects when the repository configuration is missing", async () => {
        vi.stubEnv("CTX_CLI_GITHUB_REPO", "");

        const error = await captureError(() =>
          getDownloadableArtifact(createReleaseForArch(ARCH as Architecture), {
            arch: ARCH,
          }),
        );

        expect(error).toMatchObject({
          name: "GitHubServiceError",
          message: "GitHub integration is not configured.",
          status: 500,
        });
        expect(fetchMock).not.toHaveBeenCalled();
      });

      test("rejects when the personal access token is missing", async () => {
        vi.stubEnv("CTX_CLI_GITHUB_PAT", "");

        const error = await captureError(() =>
          getDownloadableArtifact(createReleaseForArch(ARCH as Architecture), {
            arch: ARCH,
          }),
        );

        expect(error).toMatchObject({
          name: "GitHubServiceError",
          message: "GitHub integration is not configured.",
          status: 500,
        });
        expect(fetchMock).not.toHaveBeenCalled();
      });
    });

    describe("release asset resolution", () => {
      test.each(Object.entries(RELEASE_ARCHIVES) as [Architecture, string][])(
        "rejects an incorrectly named asset for %s",
        async (arch, expectedFilename) => {
          const release = createRelease({
            assets: [
              createAsset({
                name: `other-${arch}.tar.gz`,
              }),
            ],
          });

          const error = await captureError(() =>
            getDownloadableArtifact(release, { arch }),
          );

          expect(error).toMatchObject({
            name: "GitHubServiceError",
            message: `Release artifact not found: ${expectedFilename}`,
            status: 404,
          });
          expect(fetchMock).not.toHaveBeenCalled();
        },
      );

      test("rejects an asset with a case-mismatched filename", async () => {
        const arch = "linux-amd64";
        const filename = RELEASE_ARCHIVES[arch].toUpperCase();
        const release = createRelease({
          assets: [createAsset({ name: filename })],
        });

        const error = await captureError(() =>
          getDownloadableArtifact(release, { arch }),
        );

        expect(error).toMatchObject({
          name: "GitHubServiceError",
          message: `Release artifact not found: ${RELEASE_ARCHIVES[arch]}`,
          status: 404,
        });
        expect(fetchMock).not.toHaveBeenCalled();
      });

      test("rejects when duplicate exact filenames exist", async () => {
        const arch = "linux-amd64";
        const filename = RELEASE_ARCHIVES[arch];
        const release = createRelease({
          assets: [
            createAsset({ name: filename }),
            createAsset({ name: filename }),
          ],
        });

        const error = await captureError(() =>
          getDownloadableArtifact(release, { arch }),
        );

        expect(error).toMatchObject({
          name: "GitHubServiceError",
          message: `Multiple release assets found for architecture "${arch}".`,
          status: 502,
        });
        expect(fetchMock).not.toHaveBeenCalled();
      });
    });

    describe("asset URL validation", () => {
      test.each([
        "http://api.github.com/repos/owner/ctx-cli/assets/123",
        "https://github.com/owner/ctx-cli/assets/123",
        "https://api.github.com.evil.example/assets/123",
        "not-a-url",
      ])("rejects an invalid asset URL: %s", async (url) => {
        const release = createReleaseForArch(ARCH as Architecture, { url });

        const error = await captureError(() =>
          getDownloadableArtifact(release, { arch: ARCH }),
        );

        expect(error).toMatchObject({
          name: "GitHubServiceError",
          message: "GitHub returned an invalid asset URL.",
          status: 502,
        });
        expect(fetchMock).not.toHaveBeenCalled();
      });
    });

    describe("GitHub asset response handling", () => {
      test("maps a missing asset response to 404", async () => {
        fetchMock.mockResolvedValue(new Response(null, { status: 404 }));

        await expect(
          getDownloadableArtifact(createReleaseForArch(ARCH as Architecture), {
            arch: ARCH,
          }),
        ).rejects.toMatchObject({
          name: "GitHubServiceError",
          message: "Unable to download the release asset from GitHub.",
          status: 404,
        });
      });

      test.each([400, 401, 403, 500, 503])(
        "maps unsuccessful asset response status %i to 502",
        async (status) => {
          fetchMock.mockResolvedValue(new Response(null, { status }));

          await expect(
            getDownloadableArtifact(
              createReleaseForArch(ARCH as Architecture),
              { arch: ARCH },
            ),
          ).rejects.toMatchObject({
            name: "GitHubServiceError",
            message: "Unable to download the release asset from GitHub.",
            status: 502,
          });
        },
      );

      test("rejects when the asset response has no body", async () => {
        fetchMock.mockResolvedValue(createAssetResponse({ body: null }));

        await expect(
          getDownloadableArtifact(createReleaseForArch(ARCH as Architecture), {
            arch: ARCH,
          }),
        ).rejects.toMatchObject({
          name: "GitHubServiceError",
          message: "GitHub returned an empty asset response.",
          status: 502,
        });
      });

      test("uses the response content length when valid", async () => {
        const release = createReleaseForArch("linux-amd64", { size: 1024 });
        fetchMock.mockResolvedValue(
          createAssetResponse({
            headers: {
              "content-type": "application/octet-stream",
              "content-length": "2048",
            },
          }),
        );

        const result = await getDownloadableArtifact(release, {
          arch: "linux-amd64",
        });

        expect(result.contentLength).toBe(2048);
      });

      test.each(["0", "-1", "invalid", "1.5"])(
        "falls back to the asset size for invalid content length %s",
        async (contentLength) => {
          const release = createReleaseForArch("linux-amd64", { size: 1024 });
          fetchMock.mockResolvedValue(
            createAssetResponse({
              headers: {
                "content-type": "application/octet-stream",
                "content-length": contentLength,
              },
            }),
          );

          const result = await getDownloadableArtifact(release, {
            arch: "linux-amd64",
          });

          expect(result.contentLength).toBe(1024);
        },
      );

      test("omits content length when neither source provides a valid size", async () => {
        const release = createReleaseForArch("linux-amd64", { size: 0 });
        fetchMock.mockResolvedValue(
          createAssetResponse({
            headers: {
              "content-type": "application/octet-stream",
              "content-length": "0",
            },
          }),
        );

        const result = await getDownloadableArtifact(release, {
          arch: "linux-amd64",
        });

        expect(result.contentLength).toBeUndefined();
      });

      test("uses the response content type when available", async () => {
        const release = createReleaseForArch("linux-amd64", {
          content_type: "application/zip",
        });
        fetchMock.mockResolvedValue(
          createAssetResponse({
            headers: {
              "content-type": "application/x-gzip",
            },
          }),
        );

        const result = await getDownloadableArtifact(release, {
          arch: "linux-amd64",
        });

        expect(result.contentType).toBe("application/x-gzip");
      });

      test("falls back to the asset content type when the response has none", async () => {
        const release = createReleaseForArch("linux-amd64", {
          content_type: "application/zip",
        });
        fetchMock.mockResolvedValue(
          createAssetResponse({
            headers: {},
          }),
        );

        const result = await getDownloadableArtifact(release, {
          arch: "linux-amd64",
        });

        expect(result.contentType).toBe("application/zip");
      });

      test("uses the default content type when neither source provides one", async () => {
        const release = createReleaseForArch("linux-amd64", {
          content_type: null,
        });
        fetchMock.mockResolvedValue(
          createAssetResponse({
            headers: {},
          }),
        );

        const result = await getDownloadableArtifact(release, {
          arch: "linux-amd64",
        });

        expect(result.contentType).toBe("application/octet-stream");
      });

      test("propagates network errors during asset download", async () => {
        const error = new TypeError("Network unavailable");
        fetchMock.mockRejectedValue(error);

        await expect(
          getDownloadableArtifact(createReleaseForArch(ARCH as Architecture), {
            arch: ARCH,
          }),
        ).rejects.toBe(error);
      });
    });
  });

  // Add this block inside describe("github-service", ...).

  describe("getGitHubReleases", () => {
    const RELEASES_URL = `https://api.github.com/repos/${REPOSITORY}/releases`;

    function createReleaseSummary(
      overrides: Record<string, unknown> = {},
    ): GitHubReleaseSummary {
      return {
        tag_name: "v1.2.3",
        name: "CTX CLI v1.2.3",
        draft: false,
        published_at: "2026-09-20T12:00:00Z",
        ...overrides,
      };
    }

    test("retrieves published releases and maps them to the public format", async () => {
      const releases = [
        createReleaseSummary(),
        createReleaseSummary({
          tag_name: "v1.2.2",
          name: "CTX CLI v1.2.2",
          published_at: "2026-08-15T10:30:00Z",
        }),
      ];

      fetchMock.mockResolvedValue(createJsonResponse(releases));

      await expect(getGitHubReleases()).resolves.toEqual([
        {
          tag: "v1.2.3",
          name: "CTX CLI v1.2.3",
          releasedAt: "2026-09-20T12:00:00Z",
        },
        {
          tag: "v1.2.2",
          name: "CTX CLI v1.2.2",
          releasedAt: "2026-08-15T10:30:00Z",
        },
      ]);

      expect(fetchMock).toHaveBeenCalledTimes(1);
      expect(fetchMock).toHaveBeenCalledWith(RELEASES_URL, {
        method: "GET",
        headers: {
          Accept: "application/vnd.github+json",
          Authorization: `Bearer ${PAT}`,
          "X-GitHub-Api-Version": "2026-03-10",
        },
        cache: "no-store",
      });
    });

    test("excludes draft releases", async () => {
      fetchMock.mockResolvedValue(
        createJsonResponse([
          createReleaseSummary(),
          createReleaseSummary({
            tag_name: "v1.2.4",
            draft: true,
            published_at: null,
          }),
        ]),
      );

      await expect(getGitHubReleases()).resolves.toEqual([
        {
          tag: "v1.2.3",
          name: "CTX CLI v1.2.3",
          releasedAt: "2026-09-20T12:00:00Z",
        },
      ]);
    });

    test("excludes releases without a publication timestamp", async () => {
      fetchMock.mockResolvedValue(
        createJsonResponse([
          createReleaseSummary(),
          createReleaseSummary({
            tag_name: "v1.2.4",
            published_at: null,
          }),
        ]),
      );

      await expect(getGitHubReleases()).resolves.toHaveLength(1);
    });

    test("falls back to the tag when the release name is null or empty", async () => {
      fetchMock.mockResolvedValue(
        createJsonResponse([
          createReleaseSummary({
            tag_name: "v1.2.3",
            name: null,
          }),
          createReleaseSummary({
            tag_name: "v1.2.2",
            name: "  ",
          }),
        ]),
      );

      await expect(getGitHubReleases()).resolves.toEqual([
        {
          tag: "v1.2.3",
          name: "v1.2.3",
          releasedAt: "2026-09-20T12:00:00Z",
        },
        {
          tag: "v1.2.2",
          name: "v1.2.2",
          releasedAt: "2026-09-20T12:00:00Z",
        },
      ]);
    });

    test("returns an empty array when no releases are published", async () => {
      fetchMock.mockResolvedValue(
        createJsonResponse([
          createReleaseSummary({ draft: true, published_at: null }),
          createReleaseSummary({ published_at: null }),
        ]),
      );

      await expect(getGitHubReleases()).resolves.toEqual([]);
    });

    test("rejects when the repository configuration is missing", async () => {
      vi.stubEnv("CTX_CLI_GITHUB_REPO", "");

      await expect(getGitHubReleases()).rejects.toMatchObject({
        name: "GitHubServiceError",
        message: "GitHub integration is not configured.",
        status: 500,
      });

      expect(fetchMock).not.toHaveBeenCalled();
    });

    test("rejects when the personal access token is missing", async () => {
      vi.stubEnv("CTX_CLI_GITHUB_PAT", "");

      await expect(getGitHubReleases()).rejects.toMatchObject({
        name: "GitHubServiceError",
        message: "GitHub integration is not configured.",
        status: 500,
      });

      expect(fetchMock).not.toHaveBeenCalled();
    });

    test("maps a missing repository to 404", async () => {
      fetchMock.mockResolvedValue(new Response(null, { status: 404 }));

      await expect(getGitHubReleases()).rejects.toMatchObject({
        name: "GitHubServiceError",
        message: "GitHub release not found.",
        status: 404,
      });
    });

    test.each([400, 401, 403, 429])(
      "maps GitHub HTTP status %i to 502",
      async (status) => {
        fetchMock.mockResolvedValue(new Response(null, { status }));

        await expect(getGitHubReleases()).rejects.toMatchObject({
          name: "GitHubServiceError",
          status: 502,
        });
      },
    );

    test.each([500, 502, 503])(
      "maps GitHub server status %i to 503",
      async (status) => {
        fetchMock.mockResolvedValue(new Response(null, { status }));

        await expect(getGitHubReleases()).rejects.toMatchObject({
          name: "GitHubServiceError",
          status: 503,
        });
      },
    );

    test.each([
      null,
      "invalid",
      123,
      {},
      [null],
      ["invalid"],
      [{}],
      [{ tag_name: "v1.2.3" }],
      [createReleaseSummary({ tag_name: 123 })],
      [createReleaseSummary({ name: 123 })],
      [createReleaseSummary({ draft: "false" })],
      [createReleaseSummary({ published_at: 123 })],
    ])("rejects an invalid release list response: %j", async (data) => {
      fetchMock.mockResolvedValue(createJsonResponse(data));

      await expect(getGitHubReleases()).rejects.toMatchObject({
        name: "GitHubServiceError",
        message: "GitHub release response is missing required fields.",
        status: 502,
      });
    });

    test("rejects when the parsed JSON value is undefined", async () => {
      fetchMock.mockResolvedValue({
        ok: true,
        status: 200,
        json: vi.fn().mockResolvedValue(undefined),
      });

      await expect(getGitHubReleases()).rejects.toMatchObject({
        name: "GitHubServiceError",
        message: "GitHub release response is missing required fields.",
        status: 502,
      });
    });

    test("propagates network errors", async () => {
      const error = new TypeError("Network unavailable");
      fetchMock.mockRejectedValue(error);

      await expect(getGitHubReleases()).rejects.toBe(error);
    });

    test("propagates JSON parsing errors", async () => {
      const error = new SyntaxError("Invalid JSON");
      fetchMock.mockResolvedValue({
        ok: true,
        status: 200,
        json: vi.fn().mockRejectedValue(error),
      });

      await expect(getGitHubReleases()).rejects.toBe(error);
    });
  });

  describe("getGitHubReleaseVerbose", () => {
    const RELEASE_URL = `https://api.github.com/repos/${REPOSITORY}/releases/tags`;

    function createVerboseRelease(
      overrides: Partial<GitHubReleaseVerbose> = {},
    ): GitHubReleaseVerbose {
      return {
        tag_name: RELEASE_TAG,
        name: "CTX CLI v1.2.3",
        draft: false,
        published_at: "2026-09-20T12:00:00Z",
        body: "## What's Changed\n- Added new features.",
        ...overrides,
      };
    }

    test("retrieves a published release by its tag", async () => {
      const release = createVerboseRelease();
      fetchMock.mockResolvedValue(createJsonResponse(release));

      await expect(getGitHubReleaseVerbose(RELEASE_TAG)).resolves.toEqual({
        tag: RELEASE_TAG,
        name: "CTX CLI v1.2.3",
        releasedAt: "2026-09-20T12:00:00Z",
        content: "## What's Changed\n- Added new features.",
      });

      expect(fetchMock).toHaveBeenCalledTimes(1);
      expect(fetchMock).toHaveBeenCalledWith(`${RELEASE_URL}/${RELEASE_TAG}`, {
        method: "GET",
        headers: {
          Accept: "application/vnd.github+json",
          Authorization: `Bearer ${PAT}`,
          "X-GitHub-Api-Version": "2026-03-10",
        },
        cache: "no-store",
      });
    });

    test("encodes special characters in the release tag", async () => {
      fetchMock.mockResolvedValue(createJsonResponse(createVerboseRelease()));

      await getGitHubReleaseVerbose("v1.2.3+build");

      expect(fetchMock).toHaveBeenCalledWith(
        `${RELEASE_URL}/v1.2.3%2Bbuild`,
        expect.any(Object),
      );
    });

    test("falls back to the tag when the release name is null", async () => {
      fetchMock.mockResolvedValue(
        createJsonResponse(createVerboseRelease({ name: null })),
      );

      await expect(getGitHubReleaseVerbose(RELEASE_TAG)).resolves.toMatchObject(
        {
          tag: RELEASE_TAG,
          name: RELEASE_TAG,
        },
      );
    });

    test("falls back to the tag when the release name is empty", async () => {
      fetchMock.mockResolvedValue(
        createJsonResponse(createVerboseRelease({ name: "  " })),
      );

      await expect(getGitHubReleaseVerbose(RELEASE_TAG)).resolves.toMatchObject(
        {
          tag: RELEASE_TAG,
          name: RELEASE_TAG,
        },
      );
    });

    test("trims whitespace from the release name", async () => {
      fetchMock.mockResolvedValue(
        createJsonResponse(createVerboseRelease({ name: "  CTX CLI  " })),
      );

      await expect(getGitHubReleaseVerbose(RELEASE_TAG)).resolves.toMatchObject(
        {
          name: "CTX CLI",
        },
      );
    });

    test("returns null content when the release body is null", async () => {
      fetchMock.mockResolvedValue(
        createJsonResponse(createVerboseRelease({ body: null })),
      );

      await expect(getGitHubReleaseVerbose(RELEASE_TAG)).resolves.toMatchObject(
        {
          content: null,
        },
      );
    });

    test("rejects a draft release with 404", async () => {
      fetchMock.mockResolvedValue(
        createJsonResponse(createVerboseRelease({ draft: true })),
      );

      await expect(getGitHubReleaseVerbose(RELEASE_TAG)).rejects.toMatchObject({
        name: "GitHubServiceError",
        message: "GitHub release not found.",
        status: 404,
      });
    });

    test("rejects a release without a publication date with 404", async () => {
      fetchMock.mockResolvedValue(
        createJsonResponse(createVerboseRelease({ published_at: null })),
      );

      await expect(getGitHubReleaseVerbose(RELEASE_TAG)).rejects.toMatchObject({
        name: "GitHubServiceError",
        message: "GitHub release not found.",
        status: 404,
      });
    });

    test("rejects when the repository configuration is missing", async () => {
      vi.stubEnv("CTX_CLI_GITHUB_REPO", "");

      await expect(getGitHubReleaseVerbose(RELEASE_TAG)).rejects.toMatchObject({
        name: "GitHubServiceError",
        message: "GitHub integration is not configured.",
        status: 500,
      });

      expect(fetchMock).not.toHaveBeenCalled();
    });

    test("rejects when the personal access token is missing", async () => {
      vi.stubEnv("CTX_CLI_GITHUB_PAT", "");

      await expect(getGitHubReleaseVerbose(RELEASE_TAG)).rejects.toMatchObject({
        name: "GitHubServiceError",
        message: "GitHub integration is not configured.",
        status: 500,
      });

      expect(fetchMock).not.toHaveBeenCalled();
    });

    test("maps a missing release to 404", async () => {
      fetchMock.mockResolvedValue(new Response(null, { status: 404 }));

      await expect(getGitHubReleaseVerbose(RELEASE_TAG)).rejects.toMatchObject({
        name: "GitHubServiceError",
        message: "GitHub release not found.",
        status: 404,
      });
    });

    test.each([400, 401, 403, 429])(
      "maps GitHub HTTP status %i to 502",
      async (status) => {
        fetchMock.mockResolvedValue(new Response(null, { status }));

        await expect(
          getGitHubReleaseVerbose(RELEASE_TAG),
        ).rejects.toMatchObject({
          name: "GitHubServiceError",
          message: "Unable to retrieve release information from GitHub.",
          status: 502,
        });
      },
    );

    test.each([500, 502, 503])(
      "maps GitHub server status %i to 503",
      async (status) => {
        fetchMock.mockResolvedValue(new Response(null, { status }));

        await expect(
          getGitHubReleaseVerbose(RELEASE_TAG),
        ).rejects.toMatchObject({
          name: "GitHubServiceError",
          message: "Unable to retrieve release information from GitHub.",
          status: 503,
        });
      },
    );

    test.each([
      null,
      "invalid",
      123,
      {},
      { tag_name: RELEASE_TAG },
      { tag_name: RELEASE_TAG, name: "CTX CLI" },
      {
        tag_name: RELEASE_TAG,
        name: "CTX CLI",
        draft: false,
        published_at: "2026-09-20T12:00:00Z",
      },
      createVerboseRelease({
        tag_name: 123,
      } as unknown as Partial<GitHubReleaseVerbose>),
      createVerboseRelease({
        name: 123,
      } as unknown as Partial<GitHubReleaseVerbose>),
      createVerboseRelease({
        draft: "false",
      } as unknown as Partial<GitHubReleaseVerbose>),
      createVerboseRelease({
        published_at: 123,
      } as unknown as Partial<GitHubReleaseVerbose>),
      createVerboseRelease({
        body: 123,
      } as unknown as Partial<GitHubReleaseVerbose>),
    ])("rejects an invalid verbose release response: %j", async (data) => {
      fetchMock.mockResolvedValue(createJsonResponse(data));

      await expect(getGitHubReleaseVerbose(RELEASE_TAG)).rejects.toMatchObject({
        name: "GitHubServiceError",
        message: "GitHub release response is missing required fields.",
        status: 502,
      });
    });

    test("rejects when the parsed JSON value is undefined", async () => {
      fetchMock.mockResolvedValue({
        ok: true,
        status: 200,
        json: vi.fn().mockResolvedValue(undefined),
      });

      await expect(getGitHubReleaseVerbose(RELEASE_TAG)).rejects.toMatchObject({
        name: "GitHubServiceError",
        message: "GitHub release response is missing required fields.",
        status: 502,
      });
    });

    test("propagates network errors", async () => {
      const error = new TypeError("Network unavailable");
      fetchMock.mockRejectedValue(error);

      await expect(getGitHubReleaseVerbose(RELEASE_TAG)).rejects.toBe(error);
    });

    test("propagates JSON parsing errors", async () => {
      const error = new SyntaxError("Invalid JSON");
      fetchMock.mockResolvedValue({
        ok: true,
        status: 200,
        json: vi.fn().mockRejectedValue(error),
      });

      await expect(getGitHubReleaseVerbose(RELEASE_TAG)).rejects.toBe(error);
    });
  });
});
