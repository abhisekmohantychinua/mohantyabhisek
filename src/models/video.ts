import type Image from "./image";

interface Video {
  slug: string;

  url: string;
  alt: string;
  caption: string;
  transcript: string;

  title: string;
  description: string;

  thumbnail: Image;
  duration: number;
  uploadedAt: Date;
}

export default Video;
