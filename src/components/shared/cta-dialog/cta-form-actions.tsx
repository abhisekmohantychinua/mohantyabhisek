import { ArrowLeftIcon, ArrowRightIcon } from "lucide-react";
import type { JSX } from "react";

import { Button } from "@/components/ui/button";
import { DialogClose } from "@/components/ui/dialog";

import type { CtaStep } from "./cta-stepper";

type CtaFormActionsProps = {
  currentStepperStep: CtaStep;
  changeStepperStep: () => void;
};

export default function CtaFormActions({
  currentStepperStep,
  changeStepperStep,
}: CtaFormActionsProps): JSX.Element {
  return (
    <div className="mt-px flex w-full items-center justify-between gap-2">
      {currentStepperStep === "message" ? (
        <>
          <DialogClose asChild>
            <Button variant="ghost" type="button">
              Close
            </Button>
          </DialogClose>
          <Button
            type="button"
            variant="default"
            aria-label="Next"
            onClick={changeStepperStep}
          >
            Continue
            <ArrowRightIcon />
          </Button>
        </>
      ) : (
        <>
          <Button
            type="button"
            variant="ghost"
            size="icon"
            onClick={changeStepperStep}
          >
            <ArrowLeftIcon />
          </Button>
          <Button type="submit">Start Conversation</Button>
        </>
      )}
    </div>
  );
}
