import { render, screen } from "@testing-library/react";
import type React from "react";
import { describe, expect, test, vi } from "vitest";

import type VideoType from "@/models/video";

vi.mock("@videojs/react", () => ({
  createPlayer: () => ({
    Provider: ({ children }: { children: React.ReactNode }): JSX.Element => (
      <>{children}</>
    ),
  }),
  videoFeatures: {},
}));

vi.mock("@videojs/react/video", () => ({
  MinimalVideoSkin: ({
    children,
  }: {
    children: React.ReactNode;
  }): JSX.Element => <>{children}</>,

  Video: ({
    src,
    poster,
    autoPlay,
    ...props
  }: {
    src: string;
    poster: string;
    autoPlay?: boolean;
  }): JSX.Element => (
    <video
      data-testid="video"
      data-src={src}
      data-poster={poster}
      data-autoplay={String(autoPlay)}
      {...props}
    />
  ),
}));

import type { JSX } from "react";

import VideoPlayer from "./index";

const video: VideoType = {
  slug: "test-video",
  url: "/videos/demo.mp4",

  alt: "Demo video",

  caption: "Demo caption",

  transcript: "This is the video transcript.",

  title: "Demo Video",

  description: "Demo description",
  duration: 90,
  uploadedAt: new Date(),

  thumbnail: {
    slug: "poster-image",

    url: "/images/poster.jpg",
    alt: "Poster image",
    caption: "Poster image caption",

    title: "Poster Image",
    description: "Poster image description",

    width: 1920,
    height: 1080,
  },
};

describe("VideoPlayer", () => {
  describe("rendering", () => {
    test("renders the figure element", (): void => {
      const { container } = render(<VideoPlayer video={video} />);

      expect(container.querySelector("figure")).toBeInTheDocument();
    });

    test("renders the video component", (): void => {
      render(<VideoPlayer video={video} />);

      expect(screen.getByTestId("video")).toBeInTheDocument();
    });

    test("renders the caption", (): void => {
      render(<VideoPlayer video={video} />);

      expect(screen.getByText("Demo caption")).toBeInTheDocument();
    });

    test("renders transcript summary", (): void => {
      render(<VideoPlayer video={video} />);

      expect(screen.getByText("Video transcript")).toBeInTheDocument();
    });

    test("renders transcript content", (): void => {
      render(<VideoPlayer video={video} />);

      expect(
        screen.getByText("This is the video transcript."),
      ).toBeInTheDocument();
    });
  });

  describe("video props", () => {
    test("passes src to video", (): void => {
      render(<VideoPlayer video={video} />);

      expect(screen.getByTestId("video")).toHaveAttribute(
        "data-src",
        "/videos/demo.mp4",
      );
    });

    test("passes poster to video", (): void => {
      render(<VideoPlayer video={video} />);

      expect(screen.getByTestId("video")).toHaveAttribute(
        "data-poster",
        "/images/poster.jpg",
      );
    });

    test("passes aria label to video", (): void => {
      render(<VideoPlayer video={video} />);

      expect(screen.getByTestId("video")).toHaveAttribute(
        "aria-label",
        "Demo video",
      );
    });

    test("disables autoplay by default", (): void => {
      render(<VideoPlayer video={video} />);

      expect(screen.getByTestId("video")).toHaveAttribute(
        "data-autoplay",
        "false",
      );
    });

    test("enables autoplay when requested", (): void => {
      render(<VideoPlayer video={video} autoPlay />);

      expect(screen.getByTestId("video")).toHaveAttribute(
        "data-autoplay",
        "true",
      );
    });
  });

  describe("selector prefix", () => {
    test("adds prefixed classes when selectorPrefix is provided", (): void => {
      const { container } = render(
        <VideoPlayer video={video} selectorPrefix="hero-" />,
      );

      expect(
        container.querySelector(".hero-video-player-figure"),
      ).toBeInTheDocument();

      expect(
        container.querySelector(".hero-video-player-figcaption"),
      ).toBeInTheDocument();

      expect(
        container.querySelector(".hero-video-player-details"),
      ).toBeInTheDocument();

      expect(
        container.querySelector(".hero-video-player-details-summary"),
      ).toBeInTheDocument();

      expect(
        container.querySelector(".hero-video-player-details-paragraph"),
      ).toBeInTheDocument();
    });

    test("does not add prefixed classes when selectorPrefix is omitted", (): void => {
      const { container } = render(<VideoPlayer video={video} />);

      expect(
        container.querySelector(".hero-video-player-figure"),
      ).not.toBeInTheDocument();
    });
  });
});
