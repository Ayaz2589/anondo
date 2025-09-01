"use client";

import * as React from "react";

function cn(...classes: (string | undefined)[]): string {
  return classes.filter(Boolean).join(" ");
}

interface BadgeProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: "default" | "secondary" | "destructive" | "outline";
}

function Badge({ className, variant = "default", ...props }: BadgeProps) {
  const variants = {
    default: "bg-blue-600 text-white hover:bg-blue-700",
    secondary: "bg-gray-100 text-gray-900 hover:bg-gray-200",
    destructive: "bg-red-600 text-white hover:bg-red-700",
    outline:
      "border border-gray-300 bg-transparent text-gray-700 hover:bg-gray-50",
  };

  return (
    <div
      className={cn(
        "inline-flex items-center rounded-[8px] px-2.5 py-0.5 text-xs font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2",
        variants[variant],
        className
      )}
      {...props}
    />
  );
}

export { Badge };
