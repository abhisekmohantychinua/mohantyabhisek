import { describe, expect, test } from "vitest";

import { generateVideoSchema } from "./video-service";

describe("video-services", () => {
  describe("generateVideoSchema", () => {
    test("generates a valid VideoObject schema from a video", () => {
      const uploadedAt = new Date("2025-01-15T10:30:00.000Z");

      const video = {
        slug: "intro-video",

        url: "https://example.com/videos/intro.mp4",
        alt: "Introduction video",
        caption: "Introduction",
        transcript: "Welcome to the introduction video.",

        title: "Introduction Video",
        description: "A brief introduction.",

        thumbnail: {
          slug: "intro-thumbnail",
          url: "https://example.com/images/thumbnail.jpg",
          alt: "Thumbnail",
          caption: "Thumbnail caption",

          title: "Thumbnail Title",
          description: "Thumbnail Description",

          width: 1280,
          height: 720,
        },

        duration: 125,
        uploadedAt,
      };

      const result = generateVideoSchema(video);

      expect(result).toEqual({
        "@context": "https://schema.org",
        "@type": "VideoObject",
        name: "Introduction Video",
        description: "A brief introduction.",
        thumbnailUrl: "https://example.com/images/thumbnail.jpg",
        thumbnail: {
          "@type": "ImageObject",
          url: "https://example.com/images/thumbnail.jpg",
          width: 1280,
          height: 720,
        },
        contentUrl: "https://example.com/videos/intro.mp4",
        uploadDate: "2025-01-15T10:30:00.000Z",
        duration: "PT125S",
      });
    });

    test("formats duration using ISO 8601 seconds format", () => {
      const video = {
        slug: "video",

        url: "https://example.com/video.mp4",
        alt: "",
        caption: "",
        transcript: "",

        title: "Video",
        description: "Description",

        thumbnail: {
          slug: "thumbnail",
          url: "https://example.com/thumbnail.jpg",
          alt: "",
          caption: "",

          title: "",
          description: "",

          width: 640,
          height: 360,
        },

        duration: 3600,
        uploadedAt: new Date("2025-01-01T00:00:00.000Z"),
      };

      const result = generateVideoSchema(video);

      expect(result.duration).toBe("PT3600S");
    });

    test("formats uploadDate as an ISO string", () => {
      const uploadedAt = new Date("2025-03-20T12:45:30.123Z");

      const video = {
        slug: "video",

        url: "https://example.com/video.mp4",
        alt: "",
        caption: "",
        transcript: "",

        title: "Video",
        description: "Description",

        thumbnail: {
          slug: "thumbnail",
          url: "https://example.com/thumbnail.jpg",
          alt: "",
          caption: "",

          title: "",
          description: "",

          width: 640,
          height: 360,
        },

        duration: 60,
        uploadedAt,
      };

      const result = generateVideoSchema(video);

      expect(result.uploadDate).toBe(uploadedAt.toISOString());
    });
  });
});
