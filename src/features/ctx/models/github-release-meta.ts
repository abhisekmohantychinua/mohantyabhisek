interface GitHubReleaseMeta {
  tag_name: string;
  name: string | null;
  draft: boolean;
  published_at: string | null;
}

export default GitHubReleaseMeta;
