"use client";

import React from "react";

interface ButtonProps {
  children: React.ReactNode;
  onClick?: () => void;
  variant?: "default" | "outline" | "destructive" | "secondary" | "ghost";
  size?: "default" | "sm" | "lg";
  asChild?: boolean;
  className?: string;
  disabled?: boolean;
  type?: "button" | "submit" | "reset";
}

export function Button({
  children,
  onClick,
  variant = "default",
  size = "default",
  asChild,
  className = "",
  disabled = false,
  type = "button",
}: ButtonProps) {
  const baseClasses =
    "inline-flex items-center justify-center font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none border-0 shadow-none";

  const sizeClasses = {
    default: "px-4 py-2 text-sm rounded-[8px]",
    sm: "px-3 py-1.5 text-xs rounded-[8px]",
    lg: "px-6 py-3 text-base rounded-[8px]",
  };

  const variantClasses = {
    default:
      "bg-blue-600 text-white hover:bg-blue-700 focus-visible:ring-blue-500",
    outline:
      "bg-transparent border border-gray-300 text-gray-700 hover:bg-gray-50 focus-visible:ring-gray-500",
    destructive:
      "bg-red-600 text-white hover:bg-red-700 focus-visible:ring-red-500",
    secondary:
      "bg-gray-600 text-white hover:bg-gray-700 focus-visible:ring-gray-500",
    ghost:
      "bg-transparent text-gray-700 hover:bg-gray-100 focus-visible:ring-gray-500",
  };

  const combinedClasses = `${baseClasses} ${sizeClasses[size]} ${variantClasses[variant]} ${className}`;

  if (asChild && React.isValidElement(children)) {
    return React.cloneElement(children as React.ReactElement<any>, {
      className: combinedClasses,
      onClick: onClick,
    });
  }

  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={combinedClasses}
    >
      {children}
    </button>
  );
}
