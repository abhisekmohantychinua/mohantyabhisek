"use client";

import { sendGTMEvent } from "@next/third-parties/google";
import type { JSX } from "react";
import { useEffect, useState } from "react";

import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";

import { CtaButton } from "../cta-button";
import CtaStepper from "./cta-stepper";

type CtaDialogProps = {
  ctaButtonVariant?: "default" | "accent";
};

export default function CtaDialog({
  ctaButtonVariant = "default",
}: CtaDialogProps): JSX.Element {
  // State to manage dialog open/close status
  const [open, setOpen] = useState(false);
  const [initialMessage, setInitialMessage] = useState<string>();

  useEffect(() => {
    // This is a one-time browser request; consuming it first makes Strict Mode replays idempotent.
    const currentUrl = new URL(window.location.href);
    const searchParams = currentUrl.searchParams;

    // If the URL does not contain the "start_a_conversation" parameter, exit early
    if (!searchParams.has("start_a_conversation")) {
      return;
    }

    // If the URL contains the "start_a_conversation" parameter, extract the optional "message" parameter
    // and trim it to a maximum of 500 characters
    const message = searchParams.has("message")
      ? (searchParams.get("message") ?? "").trim().slice(0, 500)
      : undefined;

    // Clean up the URL by removing the "start_a_conversation" and "message" parameters
    searchParams.delete("start_a_conversation");
    searchParams.delete("message");

    // Update the browser history state to reflect the cleaned-up URL
    window.history.replaceState(
      window.history.state,
      "",
      `${currentUrl.pathname}${currentUrl.search}${currentUrl.hash}`,
    );

    // The client-only URL request initializes the controlled dialog after hydration.
    // eslint-disable-next-line react-hooks/set-state-in-effect -- This effect applies a consumed URL request once.
    setInitialMessage(message);
    setOpen(true);
  }, []);

  function sendCtaClickToGtm(): void {
    sendGTMEvent({ event: "cta_click" });
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      {/* Trigger button for the popover */}
      <DialogTrigger asChild>
        <CtaButton
          ctaVariant={ctaButtonVariant}
          aria-describedby="primary-cta-description"
          onClick={sendCtaClickToGtm}
        >
          Start a conversation
        </CtaButton>
      </DialogTrigger>
      {/* Popover content containing the CTA form */}
      <DialogContent>
        <CtaStepper
          initialMessage={initialMessage}
          onSubmitSuccess={() => setOpen(false)}
        />
      </DialogContent>
    </Dialog>
  );
}
