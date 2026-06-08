import type { JSX } from "react";
import { useState } from "react";

import {
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

import CtaForm from "./cta-form";

type CtaStepperProps = {
  onSubmitSuccess?: () => void;
};

// Define the steps to manage multi-step behavior
export type CtaStep = "message" | "contact";

export default function CtaStepper({
  onSubmitSuccess,
}: CtaStepperProps): JSX.Element {
  // State to track the current step
  const [currentStep, setCurrentStep] = useState<CtaStep>("message");

  // Function to change the current step
  function changeStep(): void {
    setCurrentStep(currentStep === "message" ? "contact" : "message");
  }
  return (
    <>
      <DialogHeader>
        <div className="text-muted-foreground text-sm">
          Step {currentStep === "message" ? "1" : "2"} of 2
        </div>
        <DialogTitle>
          {currentStep === "message"
            ? "Let's understand your situation"
            : "How Can I Reach You?"}
        </DialogTitle>
        <DialogDescription>
          {currentStep === "message"
            ? " Share a little context about your business, project, or goal. A few sentences are enough to start the conversation."
            : "Provide at least one way to contact you. I'll use it to follow up and continue the conversation."}
        </DialogDescription>
      </DialogHeader>
      <CtaForm
        currentStepperStep={currentStep}
        changeStepperStep={changeStep}
        onSubmitSuccess={onSubmitSuccess}
      />
    </>
  );
}
