import { fireEvent, render, screen } from "@testing-library/react";
import type { JSX } from "react";
import { StrictMode } from "react";
import { afterEach, beforeEach, describe, expect, test, vi } from "vitest";

import CtaDialog from "./index";

const { sendGTMEventMock } = vi.hoisted(() => ({
  sendGTMEventMock: vi.fn(),
}));

vi.mock("@next/third-parties/google", () => ({
  sendGTMEvent: sendGTMEventMock,
}));

vi.mock("./cta-stepper", () => ({
  default: ({
    onSubmitSuccess,
    initialMessage,
  }: {
    onSubmitSuccess?: () => void;
    initialMessage?: string;
  }): JSX.Element => (
    <div data-testid="cta-stepper">
      <p>Mock CTA Stepper</p>
      <span data-testid="initial-message">{initialMessage ?? ""}</span>

      <button type="button" onClick={onSubmitSuccess}>
        Complete Form
      </button>
    </div>
  ),
}));

describe("CtaDialog", () => {
  beforeEach((): void => {
    vi.clearAllMocks();
    window.history.replaceState(null, "", "/");
  });

  afterEach((): void => {
    vi.restoreAllMocks();
    window.history.replaceState(null, "", "/");
  });

  describe("rendering", () => {
    test("renders the CTA trigger button", (): void => {
      render(<CtaDialog />);

      expect(
        screen.getByRole("button", {
          name: /start a conversation/i,
        }),
      ).toBeInTheDocument();
    });

    test("does not render the stepper initially", (): void => {
      render(<CtaDialog />);

      expect(screen.queryByTestId("cta-stepper")).not.toBeInTheDocument();
    });

    test("opens automatically when the trigger parameter exists", (): void => {
      window.history.replaceState(
        null,
        "",
        "/?start_a_conversation=&utm_source=linkedin#contact",
      );

      render(<CtaDialog />);

      expect(screen.getByTestId("cta-stepper")).toBeInTheDocument();
      expect(screen.getByTestId("initial-message")).toBeEmptyDOMElement();

      const currentUrl = new URL(window.location.href);
      expect(currentUrl.searchParams.has("start_a_conversation")).toBe(false);
      expect(currentUrl.searchParams.get("utm_source")).toBe("linkedin");
      expect(currentUrl.hash).toBe("#contact");
    });

    test("supports the accent variant", (): void => {
      render(<CtaDialog ctaButtonVariant="accent" />);

      expect(
        screen.getByRole("button", {
          name: /start a conversation/i,
        }),
      ).toBeInTheDocument();
    });
  });

  describe("dialog behaviour", () => {
    test("opens when the CTA button is clicked", (): void => {
      render(<CtaDialog />);

      fireEvent.click(
        screen.getByRole("button", {
          name: /start a conversation/i,
        }),
      );

      expect(screen.getByTestId("cta-stepper")).toBeInTheDocument();
    });

    test("closes after successful submission", (): void => {
      render(<CtaDialog />);

      fireEvent.click(
        screen.getByRole("button", {
          name: /start a conversation/i,
        }),
      );

      expect(screen.getByTestId("cta-stepper")).toBeInTheDocument();

      fireEvent.click(
        screen.getByRole("button", {
          name: /complete form/i,
        }),
      );

      expect(screen.queryByTestId("cta-stepper")).not.toBeInTheDocument();
    });

    test("opens from URL parameters, consumes them, and preserves other URL state", (): void => {
      const historyState = { navigationId: "current" };
      window.history.replaceState(
        historyState,
        "",
        "/?start_a_conversation&message=Hello%20%E2%80%94%20%E6%97%85%E8%A1%8C%20%26%20web&utm_source=linkedin&campaign=portfolio#contact",
      );
      const replaceStateSpy = vi.spyOn(window.history, "replaceState");

      render(
        <StrictMode>
          <CtaDialog />
        </StrictMode>,
      );

      expect(screen.getByTestId("cta-stepper")).toBeInTheDocument();
      expect(screen.getByTestId("initial-message")).toHaveTextContent(
        "Hello — 旅行 & web",
      );
      expect(replaceStateSpy).toHaveBeenCalledTimes(1);
      expect(replaceStateSpy).toHaveBeenCalledWith(
        historyState,
        "",
        expect.any(String),
      );

      const currentUrl = new URL(window.location.href);
      expect(currentUrl.searchParams.has("start_a_conversation")).toBe(false);
      expect(currentUrl.searchParams.has("message")).toBe(false);
      expect(currentUrl.searchParams.get("utm_source")).toBe("linkedin");
      expect(currentUrl.searchParams.get("campaign")).toBe("portfolio");
      expect(currentUrl.hash).toBe("#contact");
      expect(window.history.state).toEqual(historyState);
    });

    test("does not open or consume a message parameter without the trigger", (): void => {
      const url = "/?message=Hello&utm_source=linkedin#contact";
      window.history.replaceState(null, "", url);
      const replaceStateSpy = vi.spyOn(window.history, "replaceState");

      render(<CtaDialog />);

      expect(screen.queryByTestId("cta-stepper")).not.toBeInTheDocument();
      expect(
        window.location.pathname +
          window.location.search +
          window.location.hash,
      ).toBe(url);
      expect(replaceStateSpy).not.toHaveBeenCalled();
    });

    test("omits the query string when consumed parameters were the only parameters", (): void => {
      window.history.replaceState(
        null,
        "",
        "/?start_a_conversation&message=Hello#contact",
      );

      render(<CtaDialog />);

      expect(screen.getByTestId("cta-stepper")).toBeInTheDocument();
      expect(window.location.search).toBe("");
      expect(window.location.hash).toBe("#contact");
    });

    test.each([501, 500])(
      "passes the first 500 characters for a %i-character URL message",
      (length) => {
        const message = "x".repeat(length);
        const params = new URLSearchParams({
          start_a_conversation: "",
          message,
        });
        window.history.replaceState(null, "", `/?${params.toString()}`);

        render(<CtaDialog />);

        expect(screen.getByTestId("initial-message").textContent).toBe(
          message.slice(0, 500),
        );
      },
    );

    test("trims surrounding whitespace before truncating the URL message", (): void => {
      const message = `  ${"x".repeat(500)} trailing whitespace  `;
      const params = new URLSearchParams({
        start_a_conversation: "",
        message,
      });
      window.history.replaceState(null, "", `/?${params.toString()}`);

      render(<CtaDialog />);

      expect(screen.getByTestId("initial-message").textContent).toBe(
        "x".repeat(500),
      );
    });
  });

  describe("analytics", () => {
    test("sends the GTM event when the CTA button is clicked", (): void => {
      render(<CtaDialog />);

      fireEvent.click(
        screen.getByRole("button", {
          name: /start a conversation/i,
        }),
      );

      expect(sendGTMEventMock).toHaveBeenCalledTimes(1);

      expect(sendGTMEventMock).toHaveBeenCalledWith({
        event: "cta_click",
      });
    });

    test("does not send a GTM event on initial render", (): void => {
      render(<CtaDialog />);

      expect(sendGTMEventMock).not.toHaveBeenCalled();
    });

    test("does not send a manual CTA event when opened from the URL", (): void => {
      window.history.replaceState(null, "", "/?start_a_conversation");

      render(<CtaDialog />);

      expect(screen.getByTestId("cta-stepper")).toBeInTheDocument();
      expect(sendGTMEventMock).not.toHaveBeenCalled();
    });
  });
});
