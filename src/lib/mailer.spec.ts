import { afterEach, beforeEach, describe, expect, test, vi } from "vitest";

const createTransportMock = vi.fn();

vi.mock("nodemailer", () => ({
  default: {
    createTransport: createTransportMock,
  },
}));

describe("mailer", () => {
  const originalSenderGmail = process.env.SENDER_GMAIL;
  const originalSenderGmailAppPassword = process.env.SENDER_GMAIL_APP_PASSWORD;

  beforeEach(() => {
    vi.resetModules();
    vi.clearAllMocks();

    delete (globalThis as { mailTransporter?: unknown }).mailTransporter;
  });

  afterEach(() => {
    process.env.SENDER_GMAIL = originalSenderGmail;
    process.env.SENDER_GMAIL_APP_PASSWORD = originalSenderGmailAppPassword;

    delete (globalThis as { mailTransporter?: unknown }).mailTransporter;
  });

  describe("module initialization", () => {
    test("throws when SENDER_GMAIL is missing", async () => {
      delete process.env.SENDER_GMAIL;
      process.env.SENDER_GMAIL_APP_PASSWORD = "password";

      await expect(import("./mailer")).rejects.toThrow(
        "SENDER_GMAIL or SENDER_GMAIL_APP_PASSWORD is not defined",
      );
    });

    test("throws when SENDER_GMAIL_APP_PASSWORD is missing", async () => {
      process.env.SENDER_GMAIL = "test@gmail.com";
      delete process.env.SENDER_GMAIL_APP_PASSWORD;

      await expect(import("./mailer")).rejects.toThrow(
        "SENDER_GMAIL or SENDER_GMAIL_APP_PASSWORD is not defined",
      );
    });
  });

  describe("getMailTransporter", () => {
    test("creates a transporter on first call", async () => {
      process.env.SENDER_GMAIL = "test@gmail.com";
      process.env.SENDER_GMAIL_APP_PASSWORD = "app-password";

      const transporter = {
        sendMail: vi.fn(),
      };

      createTransportMock.mockReturnValue(transporter);

      const { getMailTransporter } = await import("./mailer");

      const result = getMailTransporter();

      expect(result).toBe(transporter);

      expect(createTransportMock).toHaveBeenCalledTimes(1);

      expect(createTransportMock).toHaveBeenCalledWith({
        service: "gmail",
        auth: {
          user: "test@gmail.com",
          pass: "app-password",
        },
      });
    });

    test("returns the cached transporter on subsequent calls", async () => {
      process.env.SENDER_GMAIL = "test@gmail.com";
      process.env.SENDER_GMAIL_APP_PASSWORD = "app-password";

      const transporter = {
        sendMail: vi.fn(),
      };

      createTransportMock.mockReturnValue(transporter);

      const { getMailTransporter } = await import("./mailer");

      const firstResult = getMailTransporter();
      const secondResult = getMailTransporter();

      expect(firstResult).toBe(secondResult);

      expect(createTransportMock).toHaveBeenCalledTimes(1);
    });

    test("reuses a transporter already stored on the global object", async () => {
      process.env.SENDER_GMAIL = "test@gmail.com";
      process.env.SENDER_GMAIL_APP_PASSWORD = "app-password";

      const existingTransporter = {
        sendMail: vi.fn(),
      };

      (globalThis as { mailTransporter?: unknown }).mailTransporter =
        existingTransporter;

      const { getMailTransporter } = await import("./mailer");

      const result = getMailTransporter();

      expect(result).toBe(existingTransporter);

      expect(createTransportMock).not.toHaveBeenCalled();
    });
  });
});
