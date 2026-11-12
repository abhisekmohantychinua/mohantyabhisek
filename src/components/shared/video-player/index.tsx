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
  autoPlay?: boolean;
};

export default function VideoPlayer({
  selectorPrefix,
  video,
  autoPlay = false,
}: VideoPlayerProps): JSX.Element {
  return (
    <figure
      className={cn(
        "video-player__figure",
        selectorPrefix && `${selectorPrefix}video-player-figure`,
      )}
    >
      <Player.Provider>
        <MinimalVideoSkin>
          <Video
            src={video.url}
            poster={video.thumbnail.url}
            aria-label={video.alt}
            autoPlay={autoPlay}
            loop
            muted
            playsInline
          />
        </MinimalVideoSkin>
      </Player.Provider>
      <figcaption
        className={cn(
          "video-player__figcaption",
          selectorPrefix && `${selectorPrefix}video-player-figcaption`,
        )}
      >
        {video.caption}
      </figcaption>
      <details
        className={cn(
          "video-player__details",
          selectorPrefix && `${selectorPrefix}video-player-details`,
        )}
      >
        <summary
          className={cn(
            "video-player__details-summary",
            selectorPrefix && `${selectorPrefix}video-player-details-summary`,
          )}
        >
          Video transcript
        </summary>
        <p
          className={cn(
            "video-player__details-paragraph",
            selectorPrefix && `${selectorPrefix}video-player-details-paragraph`,
          )}
        >
          {video.transcript}
        </p>
      </details>
    </figure>
  );
}
