"use client";

import "@videojs/react/video/minimal-skin.css";

import { createPlayer, videoFeatures } from "@videojs/react";
import { MinimalVideoSkin, Video } from "@videojs/react/video";
import type { JSX } from "react";

import { cn } from "@/lib/utils";
import type VideoType from "@/models/video";

// eslint-disable-next-line @typescript-eslint/naming-convention
const Player = createPlayer({ features: videoFeatures });

type VideoPlayerProps = {
  selectorPrefix?: string;
  video: VideoType;
};

export default function VideoPlayer({
  selectorPrefix,
  video,
}: VideoPlayerProps): JSX.Element {
  return (
    <figure
      className={cn(
        "video-player__figure",
        selectorPrefix && `${selectorPrefix}__figure`,
      )}
    >
      <Player.Provider>
        <MinimalVideoSkin>
          <Video
            src={video.url}
            poster={video.thumbnail.url}
            aria-label={video.alt}
            autoPlay
            loop
            muted
            playsInline
          />
        </MinimalVideoSkin>
      </Player.Provider>
      <figcaption
        className={cn(
          "video-player__figcaption",
          selectorPrefix && `${selectorPrefix}__figcaption`,
        )}
      >
        {video.caption}
      </figcaption>
      <details
        className={cn(
          "video-player__details",
          selectorPrefix && `${selectorPrefix}__details`,
        )}
      >
        <summary
          className={cn(
            "video-player__details-summary",
            selectorPrefix && `${selectorPrefix}__details-summary`,
          )}
        >
          Video transcript
        </summary>
        <p
          className={cn(
            "video-player__details-paragraph",
            selectorPrefix && `${selectorPrefix}__details-paragraph`,
          )}
        >
          {video.transcript}
        </p>
      </details>
    </figure>
  );
}
