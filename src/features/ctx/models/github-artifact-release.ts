interface GitHubArtifactRelease {
  tag_name: string;
  assets: GitHubReleaseAsset[];
}
export default GitHubArtifactRelease;

export interface GitHubReleaseAsset {
  name: string;
  url: string;
  size: number;
  content_type: string | null;
}
