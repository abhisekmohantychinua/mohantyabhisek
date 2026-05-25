import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";

import { contactDetailSchema } from "@/schemas/contact-detail-schema";

const GOOGLE_APP_SCRIPT_URL = process.env.GOOGLE_APP_SCRIPT_URL as string;
if (!GOOGLE_APP_SCRIPT_URL) {
  throw new Error("Missing GOOGLE_APP_SCRIPT_URL environment variable");
}

/**
 * Submits contact form details to the Google Apps Script endpoint.
 *
 * Validates incoming request data, transforms fields for storage,
 * and forwards the payload to the external service.
 *
 * @param request - Incoming Next.js request containing contact form data.
 * @returns JSON response indicating success or failure of the submission.
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

    // Prepare payload for Google Apps Script
    const contactData = parsedData.data;

    // Transform message, removing newlines for better readability in Google Sheets
    contactData.message = contactData.message.replace(/\n/g, "<br>");

    // Remove '+' from phone number
    contactData.phone = contactData.phone?.replace(/\+/g, "");

    // Send data to Google Apps Script endpoint
    await fetch(GOOGLE_APP_SCRIPT_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(contactData),
    }).catch((error) => {
      console.error(
        "Error sending data to Google Apps Script:",
        error,
        new Date().toISOString(),
      );
    });

    return NextResponse.json(null, { status: 201 });
  } catch (error) {
    console.error("Failed to submit contact form", error);

    return NextResponse.json(
      { message: "Failed to submit contact form" },
      { status: 500 },
    );
  }
}
