import type GitHubReleaseMeta from "./github-release-meta";

interface GitHubReleaseDetailed extends GitHubReleaseMeta {
  body: string | null;
}

export default GitHubReleaseDetailed;
