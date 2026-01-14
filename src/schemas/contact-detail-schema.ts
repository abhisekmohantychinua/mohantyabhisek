import z from "zod";

const transformString = (value: string | undefined) => {
  return value?.trim() === "" ? undefined : value?.trim();
};

export const contactDetailSchema = z
  .object({
    message: z
      .string()
      .min(10, "Message must be at least 10 characters long")
      .max(500, "Message must be at most 500 characters long"),
    phone: z
      .string()
      .regex(/^\+?[1-9]\d{7,14}$/, "Phone number must be a valid phone number")
      .transform(transformString)
      .optional(),
    email: z
      .email("Email must be a valid email address")
      .transform(transformString)
      .optional(),
    instagram: z
      .string()
      .regex(
        /^(https?:\/\/)?(www\.)?instagram\.com\/[A-Za-z0-9._]+$/,
        "Invalid Instagram profile URL"
      )
      .transform(transformString)
      .optional(),
    linkedin: z
      .string()
      .regex(
        /^(https?:\/\/)?(www\.)?linkedin\.com\/in\/[A-Za-z0-9-_%]+$/,
        "Invalid LinkedIn profile URL"
      )
      .transform(transformString)
      .optional(),
  })
  .refine(
    (data) => !!(data.phone || data.email || data.instagram || data.linkedin),
    {
      message:
        "At least one contact method (phone, email, Instagram, or LinkedIn) must be provided",
      path: ["phone"],
    }
  );
