export const runtime = "nodejs";
import { contactDetailSchema } from "@/schemas/contact-detail-schema";

const GOOGLE_APP_SCRIPT_URL = process.env.GOOGLE_APP_SCRIPT_URL as string;
if (!GOOGLE_APP_SCRIPT_URL) {
  throw new Error("Missing GOOGLE_APP_SCRIPT_URL environment variable");
}

/**
 * Handle contact form submissions. Returns a 201 status code upon successful receipt.
 *
 * @param request - The incoming request object containing form data.
 * @returns A response indicating the result of the submission.
 */
export async function POST(request: Request) {
  // Parse and validate incoming JSON data
  const json = await request.json();
  const parsedData = contactDetailSchema.safeParse(json);
  if (!parsedData.success) {
    // Return validation error message
    return new Response(parsedData.error.issues[0].message, {
      status: 400,
    });
  }

  // Prepare payload for Google Apps Script
  const contactData = parsedData.data;
  // Transform message, removing newlines for better readability in Google Sheets
  contactData.message = contactData.message.replace(/\n/g, "<br>");
  // '+' from phone number
  contactData.phone = contactData.phone?.replace(/\+/g, "");

  // Send data to Google Apps Script endpoint asynchronously
  await fetch(GOOGLE_APP_SCRIPT_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(contactData),
  })
  .then(() => {console.log('Added to sheet')})
  .catch((error) => {
    console.error(
      "Error sending data to Google Apps Script:",
      error,
      new Date().toISOString()
    );
  });

  return new Response(null, { status: 201 });
}
