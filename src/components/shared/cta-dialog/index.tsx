"use client";

import { sendGTMEvent } from "@next/third-parties/google";
import type { JSX } from "react";
import { useState } from "react";

import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";

import { CtaButton } from "../cta-button";
import CtaStepper from "./cta-stepper";

export default function CtaDialog(): JSX.Element {
  // State to manage dialog open/close status
  const [open, setOpen] = useState(false);

  function sendCtaClickToGtm(): void {
    sendGTMEvent({ event: "cta_click" });
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      {/* Trigger button for the popover */}
      <DialogTrigger asChild>
        <CtaButton
          aria-describedby="primary-cta-description"
          onClick={sendCtaClickToGtm}
        >
          Start a conversation
        </CtaButton>
      </DialogTrigger>
      {/* Popover content containing the CTA form */}
      <DialogContent>
        <CtaStepper onSubmitSuccess={() => setOpen(false)} />
      </DialogContent>
    </Dialog>
  );
}
