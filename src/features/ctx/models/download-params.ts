import type { z } from "zod";

import type { downloadParamsSchema } from "../schemas/download-params-schema";

/**
 * Validated query parameters for downloading a CTX CLI release artifact.
 */
export type DownloadParams = z.infer<typeof downloadParamsSchema>;
