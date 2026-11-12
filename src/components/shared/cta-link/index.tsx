import { ArrowUpRight } from "lucide-react";
import Link from "next/link";
import type { ComponentProps, JSX } from "react";

import { cn } from "@/lib/utils";

type CtaLinkProps = ComponentProps<typeof Link>;

export function CtaLink({
  children,
  className,
  ...props
}: CtaLinkProps): JSX.Element {
  return (
    <Link
      {...props}
      className={cn(
        "focus-visible:border-ring focus-visible:ring-ring/50 aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive border-foreground hover:bg-primary text-foreground inline-flex h-10 shrink-0 items-center justify-center gap-2 rounded-full! border bg-white px-2.5 py-5 font-sans text-lg font-medium whitespace-nowrap transition-all outline-none hover:text-white focus-visible:ring-[3px] disabled:pointer-events-none disabled:opacity-50 has-[>svg]:px-4 [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4",
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
    </Link>
  );
}
