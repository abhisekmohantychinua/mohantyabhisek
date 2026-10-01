import type { DownloadParams } from "../models/download-params";
import type { DownloadableArtifact } from "../models/downloadable-artifact";
import type { GitHubRelease } from "../models/github-release";
import type { GitHubReleaseAsset } from "../models/github-release-asset";
import { GitHubServiceError } from "../models/github-service-error";

const GITHUB_API_URL = "https://api.github.com";
const GITHUB_API_VERSION = "2022-11-28";

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
 * Checks whether an unknown value contains the release fields required
 * to identify and download a release asset.
 *
 * @param value - Unknown response data received from GitHub.
 * @returns `true` if the value satisfies the minimum release structure.
 */
function isGitHubRelease(value: unknown): value is GitHubRelease {
  if (typeof value !== "object" || value === null) {
    return false;
  }

  const release = value as Record<string, unknown>;

  return (
    typeof release.tag_name === "string" &&
    Array.isArray(release.assets) &&
    release.assets.every(
      (asset: unknown) =>
        typeof asset === "object" &&
        asset !== null &&
        typeof (asset as Record<string, unknown>).name === "string" &&
        typeof (asset as Record<string, unknown>).url === "string" &&
        typeof (asset as Record<string, unknown>).size === "number" &&
        Number.isFinite((asset as Record<string, unknown>).size) &&
        ((asset as Record<string, unknown>).size as number) >= 0,
    )
  );
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
 * Finds the release asset whose filename contains the requested
 * architecture identifier.
 *
 * Asset filenames are expected to contain identifiers such as
 * `linux-amd64` or `windows-amd64`.
 *
 * @param assets - Assets published with the GitHub release.
 * @param arch - Target architecture to match.
 * @returns The unique matching release asset.
 * @throws {GitHubServiceError} With status 404 if no asset matches.
 * @throws {GitHubServiceError} With status 502 if multiple assets match.
 */
function findReleaseAsset(
  assets: GitHubReleaseAsset[],
  arch: DownloadParams["arch"],
): GitHubReleaseAsset {
  const matchingAssets = assets.filter((asset) =>
    asset.name.toLowerCase().includes(arch.toLowerCase()),
  );

  if (matchingAssets.length === 0) {
    throw new GitHubServiceError(
      `No release asset found for architecture "${arch}".`,
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
 * an unsuccessful response or an invalid release structure.
 * @throws {TypeError} If the request fails at the network level.
 * @throws {SyntaxError} If GitHub returns a response that cannot be
 * parsed as JSON.
 */
export async function getGitHubRelease(
  version?: string,
): Promise<GitHubRelease> {
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
    .then((data) => {
      if (!isGitHubRelease(data)) {
        throw new GitHubServiceError(
          "GitHub release response is missing required fields.",
          502,
        );
      }

      return data;
    });
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
export function getDownloadableArtifact(
  release: GitHubRelease,
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
      Number.isFinite(parsedContentLength) && parsedContentLength > 0
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
