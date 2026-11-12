import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";

import { getMailTransporter } from "@/lib/mailer";
import { contactDetailSchema } from "@/schemas/contact-detail-schema";

const receiverEmail = process.env.DEFAULT_RECEIVER_EMAIL;

if (!receiverEmail) {
  throw new Error("DEFAULT_RECEIVER_EMAIL is not defined");
}

/**
 * Processes a "Start a Conversation" request.
 *
 * Validates the submitted message and contact methods, generates
 * an email containing the conversation details, and sends it to
 * the configured receiver email address.
 *
 * @param request - Incoming Next.js request containing contact form data.
 * @returns A JSON response indicating success or failure of the operation.
 */
export async function POST(
  request: NextRequest,
): Promise<NextResponse<null | { message: string }>> {
  try {
    // Parse and validate incoming JSON data
    const json = await request.json();
    const parsedData = contactDetailSchema.safeParse(json);

    if (!parsedData.success) {
      return NextResponse.json(
        { message: parsedData.error.issues[0].message },
        { status: 400 },
      );
    }

    // Extract validated data for further processing
    const contactData = parsedData.data;
    const primaryContactMethod = contactData.email
      ? "Email"
      : contactData.phone
        ? "Phone"
        : contactData.instagram
          ? "Instagram"
          : "LinkedIn";

    const submittedAt = new Date().toLocaleString("en-IN", {
      dateStyle: "medium",
      timeStyle: "short",
      timeZone: "Asia/Kolkata",
    });

    const contactMethods = [
      contactData.email && `Email: ${contactData.email}`,
      contactData.phone && `Phone: ${contactData.phone}`,
      contactData.instagram && `Instagram: ${contactData.instagram}`,
      contactData.linkedin && `LinkedIn: ${contactData.linkedin}`,
    ]
      .filter(Boolean)
      .join("<br>");

    const htmlContent = `
      <p>${contactData.message.replace(/\n/g, "<br>")}</p>
      <br>
      <p>
        ${contactMethods}
      </p>
      <p>
        Submitted At: ${submittedAt}
      </p>
    `;
    const transporter = getMailTransporter();

    const info = await transporter.sendMail({
      from: contactData.email,
      to: receiverEmail,
      subject: `Someone Started a Conversation (${primaryContactMethod})`,
      html: htmlContent,
    });
    console.info(
      `[${new Date().toISOString()}] Contact form email sent successfully. Message ID: ${info.messageId}`,
    );

    return NextResponse.json(null, { status: 201 });
  } catch (error) {
    console.error("Failed to submit contact form", error);

    return NextResponse.json(
      { message: "Failed to submit contact form" },
      { status: 500 },
    );
  }
}
