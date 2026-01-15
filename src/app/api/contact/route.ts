/**
 * Handle contact form submissions. Returns a 201 status code upon successful receipt.
 *
 * @param request - The incoming request object containing form data.
 * @returns A response indicating the result of the submission.
 */
export async function POST(request: Request) {
  const { email, message, phone, instagram, linkedin } = await request.json();
  console.log("Contact form submission received:", {
    email,
    message,
    phone,
    instagram,
    linkedin,
  });
  return new Response(null, { status: 201 });
}
