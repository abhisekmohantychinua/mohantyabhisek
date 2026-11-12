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
        /^v(0|[1-9]\d*)\.(0|[1-9]\d*)\.(0|[1-9]\d*)(?:-((?:0|[1-9]\d*|\d*[A-Za-z-][0-9A-Za-z-]*)(?:\.(?:0|[1-9]\d*|\d*[A-Za-z-][0-9A-Za-z-]*))*))?(?:\+([0-9A-Za-z-]+(?:\.[0-9A-Za-z-]+)*))?$/,
        "Version must follow SemVer 2.0.0, prefixed with 'v'.",
      )
      .optional(),
  })
  .strict();
