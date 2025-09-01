"use client";

import React from "react";
import Image from "next/image";

interface AvatarProps {
  src?: string | null;
  alt?: string;
  name?: string | null;
  email?: string;
  size?: "sm" | "md" | "lg";
  className?: string;
}

// Function to generate a consistent color based on a string
const getColorFromString = (str: string): string => {
  const colors = [
    "bg-red-500",
    "bg-blue-500",
    "bg-green-500",
    "bg-yellow-500",
    "bg-purple-500",
    "bg-pink-500",
    "bg-indigo-500",
    "bg-teal-500",
    "bg-orange-500",
    "bg-cyan-500",
    "bg-lime-500",
    "bg-emerald-500",
  ];

  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    hash = str.charCodeAt(i) + ((hash << 5) - hash);
  }

  return colors[Math.abs(hash) % colors.length];
};

// Function to get initials from name or email
const getInitials = (name?: string | null, email?: string): string => {
  if (name) {
    return name
      .split(" ")
      .map((word) => word.charAt(0))
      .join("")
      .toUpperCase()
      .slice(0, 2);
  }

  if (email) {
    return email.charAt(0).toUpperCase();
  }

  return "?";
};

export function Avatar({
  src,
  alt,
  name,
  email = "",
  size = "md",
  className = "",
}: AvatarProps) {
  const sizeClasses = {
    sm: "w-6 h-6 text-xs",
    md: "w-8 h-8 text-sm",
    lg: "w-12 h-12 text-lg",
  };

  const initials = getInitials(name, email);
  const backgroundColor = getColorFromString(name || email);

  const baseClasses = `rounded-full flex items-center justify-center ${sizeClasses[size]} ${className}`;

  if (src && src.trim() !== "") {
    return (
      <Image
        src={src}
        alt={alt || name || "Avatar"}
        width={size === "sm" ? 24 : size === "md" ? 32 : 48}
        height={size === "sm" ? 24 : size === "md" ? 32 : 48}
        className={baseClasses}
      />
    );
  }

  return (
    <div className={`${baseClasses} ${backgroundColor} text-white font-medium`}>
      {initials}
    </div>
  );
}
