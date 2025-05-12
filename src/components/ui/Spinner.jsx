import React from "react";

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