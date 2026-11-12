import type ReleaseMeta from "./release-meta";

interface ReleaseDetailed extends ReleaseMeta {
  content: string | null;
}

export default ReleaseDetailed;
