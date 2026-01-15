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

type FormStep = "message" | "contact";

type CtaFormProps = {
  onSubmitSuccess?: () => void;
};

export default function CtaForm({ onSubmitSuccess }: CtaFormProps) {
  const [currentStep, setCurrentStep] = useState<FormStep>("message");
  const form = useForm<z.infer<typeof contactDetailSchema>>({
    defaultValues: {
      message: "",
      phone: undefined,
      email: undefined,
      instagram: undefined,
      linkedin: undefined,
    },
    resolver: zodResolver(contactDetailSchema),
  });

  function onSubmit(data: z.infer<typeof contactDetailSchema>) {
    console.log("Form submitting:", data);
    form.reset();
    onSubmitSuccess?.();
    const formSubmitPromise = fetch("/api/contact", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    })
      .then((response) => {
        if (response.ok) {
          return;
        }
        throw new Error("Failed to submit form");
      })
      .catch((error) => {
        console.error("Error submitting form:", error);
        throw error;
      });
    toast.promise(formSubmitPromise, {
      loading: "Sending your message...",
      success: "Message sent successfully!",
      error: "Failed to send your message.",
    });
  }

  function changeStep() {
    if (currentStep === "message") {
      form.trigger("message").then((isValid) => {
        if (isValid) {
          setCurrentStep("contact");
        }
      });
    } else {
      setCurrentStep("message");
    }
  }

  return (
    <form onSubmit={form.handleSubmit(onSubmit)} className="">
      <FieldGroup>
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
            <div className="w-full flex items-center justify-between gap-2 mt-px">
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
        {currentStep === "contact" && (
          <>
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
