import type { DownloadParams } from "./download-params";

/**
 * Represents a CTX CLI release artifact ready to be streamed to a client.
 */
export interface DownloadableArtifact {
  /** Target architecture of the artifact. */
  arch: DownloadParams["arch"];

  /** Resolved release version of the artifact. */
  version: string;

  /** Original filename of the release asset. */
  filename: string;

  /** MIME content type of the archive. */
  contentType: string;

  /** Artifact size in bytes, when provided by the source. */
  contentLength?: number;

  /** Readable stream containing the artifact bytes. */
  stream: ReadableStream<Uint8Array>;
}
