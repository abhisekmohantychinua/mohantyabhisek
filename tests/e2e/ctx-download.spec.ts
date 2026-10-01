import { stat } from "node:fs/promises";

import { expect, test } from "@playwright/test";

const DOWNLOAD_ENDPOINT = "/api/ctx/download";
const BASE_URL =
  process.env.PLAYWRIGHT_TEST_BASE_URL ?? "http://localhost:3000";

const RELEASE_TAG = process.env.CTX_CLI_TEST_RELEASE_TAG;

const ARCHITECTURES = [
  "windows-amd64",
  "linux-amd64",
  "linux-arm64",
  "macos-amd64",
  "macos-arm64",
] as const;

const RELEASE_ARCHIVES = {
  "windows-amd64": "ctx-windows-amd64.zip",
  "linux-amd64": "ctx-linux-amd64.tar.gz",
  "linux-arm64": "ctx-linux-arm64.tar.gz",
  "macos-amd64": "ctx-macos-amd64.tar.gz",
  "macos-arm64": "ctx-macos-arm64.tar.gz",
} as const;

const TEST_TIMEOUT = 5 * 60 * 1000;
const DOWNLOAD_TIMEOUT = 4 * 60 * 1000;

const isGitHubConfigured = Boolean(
  process.env.CTX_CLI_GITHUB_REPO && process.env.CTX_CLI_GITHUB_PAT,
);

function getDownloadUrl(
  arch?: string,
  version: string | undefined = RELEASE_TAG,
): string {
  const url = new URL(DOWNLOAD_ENDPOINT, BASE_URL);

  if (arch) {
    url.searchParams.set("arch", arch);
  }

  if (version) {
    url.searchParams.set("version", version);
  }

  return url.toString();
}

function getContentDispositionFilename(
  contentDisposition: string | undefined,
): string | undefined {
  if (!contentDisposition) {
    return undefined;
  }

  const match = contentDisposition.match(/filename\*=UTF-8''([^;]+)/i);

  if (!match) {
    return undefined;
  }

  try {
    return decodeURIComponent(match[1]);
  } catch {
    return undefined;
  }
}

test.describe("GET /api/ctx/download", () => {
  test.describe("Request validation", () => {
    test("returns 400 when architecture is missing", async ({ request }) => {
      const response = await request.get(getDownloadUrl());

      expect(response.status()).toBe(400);

      const body = await response.json();
      expect(body.message).toEqual(expect.any(String));
    });

    test("returns 400 for an unsupported architecture", async ({ request }) => {
      const response = await request.get(getDownloadUrl("freebsd-amd64"));

      expect(response.status()).toBe(400);

      const body = await response.json();
      expect(body.message).toEqual(expect.any(String));
    });

    test("returns 400 when version is invalid", async ({ request }) => {
      const response = await request.get(
        getDownloadUrl("linux-amd64", "latest"),
      );

      expect(response.status()).toBe(400);

      await expect(response.json()).resolves.toEqual({
        message: "Version must be in the format vX.Y.Z or vX.Y.Z-SNAPSHOT.",
      });
    });

    for (const version of [
      "1.2.3",
      "v1.2",
      "v1.2.3-beta",
      "v1.2.3-SNAPSHOT-extra",
    ]) {
      test(`returns 400 for invalid version format: ${version}`, async ({
        request,
      }) => {
        const response = await request.get(
          getDownloadUrl("linux-amd64", version),
        );

        expect(response.status(), `version: ${version}`).toBe(400);

        const body = await response.json();
        expect(body.message).toEqual(expect.any(String));
      });
    }
  });

  test.describe("Artifact delivery", () => {
    test.beforeAll(() => {
      expect(
        isGitHubConfigured,
        "Set CTX_CLI_GITHUB_REPO and CTX_CLI_GITHUB_PAT in the E2E environment.",
      ).toBe(true);
    });

    test.describe.configure({ mode: "parallel" });

    for (const arch of ARCHITECTURES) {
      test(`downloads the ${arch} artifact`, async ({ page }) => {
        test.setTimeout(TEST_TIMEOUT);

        const downloadUrl = getDownloadUrl(arch);

        await page.goto(BASE_URL);

        const responsePromise = page.waitForResponse(
          (response) => {
            const url = new URL(response.url());

            return (
              url.pathname === DOWNLOAD_ENDPOINT &&
              url.searchParams.get("arch") === arch &&
              url.searchParams.get("version") === (RELEASE_TAG ?? null)
            );
          },
          { timeout: DOWNLOAD_TIMEOUT },
        );

        const downloadPromise = page.waitForEvent("download", {
          timeout: DOWNLOAD_TIMEOUT,
        });

        await page.evaluate((href) => {
          const link = document.createElement("a");
          link.href = href;
          link.id = "artifact-download";
          link.textContent = "Download artifact";
          document.body.appendChild(link);
        }, downloadUrl);

        await page.locator("#artifact-download").click();

        const response = await responsePromise;

        expect(
          response.status(),
          `The ${arch} endpoint should return HTTP 200.`,
        ).toBe(200);

        const headers = response.headers();

        expect(headers["content-type"]).toBeTruthy();
        expect(headers["cache-control"]).toBe("private, no-store");

        const contentDisposition = headers["content-disposition"];

        expect(contentDisposition).toMatch(
          /^attachment;\s*filename="[^"]+";\s*filename\*=UTF-8''[^;]+$/i,
        );

        expect(getContentDispositionFilename(contentDisposition)).toBe(
          RELEASE_ARCHIVES[arch],
        );

        const contentLengthHeader = headers["content-length"];
        let expectedLength: number | undefined;

        if (contentLengthHeader !== undefined) {
          expectedLength = Number(contentLengthHeader);

          expect(Number.isSafeInteger(expectedLength)).toBe(true);
          expect(expectedLength).toBeGreaterThan(0);
        }

        const download = await downloadPromise;

        expect(
          await download.failure(),
          `The ${arch} download should complete without an error.`,
        ).toBeNull();

        // Some browser engines report a generic suggested filename.
        // The actual artifact filename is verified from Content-Disposition.
        expect(download.suggestedFilename().length).toBeGreaterThan(0);

        const filePath = await download.path();
        expect(filePath).not.toBeNull();

        const file = await stat(filePath!);

        expect(
          file.size,
          `The ${arch} artifact should not be empty.`,
        ).toBeGreaterThan(0);

        if (expectedLength !== undefined) {
          expect(
            file.size,
            `The downloaded ${arch} artifact size should match Content-Length.`,
          ).toBe(expectedLength);
        }
      });
    }
  });
});
