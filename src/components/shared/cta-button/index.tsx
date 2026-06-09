import { ArrowUpRight } from "lucide-react";
import type { JSX } from "react";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

type CtaButtonProps = React.ComponentProps<typeof Button> & {
  ctaVariant?: "default" | "accent";
};

export function CtaButton({
  ctaVariant = "default",
  children,
  className,
  ...props
}: CtaButtonProps): JSX.Element {
  const btnColorClasses =
    ctaVariant === "default"
      ? "border-foreground hover:bg-primary text-foreground bg-white hover:text-white"
      : "border-accent hover:bg-white text-white bg-accent hover:text-accent";
  const iconCircleClasses =
    ctaVariant === "default" ? "bg-accent" : "bg-primary";
  return (
    <Button
      {...props}
      variant="ghost"
      size="lg"
      className={cn(
        "border px-2.5 py-5 font-sans text-lg",
        btnColorClasses,
        className,
      )}
    >
      <span>{children}</span>

      <span
        aria-hidden="true"
        className={`flex size-7 items-center justify-center rounded-full ${iconCircleClasses}`}
      >
        <ArrowUpRight className="size-3" />
      </span>
    </Button>
  );
}
