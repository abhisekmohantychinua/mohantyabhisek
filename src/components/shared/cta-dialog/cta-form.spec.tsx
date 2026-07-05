import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import type { JSX, ReactNode } from "react";
import { beforeEach, describe, expect, test, vi } from "vitest";

import CtaForm from "./cta-form";

const { fetchMock, toastPromiseMock, sendGTMEventMock } = vi.hoisted(() => ({
  fetchMock: vi.fn(),
  toastPromiseMock: vi.fn(),
  sendGTMEventMock: vi.fn(),
}));

global.fetch = fetchMock as unknown as typeof fetch;

vi.mock("sonner", () => ({
  toast: {
    promise: toastPromiseMock,
  },
}));

vi.mock("@next/third-parties/google", () => ({
  sendGTMEvent: sendGTMEventMock,
}));

vi.mock("@/components/ui/dialog", () => ({
  DialogClose: ({ children }: { children: ReactNode }): JSX.Element => (
    <div>{children}</div>
  ),
}));

const renderForm = (overrides = {}) => {
  const onSubmitSuccess = vi.fn();
  const changeStepperStep = vi.fn();

  const result = render(
    <CtaForm
      currentStepperStep="message"
      onSubmitSuccess={onSubmitSuccess}
      changeStepperStep={changeStepperStep}
      {...overrides}
    />,
  );

  return {
    ...result,
    onSubmitSuccess,
    changeStepperStep,
  };
};

describe("CtaForm", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    toastPromiseMock.mockImplementation((promise: Promise<unknown>) =>
      promise.catch(() => undefined),
    );
  });

  describe("rendering", () => {
    test("renders message step by default", () => {
      renderForm();

      expect(screen.getByLabelText(/message/i)).toBeInTheDocument();

      expect(screen.getByRole("button", { name: /next/i })).toBeInTheDocument();
    });

    test("renders contact step", () => {
      renderForm({ currentStepperStep: "contact" });

      expect(screen.getByLabelText(/email/i)).toBeInTheDocument();

      expect(screen.getByLabelText(/phone/i)).toBeInTheDocument();

      expect(screen.getByLabelText(/linkedin/i)).toBeInTheDocument();

      expect(screen.getByLabelText(/instagram/i)).toBeInTheDocument();

      expect(
        screen.getByRole("button", {
          name: /start conversation/i,
        }),
      ).toBeInTheDocument();
    });
  });

  describe("step validation", () => {
    test("does not proceed when message is invalid", async () => {
      const { changeStepperStep } = renderForm();

      fireEvent.click(screen.getByRole("button", { name: /next/i }));

      await waitFor(() => {
        expect(changeStepperStep).not.toHaveBeenCalled();
      });
    });

    test("proceeds when message is valid", async () => {
      const { changeStepperStep } = renderForm();

      fireEvent.change(screen.getByLabelText(/message/i), {
        target: { value: "Hello this is a valid message" },
      });

      fireEvent.click(screen.getByRole("button", { name: /next/i }));

      await waitFor(() => {
        expect(changeStepperStep).toHaveBeenCalled();
      });
    });
  });

  describe("step navigation", () => {
    test("calls changeStepperStep directly on contact step", () => {
      const { changeStepperStep } = renderForm({
        currentStepperStep: "contact",
      });

      fireEvent.click(screen.getAllByRole("button")[0]);

      expect(changeStepperStep).toHaveBeenCalled();
    });
  });

  describe("submission", () => {
    test("submits form successfully", async () => {
      fetchMock.mockResolvedValue({
        ok: true,
      });

      const { rerender, onSubmitSuccess } = renderForm();

      fireEvent.change(screen.getByLabelText(/message/i), {
        target: { value: "Hello this is a valid message" },
      });

      rerender(
        <CtaForm
          currentStepperStep="contact"
          onSubmitSuccess={onSubmitSuccess}
          changeStepperStep={vi.fn()}
        />,
      );

      fireEvent.change(screen.getByLabelText(/email/i), {
        target: { value: "test@example.com" },
      });

      fireEvent.change(screen.getByLabelText(/phone/i), {
        target: { value: "+911234567890" },
      });

      fireEvent.submit(screen.getByRole("form"));

      await waitFor(() => {
        expect(fetchMock).toHaveBeenCalledWith(
          "/api/contact",
          expect.objectContaining({
            method: "POST",
          }),
        );
      });

      expect(sendGTMEventMock).toHaveBeenCalledWith({
        event: "cta_send",
      });

      expect(onSubmitSuccess).toHaveBeenCalled();
    });

    test("handles failed submission", async () => {
      fetchMock.mockResolvedValueOnce({ ok: false });

      const { rerender } = renderForm();

      fireEvent.change(screen.getByLabelText(/message/i), {
        target: { value: "Hello this is a valid message" },
      });

      rerender(
        <CtaForm
          currentStepperStep="contact"
          onSubmitSuccess={vi.fn()}
          changeStepperStep={vi.fn()}
        />,
      );

      fireEvent.change(screen.getByLabelText(/email/i), {
        target: { value: "test@example.com" },
      });

      fireEvent.submit(screen.getByRole("form"));

      await waitFor(() => {
        expect(toastPromiseMock).toHaveBeenCalled();
      });

      await Promise.resolve();
    });

    test("shows toast promise on submit", async () => {
      fetchMock.mockResolvedValue({ ok: true });

      const { rerender } = renderForm();

      fireEvent.change(screen.getByLabelText(/message/i), {
        target: { value: "Hello this is a valid message" },
      });

      rerender(
        <CtaForm
          currentStepperStep="contact"
          onSubmitSuccess={vi.fn()}
          changeStepperStep={vi.fn()}
        />,
      );

      fireEvent.change(screen.getByLabelText(/email/i), {
        target: { value: "test@example.com" },
      });

      fireEvent.submit(screen.getByRole("form"));

      await waitFor(() => {
        expect(toastPromiseMock).toHaveBeenCalled();
      });
    });
  });
});
