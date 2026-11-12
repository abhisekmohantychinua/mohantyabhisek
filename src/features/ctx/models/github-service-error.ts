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

    Object.defineProperty(this, "message", {
      value: message,
      enumerable: true,
      configurable: true,
      writable: true,
    });
    Object.defineProperty(this, "status", {
      value: status,
      enumerable: true,
      configurable: true,
      writable: true,
    });
  }
}
