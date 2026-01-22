"use client";

import { useState } from "react";
import { Button } from "../ui/button";
import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover";
import CtaForm from "./cta-form";
import { sendGTMEvent } from "@next/third-parties/google";

/**
 * CTA Popover Component
 * Renders a button that triggers a popover containing a contact form
 * for starting a conversation. The popover can be opened and closed,
 * and the form submission success closes the popover.
 */
export default function CtaPopover() {
  // State to manage popover open/close status
  const [open, setOpen] = useState(false);

  function sendCtaClickToGtm() {
    sendGTMEvent({ event: "cta_click" });
  }

  return (
    <Popover open={open} onOpenChange={setOpen}>
      {/* Trigger button for the popover */}
      <PopoverTrigger asChild>
        <Button
          variant="accent"
          size="lg"
          className="font-sans"
          type="button"
          aria-describedby="primary-cta-description"
          onClick={sendCtaClickToGtm}
        >
          Start a conversation
        </Button>
      </PopoverTrigger>
      {/* Popover content containing the CTA form */}
      <PopoverContent>
        {/* Heading for the popover */}
        <h4 className="font-semibold mb-4">Let’s understand your situation</h4>
        <CtaForm onSubmitSuccess={() => setOpen(false)} />
      </PopoverContent>
    </Popover>
  );
}
