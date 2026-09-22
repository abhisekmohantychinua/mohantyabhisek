import * as React from "react";

import { cn } from "@/lib/utils";

export interface BrandMarkProps extends React.SVGAttributes<SVGSVGElement> {
  variant?: "line-vertical" | "line-horizontal" | "circle";
  thickness?: number;
  height?: number;
  accentPercent?: number;
  primaryClassName?: string;
  accentClassName?: string;
}

// eslint-disable-next-line @typescript-eslint/naming-convention
export const BrandMark = React.forwardRef<SVGSVGElement, BrandMarkProps>(
  function BrandMark(
    {
      variant = "line-vertical",
      thickness,
      height,
      accentPercent,
      primaryClassName,
      accentClassName,
      className,
      ...props
    },
    ref,
  ): React.JSX.Element {
    if (variant === "circle") {
      const size = height ?? 100;
      const strokeWidth = thickness ?? 24;
      const accent = (accentPercent ?? 40) / 100;

      const radius = (size - strokeWidth) / 2;
      const circumference = 2 * Math.PI * radius;

      const accentLength = circumference * accent;
      const primaryLength = circumference - accentLength;

      return (
        <svg
          ref={ref}
          width={size}
          height={size}
          viewBox={`0 0 ${size} ${size}`}
          className={cn("shrink-0", className)}
          aria-hidden="true"
          {...props}
        >
          <g transform={`rotate(-120 ${size / 2} ${size / 2})`}>
            <circle
              cx={size / 2}
              cy={size / 2}
              r={radius}
              fill="none"
              stroke="var(--color-primary)"
              strokeWidth={strokeWidth}
              className={primaryClassName}
            />

            <circle
              cx={size / 2}
              cy={size / 2}
              r={radius}
              fill="none"
              stroke="var(--color-accent)"
              strokeWidth={strokeWidth}
              strokeDasharray={`${accentLength} ${primaryLength}`}
              strokeLinecap="butt"
              className={accentClassName}
            />
          </g>
        </svg>
      );
    }

    const thicknessValue = thickness ?? 1;
    const length = height ?? 150;
    const accent = (accentPercent ?? 50) / 100;

    if (variant === "line-horizontal") {
      return (
        <svg
          ref={ref}
          width={length}
          height={thicknessValue}
          viewBox={`0 0 ${length} ${thicknessValue}`}
          className={cn("shrink-0", className)}
          aria-hidden="true"
          {...props}
        >
          <rect
            x={0}
            y={0}
            width={length}
            height={thicknessValue}
            fill="var(--color-primary)"
            className={primaryClassName}
          />

          <rect
            x={0}
            y={0}
            width={length * accent}
            height={thicknessValue}
            fill="var(--color-accent)"
            className={accentClassName}
          />
        </svg>
      );
    }

    return (
      <svg
        ref={ref}
        width={thicknessValue}
        height={length}
        viewBox={`0 0 ${thicknessValue} ${length}`}
        className={cn("shrink-0", className)}
        aria-hidden="true"
        {...props}
      >
        <rect
          x={0}
          y={0}
          width={thicknessValue}
          height={length}
          fill="var(--color-primary)"
          className={primaryClassName}
        />

        <rect
          x={0}
          y={0}
          width={thicknessValue}
          height={length * accent}
          fill="var(--color-accent)"
          className={accentClassName}
        />
      </svg>
    );
  },
);

BrandMark.displayName = "BrandMark";

export default BrandMark;
