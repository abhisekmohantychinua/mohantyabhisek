import type { JSX } from "react";
import type { UseFormReturn } from "react-hook-form";
import { Controller } from "react-hook-form";

import {
  Field,
  FieldContent,
  FieldError,
  FieldLabel,
} from "@/components/ui/field";
import { Textarea } from "@/components/ui/textarea";

import type { CtaFormValues } from "./cta-form";

type CtaFormMessageStepProps = {
  form: UseFormReturn<CtaFormValues>;
};

export function CtaFormMessageStep({
  form,
}: CtaFormMessageStepProps): JSX.Element {
  return (
    <Controller
      control={form.control}
      name="message"
      render={({ field, fieldState }) => (
        <Field data-invalid={fieldState.invalid}>
          <FieldContent>
            <FieldLabel htmlFor="messageArea">Message</FieldLabel>
            <Textarea
              id="messageArea"
              placeholder="I'm planning a website for my business and would like guidance on the best approach."
              className="min-h-40"
              {...field}
              aria-invalid={fieldState.invalid}
            />
            {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
          </FieldContent>
        </Field>
      )}
    />
  );
}
