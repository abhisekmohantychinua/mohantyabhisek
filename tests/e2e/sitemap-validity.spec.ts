import { expect, test } from "@playwright/test";

const sitemapUrl = "https://mohantyabhisek.com/sitemap.xml";

test("sitemap media resources are accessible", async ({ page, request }) => {
  const sitemapResponse = await request.get(sitemapUrl);

  expect(sitemapResponse.status()).toBe(200);

  const xml = await sitemapResponse.text();

  const mediaUrls = await page.evaluate((xmlContent) => {
    const document = new DOMParser().parseFromString(
      xmlContent,
      "application/xml",
    );

    if (document.querySelector("parsererror")) {
      throw new Error("The sitemap contains invalid XML.");
    }

    const getUrls = (tagName: string) =>
      Array.from(document.getElementsByTagName("*"))
        .filter((element) => element.localName === tagName)
        .map((element) => element.textContent?.trim() ?? "")
        .filter(Boolean);

    return {
      thumbnails: getUrls("thumbnail_loc"),
      videos: getUrls("content_loc"),
    };
  }, xml);

  expect(
    mediaUrls.thumbnails.length,
    "The sitemap should contain video thumbnails.",
  ).toBeGreaterThan(0);

  expect(
    mediaUrls.videos.length,
    "The sitemap should contain video content URLs.",
  ).toBeGreaterThan(0);

  for (const url of mediaUrls.thumbnails) {
    const response = await request.get(url);

    expect(response.status(), `Thumbnail is inaccessible: ${url}`).toBe(200);

    expect(response.headers()["content-type"]).toMatch(/^image\//);
  }

  for (const url of mediaUrls.videos) {
    const response = await request.get(url, {
      headers: { Range: "bytes=0-0" },
    });

    expect([200, 206], `Video is inaccessible: ${url}`).toContain(
      response.status(),
    );

    expect(response.headers()["content-type"]).toMatch(/^video\//);
  }
});
