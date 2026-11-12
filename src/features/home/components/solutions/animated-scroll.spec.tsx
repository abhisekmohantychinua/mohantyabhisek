import { render, screen, waitFor } from "@testing-library/react";
import type { JSX } from "react";
import { afterEach, beforeEach, describe, expect, test, vi } from "vitest";

import type { CarouselApi } from "@/components/ui/carousel";

import AnimatedScroll from "./animated-scroll";

const {
  mockGsapTo,
  mockGsapRegisterPlugin,
  mockScrollProgress,
  mockApiOn,
  mockApiOff,
} = vi.hoisted(() => ({
  mockGsapTo: vi.fn(),
  mockGsapRegisterPlugin: vi.fn(),
  mockScrollProgress: vi.fn(),
  mockApiOn: vi.fn(),
  mockApiOff: vi.fn(),
}));

const mockApi = {
  scrollProgress: mockScrollProgress,
  on: mockApiOn,
  off: mockApiOff,
} as unknown as CarouselApi;

vi.mock("@gsap/react", async () => {
  const { useLayoutEffect } = await import("react");

  return {
    useGSAP: (callback: () => void): void => {
      useLayoutEffect(() => {
        callback();
        // The mock intentionally runs the GSAP callback once after mount.
        // eslint-disable-next-line react-hooks/exhaustive-deps
      }, []);
    },
  };
});

vi.mock("gsap", () => ({
  default: {
    to: mockGsapTo,
    registerPlugin: mockGsapRegisterPlugin,
  },
}));

vi.mock("gsap/ScrollTrigger", () => ({
  ScrollTrigger: {},
}));

vi.mock("@/components/shared/brand-mark", () => ({
  default: ({
    accentPercent,
    ...props
  }: {
    accentPercent: number;
    variant: string;
    className?: string;
    height?: number;
  }): JSX.Element => (
    <div
      {...props}
      data-testid="brand-mark"
      data-accent-percent={accentPercent}
    />
  ),
}));

describe("AnimatedScroll", () => {
  beforeEach(() => {
    vi.clearAllMocks();

    mockScrollProgress.mockReturnValue(0);

    mockGsapTo.mockImplementation(
      (
        target: { value: number },
        options: {
          value: number;
          onUpdate?: () => void;
        },
      ) => {
        target.value = options.value;
        options.onUpdate?.();

        return {
          kill: vi.fn(),
        };
      },
    );
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  test("renders the brand mark", () => {
    render(<AnimatedScroll api={mockApi} />);

    expect(screen.getByTestId("brand-mark")).toBeInTheDocument();
  });

  test("animates progress from zero to 20 percent", async () => {
    render(<AnimatedScroll />);

    await waitFor(() => {
      expect(mockGsapTo).toHaveBeenCalledTimes(1);
    });

    const [target, options] = mockGsapTo.mock.calls[0];

    expect(target).toEqual({
      value: 20,
    });

    expect(options.value).toBe(20);
  });

  test("animates the initial progress to 20 percent", async () => {
    render(<AnimatedScroll />);

    await waitFor(() => {
      expect(mockGsapTo).toHaveBeenCalledTimes(1);
    });

    const [target, options] = mockGsapTo.mock.calls[0];

    expect(target).toEqual({
      value: 20,
    });

    expect(options).toMatchObject({
      value: 20,
      duration: 1,
      ease: "materialEase",
      scrollTrigger: {
        start: "top 90%",
        once: true,
      },
    });
  });

  test("uses the container as the ScrollTrigger trigger", async () => {
    render(<AnimatedScroll />);

    await waitFor(() => {
      expect(mockGsapTo).toHaveBeenCalledTimes(1);
    });

    const [, options] = mockGsapTo.mock.calls[0];

    expect(options.scrollTrigger.trigger).toBe(
      screen.getByTestId("brand-mark").parentElement,
    );
  });

  test("updates progress during the entrance animation", async () => {
    render(<AnimatedScroll />);

    await waitFor(() => {
      expect(mockGsapTo).toHaveBeenCalledTimes(1);
    });

    expect(screen.getByTestId("brand-mark")).toHaveAttribute(
      "data-accent-percent",
      "20",
    );
  });

  test("sets progress to 20 percent when the entrance animation completes", async () => {
    mockGsapTo.mockImplementation(
      (
        target: { value: number },
        options: {
          value: number;
          onUpdate?: () => void;
          onComplete?: () => void;
        },
      ) => {
        target.value = options.value;

        options.onUpdate?.();
        options.onComplete?.();

        return {
          kill: vi.fn(),
        };
      },
    );

    render(<AnimatedScroll />);

    await waitFor(() => {
      expect(screen.getByTestId("brand-mark")).toHaveAttribute(
        "data-accent-percent",
        "20",
      );
    });
  });

  test("does not subscribe to carousel events before entrance completes", () => {
    render(<AnimatedScroll api={mockApi} />);

    expect(mockApiOn).not.toHaveBeenCalled();
  });

  test("subscribes to carousel scroll events after entrance completes", async () => {
    mockGsapTo.mockImplementation(
      (
        target: { value: number },
        options: {
          value: number;
          onUpdate?: () => void;
          onComplete?: () => void;
        },
      ) => {
        target.value = options.value;

        options.onUpdate?.();
        options.onComplete?.();

        return {
          kill: vi.fn(),
        };
      },
    );

    render(<AnimatedScroll api={mockApi} />);

    await waitFor(() => {
      expect(mockApiOn).toHaveBeenCalledTimes(1);
    });

    expect(mockApiOn).toHaveBeenCalledWith("scroll", expect.any(Function));
  });

  test("maps zero carousel progress to 20 percent", async () => {
    mockScrollProgress.mockReturnValue(0);

    mockGsapTo.mockImplementation(
      (
        target: { value: number },
        options: {
          value: number;
          onUpdate?: () => void;
          onComplete?: () => void;
        },
      ) => {
        target.value = options.value;

        options.onUpdate?.();
        options.onComplete?.();

        return {
          kill: vi.fn(),
        };
      },
    );

    render(<AnimatedScroll api={mockApi} />);

    await waitFor(() => {
      expect(mockApiOn).toHaveBeenCalledTimes(1);
    });

    const updateProgress = mockApiOn.mock.calls[0][1];

    updateProgress();

    expect(screen.getByTestId("brand-mark")).toHaveAttribute(
      "data-accent-percent",
      "20",
    );
  });

  test("maps half carousel progress to 60 percent", async () => {
    mockScrollProgress.mockReturnValue(0.5);

    mockGsapTo.mockImplementation(
      (
        target: { value: number },
        options: {
          value: number;
          onUpdate?: () => void;
          onComplete?: () => void;
        },
      ) => {
        target.value = options.value;

        options.onUpdate?.();
        options.onComplete?.();

        return {
          kill: vi.fn(),
        };
      },
    );

    render(<AnimatedScroll api={mockApi} />);

    await waitFor(() => {
      expect(mockApiOn).toHaveBeenCalledTimes(1);
    });

    const updateProgress = mockApiOn.mock.calls[0][1];

    updateProgress();

    expect(screen.getByTestId("brand-mark")).toHaveAttribute(
      "data-accent-percent",
      "60",
    );
  });

  test("maps full carousel progress to 100 percent", async () => {
    mockScrollProgress.mockReturnValue(1);

    mockGsapTo.mockImplementation(
      (
        target: { value: number },
        options: {
          value: number;
          onUpdate?: () => void;
          onComplete?: () => void;
        },
      ) => {
        target.value = options.value;

        options.onUpdate?.();
        options.onComplete?.();

        return {
          kill: vi.fn(),
        };
      },
    );

    render(<AnimatedScroll api={mockApi} />);

    await waitFor(() => {
      expect(mockApiOn).toHaveBeenCalledTimes(1);
    });

    const updateProgress = mockApiOn.mock.calls[0][1];

    updateProgress();

    expect(screen.getByTestId("brand-mark")).toHaveAttribute(
      "data-accent-percent",
      "100",
    );
  });

  test("updates progress when the carousel scrolls", async () => {
    mockScrollProgress.mockReturnValue(0.75);

    mockGsapTo.mockImplementation(
      (
        target: { value: number },
        options: {
          value: number;
          onUpdate?: () => void;
          onComplete?: () => void;
        },
      ) => {
        target.value = options.value;

        options.onUpdate?.();
        options.onComplete?.();

        return {
          kill: vi.fn(),
        };
      },
    );

    render(<AnimatedScroll api={mockApi} />);

    await waitFor(() => {
      expect(mockApiOn).toHaveBeenCalledTimes(1);
    });

    const updateProgress = mockApiOn.mock.calls[0][1];

    updateProgress();

    expect(screen.getByTestId("brand-mark")).toHaveAttribute(
      "data-accent-percent",
      "80",
    );
  });

  test("unsubscribes from carousel scroll events on unmount", async () => {
    mockGsapTo.mockImplementation(
      (
        target: { value: number },
        options: {
          value: number;
          onUpdate?: () => void;
          onComplete?: () => void;
        },
      ) => {
        target.value = options.value;

        options.onUpdate?.();
        options.onComplete?.();

        return {
          kill: vi.fn(),
        };
      },
    );

    const { unmount } = render(<AnimatedScroll api={mockApi} />);

    await waitFor(() => {
      expect(mockApiOn).toHaveBeenCalledTimes(1);
    });

    const updateProgress = mockApiOn.mock.calls[0][1];

    unmount();

    expect(mockApiOff).toHaveBeenCalledTimes(1);
    expect(mockApiOff).toHaveBeenCalledWith("scroll", updateProgress);
  });
});
