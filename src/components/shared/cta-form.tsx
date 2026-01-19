"use client";

import { contactDetailSchema } from "@/schemas/contact-detail-schema";
import { zodResolver } from "@hookform/resolvers/zod";
import { Controller, useForm } from "react-hook-form";
import z from "zod";
import {
  Field,
  FieldContent,
  FieldError,
  FieldGroup,
  FieldLabel,
} from "../ui/field";
import { Textarea } from "../ui/textarea";
import { useState } from "react";
import { Button } from "../ui/button";
import { ArrowLeftIcon, ArrowRightIcon, Send } from "lucide-react";
import { Input } from "../ui/input";
import { PopoverClose } from "@radix-ui/react-popover";
import { toast } from "sonner";

// Props for the CtaForm component
type CtaFormProps = {
  onSubmitSuccess?: () => void;
};

// Define the steps of the form to manage multi-step behavior
type FormStep = "message" | "contact";

/**
 * CtaForm Component
 *
 * Purpose: A multi-step contact form that collects a message and contact details.
 *
 * Key Features:
 * - Step 1: Collects the user's message with validation.
 * - Step 2: Collects optional contact details (email, phone, Instagram, LinkedIn) with validation.
 * - Uses react-hook-form for form state management and validation with zod.
 * - Provides user feedback with toast notifications on form submission.
 *
 * @param onSubmitSuccess - Optional callback function to be called on successful form submission.
 */
export default function CtaForm({ onSubmitSuccess }: CtaFormProps) {
  // State to track the current step of the form
  const [currentStep, setCurrentStep] = useState<FormStep>("message");
  // Initialize the form with react-hook-form and zod validation
  const form = useForm<z.infer<typeof contactDetailSchema>>({
    defaultValues: {
      message: "",
      phone: "",
      email: "",
      instagram: "",
      linkedin: "",
    },
    resolver: zodResolver(contactDetailSchema),
  });

  /**
   * Handle form submission. Logs the data, resets the form,
   * calls the success callback, and sends the data to the server.
   * Uses toast notifications for user feedback.
   *
   * @param data - The validated form data
   */
  function onSubmit(data: z.infer<typeof contactDetailSchema>) {
    console.log("Form submitting:", data);
    form.reset(); // Reset the form fields
    onSubmitSuccess?.(); // Call the success callback if provided

    // Send form data to the server
    const formSubmitPromise = fetch("/api/contact", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    })
      .then((response) => {
        // Check if the response is OK, supposedly a 201 status
        if (response.ok) {
          return;
        }
        // If not OK, throw an error to be caught below
        throw new Error("Failed to submit form");
      })
      .catch((error) => {
        // Log any errors that occur during submission
        console.error("Error submitting form:", error);
        // Rethrow the error for toast notification
        throw error;
      });
    // Show toast notifications based on the promise state
    toast.promise(formSubmitPromise, {
      loading: "Sending your message...",
      success: "Message sent successfully!",
      error: "Failed to send your message.",
    });
  }

  // Function to change the current step of the form
  function changeStep() {
    // Validate the current step before moving to the next
    if (currentStep === "message") {
      // Validate the message step before proceeding
      form.trigger("message").then((isValid) => {
        // Only proceed to the contact step if the message is valid
        if (isValid) {
          setCurrentStep("contact");
        }
      });
    } else {
      // Move back to the message step
      setCurrentStep("message");
    }
  }

  return (
    <form onSubmit={form.handleSubmit(onSubmit)}>
      <FieldGroup>
        {/* Initial message step */}
        {currentStep === "message" && (
          <>
            <Controller
              control={form.control}
              name="message"
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldContent>
                    <FieldLabel htmlFor="messageArea">Message</FieldLabel>
                    <Textarea
                      id="messageArea"
                      placeholder="Write your message here..."
                      className="min-h-40"
                      {...field}
                      aria-invalid={fieldState.invalid}
                    />
                    {fieldState.invalid && (
                      <FieldError errors={[fieldState.error]} />
                    )}
                  </FieldContent>
                </Field>
              )}
            />
            {/* Close button and next button */}
            <div className="w-full flex items-center justify-between gap-2 mt-px">
              {/* Close the popover when clicked, Important to use PopoverClose */}
              <PopoverClose asChild>
                <Button variant="ghost" type="button">
                  Close
                </Button>
              </PopoverClose>
              <Button
                type="button"
                variant="default"
                size={"icon"}
                aria-label="Next"
                onClick={changeStep}
              >
                <ArrowRightIcon />
              </Button>
            </div>
          </>
        )}
        {/* Contact details step */}
        {currentStep === "contact" && (
          <>
            {/* Email control */}
            <Controller
              control={form.control}
              name="email"
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldContent>
                    <FieldLabel htmlFor="emailInput">
                      Email(Optional)
                    </FieldLabel>
                    <Input
                      type="email"
                      id="emailInput"
                      placeholder="john@example.com"
                      {...field}
                      aria-invalid={fieldState.invalid}
                    />
                    {fieldState.invalid && (
                      <FieldError errors={[fieldState.error]} />
                    )}
                  </FieldContent>
                </Field>
              )}
            />
            {/* Phone control */}
            <Controller
              control={form.control}
              name="phone"
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldContent>
                    <FieldLabel htmlFor="phoneInput">
                      Phone(Recommended)
                    </FieldLabel>
                    <Input
                      type="tel"
                      id="phoneInput"
                      placeholder="+911234567890"
                      {...field}
                      aria-invalid={fieldState.invalid}
                    />
                    {fieldState.invalid && (
                      <FieldError errors={[fieldState.error]} />
                    )}
                  </FieldContent>
                </Field>
              )}
            />
            {/* Instagram control */}
            <Controller
              control={form.control}
              name="instagram"
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldContent>
                    <FieldLabel htmlFor="instagramInput">
                      Instagram(Optional)
                    </FieldLabel>
                    <Input
                      type="url"
                      id="instagramInput"
                      placeholder="https://instagram.com/yourprofile"
                      {...field}
                      aria-invalid={fieldState.invalid}
                    />
                    {fieldState.invalid && (
                      <FieldError errors={[fieldState.error]} />
                    )}
                  </FieldContent>
                </Field>
              )}
            />
            {/* LinkedIn control */}
            <Controller
              control={form.control}
              name="linkedin"
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldContent>
                    <FieldLabel htmlFor="linkedinInput">
                      LinkedIn(Optional)
                    </FieldLabel>
                    <Input
                      type="url"
                      id="linkedinInput"
                      placeholder="https://linkedin.com/in/yourprofile"
                      {...field}
                      aria-invalid={fieldState.invalid}
                    />
                    {fieldState.invalid && (
                      <FieldError errors={[fieldState.error]} />
                    )}
                  </FieldContent>
                </Field>
              )}
            />
            {/* Back button and submit button */}
            <div className="w-full flex items-center justify-between gap-2 mt-px">
              <Button
                type="button"
                variant="ghost"
                size="icon"
                onClick={changeStep}
              >
                <ArrowLeftIcon />
              </Button>
              <Button type="submit">
                <Send />
                Send
              </Button>
            </div>
          </>
        )}
      </FieldGroup>
    </form>
  );
}
