"use client";

import { AspectRatio as AspectRatioPrimitive } from "radix-ui";
import type { JSX } from "react";

function AspectRatio({
  ...props
}: React.ComponentProps<typeof AspectRatioPrimitive.Root>): JSX.Element {
  return <AspectRatioPrimitive.Root data-slot="aspect-ratio" {...props} />;
}

export { AspectRatio };
