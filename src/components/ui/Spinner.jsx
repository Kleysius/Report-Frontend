// components/ui/Spinner.jsx

import React from "react";

/**
 * Spinner component using Tailwind CSS.
 *
 * Props:
 * - size: Tailwind classes for width/height, default "h-6 w-6"
 * - color: Tailwind border-color class, default "border-indigo-600"
 */
export default function Spinner({
  size = "h-6 w-6",
  color = "border-indigo-600",
}) {
  return (
    <div
      className={`animate-spin ${size} border-4 ${color} border-t-transparent rounded-full`}
      role="status"
      aria-label="Loading"
    />
  );
}
