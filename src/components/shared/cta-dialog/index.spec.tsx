import { fireEvent, render, screen } from "@testing-library/react";
import type { JSX } from "react";
import { beforeEach, describe, expect, test, vi } from "vitest";

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
  }: {
    onSubmitSuccess?: () => void;
  }): JSX.Element => (
    <div data-testid="cta-stepper">
      <p>Mock CTA Stepper</p>

      <button type="button" onClick={onSubmitSuccess}>
        Complete Form
      </button>
    </div>
  ),
}));

describe("CtaDialog", () => {
  beforeEach((): void => {
    vi.clearAllMocks();
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
  });
});
