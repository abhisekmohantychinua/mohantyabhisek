import { z } from "zod";

/**
 * Validates the query parameters accepted by the CTX download endpoint.
 */
export const downloadParamsSchema = z
  .object({
    arch: z.enum([
      "windows-amd64",
      "linux-amd64",
      "linux-arm64",
      "macos-amd64",
      "macos-arm64",
    ]),
    version: z
      .string()
      .regex(
        /^v\d+\.\d+\.\d+(?:-SNAPSHOT)?$/,
        "Version must be in the format vX.Y.Z or vX.Y.Z-SNAPSHOT.",
      )
      .optional(),
  })
  .strict();
