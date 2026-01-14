"use client";

import { useState } from "react";
import { Button } from "../ui/button";
import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover";
import CtaForm from "./cta-form";

export default function CtaPopover() {
  const [open, setOpen] = useState(false);
  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="accent"
          size="lg"
          className="font-sans"
          type="button"
          aria-describedby="primary-cta-description"
        >
          Start a conversation
        </Button>
      </PopoverTrigger>
      <PopoverContent>
        <h4 className="font-semibold mb-4">Take the next step</h4>
        <CtaForm onSubmitSuccess={() => setOpen(false)} />
      </PopoverContent>
    </Popover>
  );
}
