/**
 * Relevant fields from a GitHub release response.
 */
interface GitHubRelease {
  /** Release tag, such as v0.1.0. */
  tag_name: string;

  /** Assets attached to the release. */
  assets: GitHubReleaseAsset[];
}
export default GitHubRelease;

/**
 * Relevant fields from a GitHub release asset response.
 */
export interface GitHubReleaseAsset {
  /** Asset filename as published in the release. */
  name: string;

  /** API URL used to retrieve the asset's binary content. */
  url: string;

  /** Asset size in bytes. */
  size: number;

  /** MIME type reported by GitHub, when available. */
  content_type: string | null;
}

/**
 * A published release retrieved from the GitHub API.
 */
export interface GitHubReleaseDetail {
  tag_name: string;
  name: string | null;
  draft: boolean;
  published_at: string | null;
}

export interface GitHubReleaseVerbose extends GitHubReleaseDetail {
  body: string | null;
}
