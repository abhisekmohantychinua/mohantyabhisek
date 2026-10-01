import type { GitHubReleaseAsset } from "./github-release-asset";

/**
 * Relevant fields from a GitHub release response.
 */
export interface GitHubRelease {
  /** Release tag, such as v0.1.0. */
  tag_name: string;

  /** Assets attached to the release. */
  assets: GitHubReleaseAsset[];
}
