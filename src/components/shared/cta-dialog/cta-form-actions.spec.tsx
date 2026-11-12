import { fireEvent, render, screen } from "@testing-library/react";
import type { JSX, ReactNode } from "react";
import { beforeEach, describe, expect, test, vi } from "vitest";

import CtaFormActions from "./cta-form-actions";

vi.mock("@/components/ui/dialog", () => ({
  DialogClose: ({ children }: { children: ReactNode }): JSX.Element => (
    <div>{children}</div>
  ),
}));

describe("CtaFormActions", () => {
  const changeStepperStep = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe("message step", () => {
    test("renders Close and Continue buttons", () => {
      render(
        <CtaFormActions
          currentStepperStep="message"
          changeStepperStep={changeStepperStep}
        />,
      );

      expect(
        screen.getByRole("button", { name: /close/i }),
      ).toBeInTheDocument();

      expect(screen.getByRole("button", { name: /next/i })).toBeInTheDocument();
    });

    test("calls changeStepperStep on continue click", () => {
      render(
        <CtaFormActions
          currentStepperStep="message"
          changeStepperStep={changeStepperStep}
        />,
      );

      fireEvent.click(screen.getByRole("button", { name: /next/i }));

      expect(changeStepperStep).toHaveBeenCalledTimes(1);
    });

    test("close button exists but does not trigger step change", () => {
      render(
        <CtaFormActions
          currentStepperStep="message"
          changeStepperStep={changeStepperStep}
        />,
      );

      fireEvent.click(screen.getByRole("button", { name: /close/i }));

      expect(changeStepperStep).not.toHaveBeenCalled();
    });
  });

  describe("contact step", () => {
    test("renders back and submit buttons", () => {
      render(
        <CtaFormActions
          currentStepperStep="contact"
          changeStepperStep={changeStepperStep}
        />,
      );

      expect(
        screen.getByRole("button", { name: /start conversation/i }),
      ).toBeInTheDocument();

      // Back button uses icon → no accessible name, so we query by role + no label fallback
      const buttons = screen.getAllByRole("button");
      expect(buttons.length).toBeGreaterThanOrEqual(2);
    });

    test("calls changeStepperStep when back button clicked", () => {
      render(
        <CtaFormActions
          currentStepperStep="contact"
          changeStepperStep={changeStepperStep}
        />,
      );

      const buttons = screen.getAllByRole("button");

      // first button is back (icon-only)
      fireEvent.click(buttons[0]);

      expect(changeStepperStep).toHaveBeenCalledTimes(1);
    });

    test("submit button is type submit", () => {
      render(
        <CtaFormActions
          currentStepperStep="contact"
          changeStepperStep={changeStepperStep}
        />,
      );

      const submitBtn = screen.getByRole("button", {
        name: /start conversation/i,
      });

      expect(submitBtn).toHaveAttribute("type", "submit");
    });
  });
});
