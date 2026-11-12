import type Video from "@/models/video";

/**
 * Generates a JSON-LD schema for a video object.
 * @param video - The video object to generate the schema for.
 * @returns A JSON-LD schema object representing the video.
 */
export function generateVideoSchema(video: Video): Record<string, unknown> {
  return {
    "@context": "https://schema.org",
    "@type": "VideoObject",
    name: video.title,
    description: video.description,
    thumbnailUrl: video.thumbnail.url,
    thumbnail: {
      "@type": "ImageObject",
      url: video.thumbnail.url,
      width: video.thumbnail.width,
      height: video.thumbnail.height,
    },
    contentUrl: video.url,
    uploadDate: video.uploadedAt.toISOString(),
    duration: `PT${video.duration}S`,
  };
}
