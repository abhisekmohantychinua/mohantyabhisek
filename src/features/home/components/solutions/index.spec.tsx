import { render, screen } from "@testing-library/react";
import type { JSX, ReactNode } from "react";
import { beforeEach, describe, expect, test, vi } from "vitest";

import type { CarouselApi } from "@/components/ui/carousel";

import Solutions from ".";

const { mockApi, mockAnimatedScroll, mockCarousel } = vi.hoisted(() => ({
  mockApi: {} as CarouselApi,
  mockAnimatedScroll: vi.fn(),
  mockCarousel: vi.fn(),
}));

vi.mock("next/image", () => ({
  default: ({ alt, ...props }: { alt: string }): JSX.Element => (
    // eslint-disable-next-line @next/next/no-img-element
    <img {...props} alt={alt} />
  ),
}));

vi.mock("./animated-scroll", () => ({
  default: (props: { api?: CarouselApi }): JSX.Element => {
    mockAnimatedScroll(props);

    return <div data-testid="animated-scroll" />;
  },
}));

vi.mock("@/components/ui/carousel", () => ({
  Carousel: ({
    children,
    setApi,
    opts,
    className,
  }: {
    children?: ReactNode;
    setApi?: (api: CarouselApi) => void;
    opts?: {
      dragFree?: boolean;
      align?: string;
    };
    className?: string;
  }): JSX.Element => {
    mockCarousel({
      opts,
      className,
    });

    setApi?.(mockApi);

    return <div data-testid="carousel">{children}</div>;
  },

  CarouselContent: ({ children }: { children?: ReactNode }): JSX.Element => (
    <div>{children}</div>
  ),

  CarouselItem: ({
    children,
    className,
  }: {
    children?: ReactNode;
    className?: string;
  }): JSX.Element => <div className={className}>{children}</div>,
}));

describe("Solutions", () => {
  beforeEach(() => {
    mockAnimatedScroll.mockClear();
    mockCarousel.mockClear();
  });

  describe("rendering", () => {
    test("renders the section heading and description", () => {
      render(<Solutions />);

      expect(
        screen.getByRole("heading", {
          name: "Websites, Web Applications, And Business Systems",
        }),
      ).toBeInTheDocument();

      expect(
        screen.getByText(
          /From establishing an online presence to building products/i,
        ),
      ).toBeInTheDocument();
    });

    test("renders the solutions kicker", () => {
      render(<Solutions />);

      expect(screen.getByText("Solutions")).toBeInTheDocument();
    });

    test("renders all solution cards", () => {
      render(<Solutions />);

      expect(
        screen.getByRole("heading", {
          name: "Websites For Businesses",
          level: 3,
        }),
      ).toBeInTheDocument();

      expect(
        screen.getByRole("heading", {
          name: "Custom Web Applications & SaaS Products",
          level: 3,
        }),
      ).toBeInTheDocument();

      expect(
        screen.getByRole("heading", {
          name: "ERP, CRM & Internal Management Systems",
          level: 3,
        }),
      ).toBeInTheDocument();
    });

    test("renders all solution images", () => {
      render(<Solutions />);

      expect(
        screen.getByAltText(
          "Websites For Businesses - Helping people understand your business before the first conversation.",
        ),
      ).toBeInTheDocument();

      expect(
        screen.getByAltText(
          "Custom Web Applications & SaaS Products - From product ideas to usable software.",
        ),
      ).toBeInTheDocument();

      expect(
        screen.getByAltText(
          "ERP, CRM & Internal Management Systems - Bringing people, processes, and information together.",
        ),
      ).toBeInTheDocument();
    });
  });

  describe("carousel", () => {
    test("configures the carousel for free dragging and start alignment", () => {
      render(<Solutions />);

      expect(mockCarousel).toHaveBeenCalledWith({
        opts: {
          dragFree: true,
          align: "start",
        },
        className: "solutions__carousel",
      });
    });

    test("passes the carousel API to AnimatedScroll", () => {
      render(<Solutions />);

      expect(mockAnimatedScroll).toHaveBeenCalledWith({
        api: mockApi,
      });
    });
  });
});
