import * as React from "react";

import { cn } from "@/lib/utils";

export interface BrandMarkProps extends React.SVGAttributes<SVGSVGElement> {
  variant?: "line" | "circle";
  thickness?: number;
  height?: number;
  accentPercent?: number;
}

export function BrandMark({
  variant = "line",
  thickness,
  height,
  accentPercent,
  className,
  ...props
}: BrandMarkProps): React.JSX.Element {
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
          />
        </g>
      </svg>
    );
  }

  const barWidth = thickness ?? 1;
  const barHeight = height ?? 150;
  const accent = (accentPercent ?? 50) / 100;

  return (
    <svg
      width={barWidth}
      height={barHeight}
      viewBox={`0 0 ${barWidth} ${barHeight}`}
      className={cn("shrink-0", className)}
      aria-hidden="true"
      {...props}
    >
      <rect
        x={0}
        y={0}
        width={barWidth}
        height={barHeight * accent}
        fill="var(--color-accent)"
      />

      <rect
        x={0}
        y={barHeight * accent}
        width={barWidth}
        height={barHeight * (1 - accent)}
        fill="var(--color-primary)"
      />
    </svg>
  );
}

export default BrandMark;
