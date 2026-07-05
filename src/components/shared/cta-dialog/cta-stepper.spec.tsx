import { fireEvent, render, screen } from "@testing-library/react";
import type { JSX, ReactNode } from "react";
import { beforeEach, describe, expect, test, vi } from "vitest";

import CtaStepper from "./cta-stepper";

const ctaFormMock = vi.fn();

vi.mock("@/components/ui/dialog", () => ({
  DialogDescription: ({ children }: { children: ReactNode }): JSX.Element => (
    <div>{children}</div>
  ),
  DialogHeader: ({ children }: { children: ReactNode }): JSX.Element => (
    <div>{children}</div>
  ),
  DialogTitle: ({ children }: { children: ReactNode }): JSX.Element => (
    <h2>{children}</h2>
  ),
}));

vi.mock("./cta-form", () => ({
  default: (props: {
    currentStepperStep: "message" | "contact";
    changeStepperStep: () => void;
    onSubmitSuccess?: () => void;
  }): JSX.Element => {
    ctaFormMock(props);

    return (
      <div data-testid="cta-form">
        <div data-testid="current-step">{props.currentStepperStep}</div>

        <button type="button" onClick={props.changeStepperStep}>
          Change Step
        </button>

        <button type="button" onClick={props.onSubmitSuccess}>
          Submit Success
        </button>
      </div>
    );
  },
}));

describe("CtaStepper", () => {
  beforeEach((): void => {
    vi.clearAllMocks();
  });

  describe("initial rendering", () => {
    test("starts on step one", (): void => {
      render(<CtaStepper />);

      expect(screen.getByText(/step 1 of 2/i)).toBeInTheDocument();

      expect(
        screen.getByRole("heading", {
          name: /let's understand your situation/i,
        }),
      ).toBeInTheDocument();

      expect(
        screen.getByText(/share a little context about your business/i),
      ).toBeInTheDocument();

      expect(screen.getByTestId("current-step")).toHaveTextContent("message");
    });

    test("renders the form", (): void => {
      render(<CtaStepper />);

      expect(screen.getByTestId("cta-form")).toBeInTheDocument();
    });
  });

  describe("step navigation", () => {
    test("moves to the contact step", (): void => {
      render(<CtaStepper />);

      fireEvent.click(
        screen.getByRole("button", {
          name: /change step/i,
        }),
      );

      expect(screen.getByText(/step 2 of 2/i)).toBeInTheDocument();

      expect(
        screen.getByRole("heading", {
          name: /how can i reach you/i,
        }),
      ).toBeInTheDocument();

      expect(
        screen.getByText(/provide at least one way to contact you/i),
      ).toBeInTheDocument();

      expect(screen.getByTestId("current-step")).toHaveTextContent("contact");
    });

    test("returns to the message step", (): void => {
      render(<CtaStepper />);

      const button = screen.getByRole("button", {
        name: /change step/i,
      });

      fireEvent.click(button);
      fireEvent.click(button);

      expect(screen.getByText(/step 1 of 2/i)).toBeInTheDocument();

      expect(
        screen.getByRole("heading", {
          name: /let's understand your situation/i,
        }),
      ).toBeInTheDocument();

      expect(screen.getByTestId("current-step")).toHaveTextContent("message");
    });
  });

  describe("form integration", () => {
    test("passes the current step to the form", (): void => {
      render(<CtaStepper />);

      expect(ctaFormMock).toHaveBeenLastCalledWith(
        expect.objectContaining({
          currentStepperStep: "message",
        }),
      );

      fireEvent.click(
        screen.getByRole("button", {
          name: /change step/i,
        }),
      );

      expect(ctaFormMock).toHaveBeenLastCalledWith(
        expect.objectContaining({
          currentStepperStep: "contact",
        }),
      );
    });

    test("passes the success callback to the form", (): void => {
      const onSubmitSuccess = vi.fn();

      render(<CtaStepper onSubmitSuccess={onSubmitSuccess} />);

      fireEvent.click(
        screen.getByRole("button", {
          name: /submit success/i,
        }),
      );

      expect(onSubmitSuccess).toHaveBeenCalledOnce();
    });
  });
});
