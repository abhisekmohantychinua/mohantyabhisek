import type { DownloadParams } from "../models/download-params";
import type { DownloadableArtifact } from "../models/downloadable-artifact";
import type GitHubArtifactRelease from "../models/github-artifact-release";
import type { GitHubReleaseAsset } from "../models/github-artifact-release";
import type GitHubReleaseDetailed from "../models/github-release-detailed";
import type GitHubReleaseMeta from "../models/github-release-meta";
import { GitHubServiceError } from "../models/github-service-error";
import type ReleaseDetailed from "../models/release-detailed";
import type ReleaseMeta from "../models/release-meta";

const GITHUB_API_URL = "https://api.github.com";
const GITHUB_API_VERSION = "2026-03-10";
const RELEASE_ARCHIVES: Record<DownloadParams["arch"], string> = {
  "linux-amd64": "ctx-linux-amd64.tar.gz",
  "linux-arm64": "ctx-linux-arm64.tar.gz",
  "windows-amd64": "ctx-windows-amd64.zip",
  "macos-amd64": "ctx-macos-amd64.tar.gz",
  "macos-arm64": "ctx-macos-arm64.tar.gz",
};

/**
 * Retrieves the GitHub configuration required for release requests.
 *
 * Configuration is read when a service method is called rather than
 * when this module is imported, allowing the module to be imported
 * safely during builds and tests.
 *
 * @returns The configured GitHub repository and personal access token.
 * @throws {GitHubServiceError} If either environment variable is missing.
 */
function getGitHubConfig(): {
  repository: string;
  pat: string;
} {
  const repository = process.env.CTX_CLI_GITHUB_REPO;
  const pat = process.env.CTX_CLI_GITHUB_PAT;

  if (!repository || !pat) {
    throw new GitHubServiceError("GitHub integration is not configured.", 500);
  }

  return { repository, pat };
}

/**
 * Retrieves release metadata from the configured GitHub repository.
 *
 * When a version is supplied, the matching release tag is requested.
 * Otherwise, the latest published GitHub release is retrieved.
 *
 * The returned release can be passed to `getDownloadableArtifact()`
 * to resolve and stream the asset for a requested architecture.
 *
 * @param version - Optional release tag to retrieve.
 * @returns A promise resolving to validated GitHub release metadata.
 * @throws {GitHubServiceError} With status 500 if GitHub configuration
 * is missing.
 * @throws {GitHubServiceError} With status 404 if the requested release
 * does not exist.
 * @throws {GitHubServiceError} With status 502 or 503 if GitHub returns
 * an unsuccessful response.
 * @throws {TypeError} If the request fails at the network level.
 * @throws {SyntaxError} If GitHub returns a response that cannot be
 * parsed as JSON.
 */
export async function getGitHubRelease(
  version?: string,
): Promise<GitHubArtifactRelease> {
  const { repository, pat } = getGitHubConfig();

  const releaseUrl = getReleaseUrl(repository, version);

  return fetch(releaseUrl, {
    method: "GET",
    headers: {
      Accept: "application/vnd.github+json",
      Authorization: `Bearer ${pat}`,
      "X-GitHub-Api-Version": GITHUB_API_VERSION,
    },
    cache: "no-store",
  })
    .then((response) => {
      if (response.status === 404) {
        throw new GitHubServiceError("GitHub release not found.", 404);
      }

      if (!response.ok) {
        throw new GitHubServiceError(
          "Unable to retrieve release information from GitHub.",
          response.status >= 500 ? 503 : 502,
        );
      }

      return response.json() as Promise<unknown>;
    })
    .then((data) => data as unknown as GitHubArtifactRelease);
}

/**
 * Builds the GitHub API URL for a specific release or the latest release.
 *
 * @param repository - GitHub repository in owner/repository format.
 * @param version - Optional release tag. When omitted, the latest
 * published release endpoint is used.
 * @returns The fully qualified GitHub API URL.
 */
function getReleaseUrl(repository: string, version?: string): string {
  const endpoint = version
    ? `/releases/tags/${encodeURIComponent(version)}`
    : "/releases/latest";

  return `${GITHUB_API_URL}/repos/${repository}${endpoint}`;
}

/**
 * Resolves and downloads the release asset matching the requested
 * architecture, returning its metadata and binary stream.
 *
 * This method accepts previously retrieved release metadata so that
 * callers can explicitly control the release lookup and asset download
 * as separate operations.
 *
 * The binary is streamed directly from GitHub without buffering the
 * complete archive in memory.
 *
 * @param release - Validated release metadata from `getGitHubRelease()`.
 * @param params - Validated download parameters containing the
 * requested architecture.
 * @returns A promise resolving to the downloadable artifact, including
 * its filename, content type, content length, release tag, and stream.
 * @throws {GitHubServiceError} With status 500 if GitHub configuration
 * is missing.
 * @throws {GitHubServiceError} With status 404 if no matching asset
 * exists or GitHub reports that the asset is unavailable.
 * @throws {GitHubServiceError} With status 502 if multiple assets
 * match, the asset URL is invalid, GitHub returns an unsuccessful
 * response, or the response has no body.
 * @throws {TypeError} If the asset request fails at the network level.
 */
export async function getDownloadableArtifact(
  release: GitHubArtifactRelease,
  params: DownloadParams,
): Promise<DownloadableArtifact> {
  const { pat } = getGitHubConfig();
  const asset = findReleaseAsset(release.assets, params.arch);

  if (!isValidGitHubAssetUrl(asset.url)) {
    throw new GitHubServiceError("GitHub returned an invalid asset URL.", 502);
  }

  return fetch(asset.url, {
    method: "GET",
    headers: {
      Accept: "application/octet-stream",
      Authorization: `Bearer ${pat}`,
      "X-GitHub-Api-Version": GITHUB_API_VERSION,
    },
    cache: "no-store",
  }).then((response) => {
    if (!response.ok) {
      throw new GitHubServiceError(
        "Unable to download the release asset from GitHub.",
        response.status === 404 ? 404 : 502,
      );
    }

    if (!response.body) {
      throw new GitHubServiceError(
        "GitHub returned an empty asset response.",
        502,
      );
    }

    const contentLengthHeader = response.headers.get("content-length");
    const parsedContentLength = contentLengthHeader
      ? Number(contentLengthHeader)
      : Number.NaN;

    const contentLength =
      Number.isSafeInteger(parsedContentLength) && parsedContentLength > 0
        ? parsedContentLength
        : asset.size > 0
          ? asset.size
          : undefined;

    return {
      arch: params.arch,
      version: release.tag_name,
      filename: asset.name,
      contentType:
        response.headers.get("content-type") ??
        asset.content_type ??
        "application/octet-stream",
      contentLength,
      stream: response.body,
    };
  });
}

/**
 * Ensures that a release asset URL points to the GitHub API host.
 *
 * This prevents the service from making server-side requests to
 * unexpected hosts using a URL obtained from an API response.
 *
 * @param value - Asset URL returned by GitHub.
 * @returns `true` if the URL uses HTTPS and the GitHub API hostname.
 */
function isValidGitHubAssetUrl(value: string): boolean {
  try {
    const url = new URL(value);

    return url.protocol === "https:" && url.hostname === "api.github.com";
  } catch {
    return false;
  }
}

/**
 * Finds the release asset with the exact expected filename
 * for the requested architecture.
 *
 * @param assets - Assets published with the GitHub release.
 * @param arch - Target architecture to match.
 * @returns The exact matching release asset.
 * @throws {GitHubServiceError} With status 404 if no asset matches.
 * @throws {GitHubServiceError} With status 502 if multiple assets match.
 */
function findReleaseAsset(
  assets: GitHubReleaseAsset[],
  arch: DownloadParams["arch"],
): GitHubReleaseAsset {
  const expectedFilename = RELEASE_ARCHIVES[arch];

  const matchingAssets = assets.filter(
    (asset) => asset.name === expectedFilename,
  );

  if (matchingAssets.length === 0) {
    throw new GitHubServiceError(
      `Release artifact not found: ${expectedFilename}`,
      404,
    );
  }

  if (matchingAssets.length > 1) {
    throw new GitHubServiceError(
      `Multiple release assets found for architecture "${arch}".`,
      502,
    );
  }

  return matchingAssets[0];
}

/**
 * Retrieves published releases from the configured GitHub repository.
 *
 * Drafts and releases without a publication date are excluded.
 * The returned data is mapped to the public release model.
 *
 * @returns A promise resolving to the published releases.
 * @throws {GitHubServiceError} With status 500 if GitHub configuration
 * is missing.
 * @throws {GitHubServiceError} With status 502 or 503 if GitHub returns
 * an unsuccessful response.
 * @throws {TypeError} If the request fails at the network level.
 * @throws {SyntaxError} If GitHub returns invalid JSON.
 */
export async function getGitHubReleases(): Promise<ReleaseMeta[]> {
  const { repository, pat } = getGitHubConfig();

  return fetch(`${GITHUB_API_URL}/repos/${repository}/releases`, {
    method: "GET",
    headers: {
      Accept: "application/vnd.github+json",
      Authorization: `Bearer ${pat}`,
      "X-GitHub-Api-Version": GITHUB_API_VERSION,
    },
    cache: "no-store",
  })
    .then((response) => {
      if (response.status === 404) {
        throw new GitHubServiceError("GitHub release not found.", 404);
      }

      if (!response.ok) {
        throw new GitHubServiceError(
          "Unable to retrieve releases from GitHub.",
          response.status >= 500 ? 503 : 502,
        );
      }

      return response.json() as Promise<unknown>;
    })
    .then((data) =>
      (data as unknown as GitHubReleaseMeta[])
        .filter((release) => !release.draft && release.published_at !== null)
        .map((release) => ({
          tag: release.tag_name,
          name: release.name?.trim() || release.tag_name,
          releasedAt: release.published_at,
        })),
    );
}

/**
 * Retrieves a published release by its tag from the configured GitHub
 * repository, including its release notes.
 *
 * Drafts and releases without a publication date are not exposed.
 *
 * @param tag - The release tag to retrieve.
 * @returns A promise resolving to the verbose public release model.
 * @throws {GitHubServiceError} With status 500 if GitHub configuration
 * is missing.
 * @throws {GitHubServiceError} With status 404 if the release does not
 * exist, is a draft, or has not been published.
 * @throws {GitHubServiceError} With status 502 or 503 if GitHub returns
 * an unsuccessful response.
 * @throws {TypeError} If the request fails at the network level.
 * @throws {SyntaxError} If GitHub returns invalid JSON.
 */
export async function getGitHubReleaseVerbose(
  tag: string,
): Promise<ReleaseDetailed> {
  const { repository, pat } = getGitHubConfig();

  return fetch(
    `${GITHUB_API_URL}/repos/${repository}/releases/tags/${encodeURIComponent(tag)}`,
    {
      method: "GET",
      headers: {
        Accept: "application/vnd.github+json",
        Authorization: `Bearer ${pat}`,
        "X-GitHub-Api-Version": GITHUB_API_VERSION,
      },
      cache: "no-store",
    },
  )
    .then((response) => {
      if (response.status === 404) {
        throw new GitHubServiceError("GitHub release not found.", 404);
      }

      if (!response.ok) {
        throw new GitHubServiceError(
          "Unable to retrieve release information from GitHub.",
          response.status >= 500 ? 503 : 502,
        );
      }

      return response.json() as Promise<unknown>;
    })
    .then((data) => {
      const release = data as unknown as GitHubReleaseDetailed;

      if (release.draft || release.published_at === null) {
        throw new GitHubServiceError("GitHub release not found.", 404);
      }

      return {
        tag: release.tag_name,
        name: release.name?.trim() || release.tag_name,
        releasedAt: release.published_at,
        content: release.body,
      };
    });
}
