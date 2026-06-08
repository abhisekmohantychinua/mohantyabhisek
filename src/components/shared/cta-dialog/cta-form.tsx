"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { sendGTMEvent } from "@next/third-parties/google";
import type { JSX } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import type z from "zod";

import { FieldGroup } from "@/components/ui/field";
import { contactDetailSchema } from "@/schemas/contact-detail-schema";

import CtaFormActions from "./cta-form-actions";
import { CtaFormContactStep } from "./cta-form-contact-step";
import { CtaFormMessageStep } from "./cta-form-message-step";
import type { CtaStep } from "./cta-stepper";

// Props for the CtaForm component
type CtaFormProps = {
  currentStepperStep: CtaStep;
  onSubmitSuccess?: () => void;
  changeStepperStep: () => void;
};

export type CtaFormValues = z.infer<typeof contactDetailSchema>;

export default function CtaForm({
  currentStepperStep,
  onSubmitSuccess,
  changeStepperStep,
}: CtaFormProps): JSX.Element {
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

  function onSubmit(data: z.infer<typeof contactDetailSchema>): void {
    console.log("Form submitting:", data);
    form.reset(); // Reset the form fields
    onSubmitSuccess?.(); // Call the success callback if provided
    sendGTMEvent({ event: "cta_send" });

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

  function changeStep(): void {
    // Validate the message step before proceeding
    if (currentStepperStep == "message") {
      form.trigger("message").then((isValid) => {
        // Only proceed to the contact step if the message is valid
        if (isValid) {
          changeStepperStep();
        }
      });
    } else {
      changeStepperStep();
    }
  }

  return (
    <form onSubmit={form.handleSubmit(onSubmit)}>
      <FieldGroup>
        {currentStepperStep === "message" ? (
          <CtaFormMessageStep form={form} />
        ) : (
          <CtaFormContactStep form={form} />
        )}

        <CtaFormActions
          changeStepperStep={changeStep}
          currentStepperStep={currentStepperStep}
        />
      </FieldGroup>
    </form>
  );
}
