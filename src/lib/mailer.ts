import type { Transporter } from "nodemailer";
import nodemailer from "nodemailer";

const senderGmail = process.env.SENDER_GMAIL;
const senderGmailAppPassword = process.env.SENDER_GMAIL_APP_PASSWORD;

if (!senderGmail || !senderGmailAppPassword) {
  throw new Error("SENDER_GMAIL or SENDER_GMAIL_APP_PASSWORD is not defined");
}

const globalForMailer = globalThis as unknown as {
  mailTransporter?: Transporter;
};

export function getMailTransporter(): Transporter {
  // Fast path: reuse existing transporter
  if (globalForMailer.mailTransporter) {
    return globalForMailer.mailTransporter;
  }

  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: senderGmail,
      pass: senderGmailAppPassword,
    },
  });

  globalForMailer.mailTransporter = transporter;

  return transporter;
}
