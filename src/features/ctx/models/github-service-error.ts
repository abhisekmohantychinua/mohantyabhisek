/**
 * Represents an error returned while resolving or downloading a GitHub release.
 */
export class GitHubServiceError extends Error {
  constructor(
    message: string,
    public readonly status: number,
  ) {
    super(message);
    this.name = "GitHubServiceError";
  }
}
