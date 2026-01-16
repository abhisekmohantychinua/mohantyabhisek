import z from "zod";

// Helper function to transform empty strings to undefined
const transformString = (value: string | undefined) => {
  return value?.trim() === "" ? undefined : value?.trim();
};

// Schema for validating contact details
export const contactDetailSchema = z
  .object({
    // Message: required, min 10 chars, max 500 chars
    message: z
      .string()
      .min(10, "Message must be at least 10 characters long")
      .max(500, "Message must be at most 500 characters long"),

    // Phone: optional, valid phone number format. e.g. +1234567890, 1234567890, 123-456-7890
    phone: z
      .string()
      .regex(/^\+?[1-9]\d{7,14}$/, "Phone number must be a valid phone number")
      .transform(transformString)
      .optional(),

    // Email: optional, valid email format
    email: z
      .email("Email must be a valid email address")
      .transform(transformString)
      .optional(),

    // Instagram: optional, valid Instagram profile URL. e.g. https://www.instagram.com/username
    instagram: z
      .string()
      .regex(
        /^(https?:\/\/)?(www\.)?instagram\.com\/[A-Za-z0-9._]+$/,
        "Invalid Instagram profile URL"
      )
      .transform(transformString)
      .optional(),

    // LinkedIn: optional, valid LinkedIn profile URL. e.g. https://www.linkedin.com/in/username
    linkedin: z
      .string()
      .regex(
        /^(https?:\/\/)?(www\.)?linkedin\.com\/in\/[A-Za-z0-9-_%]+$/,
        "Invalid LinkedIn profile URL"
      )
      .transform(transformString)
      .optional(),
  })
  .strict()
  // Ensure at least one contact method is provided
  .refine(
    (data) => !!(data.phone || data.email || data.instagram || data.linkedin),
    {
      message:
        "At least one contact method (phone, email, Instagram, or LinkedIn) must be provided",
      path: ["phone"],
    }
  );
