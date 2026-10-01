/**
 * A published release retrieved from the GitHub API.
 */
export interface GitHubRelease {
  tag_name: string;
  name: string | null;
  draft: boolean;
  published_at: string | null;
}

/**
 * A release exposed through the CTX releases endpoint.
 */
interface Release {
  tag: string;
  name: string;
  releasedAt: string | null;
}

export default Release;

export interface ReleaseVerbose extends Release {
  content: string | null;
}
