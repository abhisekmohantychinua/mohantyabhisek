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
