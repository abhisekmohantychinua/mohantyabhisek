import type { RenderResult } from "@testing-library/react";
import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import type { ComponentProps, JSX, ReactNode } from "react";
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

const renderForm = (
  overrides: Partial<ComponentProps<typeof CtaForm>> = {},
): RenderResult & {
  onSubmitSuccess: ReturnType<typeof vi.fn<() => void>>;
  changeStepperStep: ReturnType<typeof vi.fn<() => void>>;
} => {
  const onSubmitSuccess = vi.fn<() => void>();
  const changeStepperStep = vi.fn<() => void>();

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

    test("initializes the message textarea from initialMessage", () => {
      const initialMessage = "I need a website for my business.";

      renderForm({ initialMessage });

      expect(screen.getByLabelText(/message/i)).toHaveValue(initialMessage);
    });

    test("starts the message textarea empty when initialMessage is absent", () => {
      renderForm();

      expect(screen.getByLabelText(/message/i)).toHaveValue("");
    });

    test("preserves all 500 supplied message characters", () => {
      const initialMessage = "x".repeat(500);

      renderForm({ initialMessage });

      expect(screen.getByLabelText(/message/i)).toHaveValue(initialMessage);
    });

    test("keeps contact fields empty when a message is prefilled", () => {
      renderForm({
        currentStepperStep: "contact",
        initialMessage: "Prefilled message",
      });

      expect(screen.getByLabelText(/email/i)).toHaveValue("");
      expect(screen.getByLabelText(/phone/i)).toHaveValue("");
      expect(screen.getByLabelText(/linkedin/i)).toHaveValue("");
      expect(screen.getByLabelText(/instagram/i)).toHaveValue("");
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
    test("includes initialMessage in React Hook Form submission data", async () => {
      fetchMock.mockResolvedValue({ ok: true });
      const initialMessage = "A message supplied through a shared link.";
      const { rerender } = renderForm({ initialMessage });

      rerender(
        <CtaForm
          currentStepperStep="contact"
          initialMessage={initialMessage}
          onSubmitSuccess={vi.fn()}
          changeStepperStep={vi.fn()}
        />,
      );
      fireEvent.change(screen.getByLabelText(/email/i), {
        target: { value: "test@example.com" },
      });
      fireEvent.submit(screen.getByRole("form"));

      await waitFor(() => {
        expect(fetchMock).toHaveBeenCalledWith(
          "/api/contact",
          expect.objectContaining({
            body: expect.stringContaining(initialMessage),
          }),
        );
      });
    });

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
