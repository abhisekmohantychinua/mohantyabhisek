import { render, screen } from "@testing-library/react";
import type { JSX } from "react";
import { beforeEach, describe, expect, test, vi } from "vitest";

import type { CarouselApi } from "@/components/ui/carousel";

import AnimatedScroll from "./animated-scroll";

const { gsapTo, mockApi } = vi.hoisted(() => ({
  gsapTo: vi.fn(),

  mockApi: {
    scrollProgress: vi.fn(() => 0),
    on: vi.fn(),
    off: vi.fn(),
  },
}));

vi.mock("@gsap/react", () => ({
  useGSAP: (callback: () => void): void => {
    callback();
  },
}));

vi.mock("gsap", () => ({
  default: {
    to: gsapTo,
    registerPlugin: vi.fn(),
  },
}));

vi.mock("gsap/ScrollTrigger", () => ({
  ScrollTrigger: {},
}));

vi.mock("@/components/shared/brand-mark", () => ({
  default: ({ accentPercent }: { accentPercent?: number }): JSX.Element => (
    <div data-testid="brand-mark" data-accent-percent={accentPercent} />
  ),
}));

describe("AnimatedScroll", () => {
  beforeEach(() => {
    gsapTo.mockClear();

    mockApi.scrollProgress.mockClear();
    mockApi.on.mockClear();
    mockApi.off.mockClear();
    mockApi.scrollProgress.mockReturnValue(0);
  });

  describe("rendering", () => {
    test("renders the brand mark", () => {
      render(<AnimatedScroll />);

      expect(screen.getByTestId("brand-mark")).toBeInTheDocument();
    });

    test("starts with zero progress", () => {
      render(<AnimatedScroll />);

      expect(screen.getByTestId("brand-mark")).toHaveAttribute(
        "data-accent-percent",
        "0",
      );
    });
  });

  describe("entrance animation", () => {
    test("animates progress from zero to the initial progress", () => {
      render(<AnimatedScroll />);

      expect(gsapTo).toHaveBeenCalledTimes(1);

      const [target, options] = gsapTo.mock.calls[0];

      expect(target).toEqual({
        value: 0,
      });

      expect(options).toEqual(
        expect.objectContaining({
          value: 20,
          duration: 1,
          ease: "materialEase",
          scrollTrigger: {
            trigger: expect.any(HTMLDivElement),
            start: "top 90%",
            once: true,
          },
        }),
      );
    });

    test("updates progress during the entrance animation", () => {
      render(<AnimatedScroll />);

      const [, options] = gsapTo.mock.calls[0];

      const target = {
        value: 12,
      };

      const originalTarget = gsapTo.mock.calls[0][0];

      originalTarget.value = target.value;
      options.onUpdate();

      expect(screen.getByTestId("brand-mark")).toHaveAttribute(
        "data-accent-percent",
        "12",
      );
    });

    test("sets progress to 20 percent when the entrance completes", () => {
      render(<AnimatedScroll />);

      const [, options] = gsapTo.mock.calls[0];

      options.onComplete();

      expect(screen.getByTestId("brand-mark")).toHaveAttribute(
        "data-accent-percent",
        "20",
      );
    });
  });

  describe("carousel progress", () => {
    test("does not subscribe to the carousel before entrance completes", () => {
      render(<AnimatedScroll api={mockApi as unknown as CarouselApi} />);

      expect(mockApi.on).not.toHaveBeenCalled();
    });

    test("subscribes to carousel scrolling after entrance completes", () => {
      render(<AnimatedScroll api={mockApi as unknown as CarouselApi} />);

      const [, options] = gsapTo.mock.calls[0];

      options.onComplete();

      expect(mockApi.on).toHaveBeenCalledWith("scroll", expect.any(Function));
    });

    test("maps zero carousel progress to 20 percent", () => {
      mockApi.scrollProgress.mockReturnValue(0);

      render(<AnimatedScroll api={mockApi as unknown as CarouselApi} />);

      const [, options] = gsapTo.mock.calls[0];

      options.onComplete();

      expect(screen.getByTestId("brand-mark")).toHaveAttribute(
        "data-accent-percent",
        "20",
      );
    });

    test("maps half carousel progress to 60 percent", () => {
      mockApi.scrollProgress.mockReturnValue(0.5);

      render(<AnimatedScroll api={mockApi as unknown as CarouselApi} />);

      const [, options] = gsapTo.mock.calls[0];

      options.onComplete();

      expect(screen.getByTestId("brand-mark")).toHaveAttribute(
        "data-accent-percent",
        "60",
      );
    });

    test("maps full carousel progress to 100 percent", () => {
      mockApi.scrollProgress.mockReturnValue(1);

      render(<AnimatedScroll api={mockApi as unknown as CarouselApi} />);

      const [, options] = gsapTo.mock.calls[0];

      options.onComplete();

      expect(screen.getByTestId("brand-mark")).toHaveAttribute(
        "data-accent-percent",
        "100",
      );
    });

    test("updates progress when the carousel scrolls", () => {
      mockApi.scrollProgress.mockReturnValue(0.75);

      render(<AnimatedScroll api={mockApi as unknown as CarouselApi} />);

      const [, options] = gsapTo.mock.calls[0];

      options.onComplete();

      const scrollHandler = mockApi.on.mock.calls[0][1];

      scrollHandler();

      expect(screen.getByTestId("brand-mark")).toHaveAttribute(
        "data-accent-percent",
        "80",
      );
    });
  });

  describe("cleanup", () => {
    test("removes the carousel scroll listener on unmount", () => {
      const { unmount } = render(
        <AnimatedScroll api={mockApi as unknown as CarouselApi} />,
      );

      const [, options] = gsapTo.mock.calls[0];

      options.onComplete();

      const scrollHandler = mockApi.on.mock.calls[0][1];

      unmount();

      expect(mockApi.off).toHaveBeenCalledWith("scroll", scrollHandler);
    });
  });
});
