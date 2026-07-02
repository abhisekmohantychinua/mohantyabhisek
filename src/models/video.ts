import Image from "./image";

interface Video {
  slug: string;

  url: string;
  alt: string;
  caption: string;
  transcript: string;

  title: string;
  description: string;

  duration: number;
  thumbnail: Image;
}

export default Video;
