import { cn } from "../lib/utils";
import { type HTMLAttributes } from "react";

interface StackProps extends HTMLAttributes<HTMLDivElement> {
  gap?: number;
  direction?: "horizontal" | "vertical";
  children: React.ReactNode;
}

export function Stack({
  gap = 4,
  direction = "vertical",
  className,
  children,
  ...props
}: StackProps) {
  return (
    <div
      className={cn(
        "flex",
        direction === "vertical" ? "flex-col" : "flex-row",
        `gap-${gap}`,
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
}
