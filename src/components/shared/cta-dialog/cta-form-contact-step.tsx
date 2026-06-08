import type { JSX } from "react";
import type { UseFormReturn } from "react-hook-form";
import { Controller } from "react-hook-form";

import {
  Field,
  FieldContent,
  FieldError,
  FieldLabel,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";

import type { CtaFormValues } from "./cta-form";

type CtaFormContactStepProps = {
  form: UseFormReturn<CtaFormValues>;
};

export function CtaFormContactStep({
  form,
}: CtaFormContactStepProps): JSX.Element {
  return (
    <>
      <Controller
        control={form.control}
        name="email"
        render={({ field, fieldState }) => (
          <Field data-invalid={fieldState.invalid}>
            <FieldContent>
              <FieldLabel htmlFor="emailInput">Email</FieldLabel>
              <Input
                type="email"
                id="emailInput"
                placeholder="john@example.com"
                {...field}
                aria-invalid={fieldState.invalid}
              />
              {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
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
              <FieldLabel htmlFor="linkedinInput">LinkedIn</FieldLabel>
              <Input
                type="url"
                id="linkedinInput"
                placeholder="https://linkedin.com/in/yourprofile"
                {...field}
                aria-invalid={fieldState.invalid}
              />
              {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
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
              <FieldLabel htmlFor="phoneInput">Phone</FieldLabel>
              <Input
                type="tel"
                id="phoneInput"
                placeholder="+911234567890"
                {...field}
                aria-invalid={fieldState.invalid}
              />
              {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
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
              <FieldLabel htmlFor="instagramInput">Instagram</FieldLabel>
              <Input
                type="url"
                id="instagramInput"
                placeholder="https://instagram.com/yourprofile"
                {...field}
                aria-invalid={fieldState.invalid}
              />
              {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
            </FieldContent>
          </Field>
        )}
      />
    </>
  );
}
