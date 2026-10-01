/**
 * Relevant fields from a GitHub release list response.
 */
export interface GitHubReleaseSummary {
  /** Release tag, such as v1.2.0. */
  tag_name: string;

  /** Release name, which may be null. */
  name: string | null;

  /** Whether the release is a draft. */
  draft: boolean;

  /** Publication timestamp, which may be null. */
  published_at: string | null;
}
