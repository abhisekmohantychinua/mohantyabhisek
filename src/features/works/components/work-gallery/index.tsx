import "./styles.css";

import Image from "next/image";
import type { JSX } from "react";

import VideoPlayer from "@/components/shared/video-player";

import type Work from "../../models/work";

type WorkGallery = Pick<Work, "gallery">;

export default function WorkGallery({ gallery }: WorkGallery): JSX.Element {
  return (
    <section className="work-gallery">
      {gallery.map((imageOrVideo) => {
        if (!("thumbnail" in imageOrVideo))
          return (
            <figure
              key={imageOrVideo.slug}
              className="work-gallery__image-figure"
            >
              <Image
                src={imageOrVideo.url}
                alt={imageOrVideo.url}
                width={1440}
                height={810}
                className="work-gallery__image-image"
              />
              <figcaption className="work-gallery__image-figcaption">
                {imageOrVideo.caption}
              </figcaption>
            </figure>
          );
        else
          return (
            <VideoPlayer
              key={imageOrVideo.slug}
              video={imageOrVideo}
              selectorPrefix="work-gallery__video-"
            />
          );
      })}
    </section>
  );
}
