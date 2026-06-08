import { ArrowUpRight } from "lucide-react";
import type { JSX } from "react";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

type CtaButtonProps = React.ComponentProps<typeof Button>;

export function CtaButton({
  children,
  className,
  ...props
}: CtaButtonProps): JSX.Element {
  return (
    <Button
      {...props}
      variant="ghost"
      size="lg"
      className={cn(
        "border-foreground hover:bg-primary text-foreground border bg-white px-2.5 py-5 font-sans text-lg hover:text-white",
        className,
      )}
    >
      <span>{children}</span>

      <span
        aria-hidden="true"
        className="bg-accent flex size-7 items-center justify-center rounded-full"
      >
        <ArrowUpRight className="size-3" />
      </span>
    </Button>
  );
}
