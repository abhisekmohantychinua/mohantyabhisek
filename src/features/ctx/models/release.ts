/**
 * A release exposed through the CTX releases endpoint.
 */
interface ReleaseDetail {
  tag: string;
  name: string;
  releasedAt: string | null;
}

export default ReleaseDetail;

export interface ReleaseVerbose extends ReleaseDetail {
  content: string | null;
}
