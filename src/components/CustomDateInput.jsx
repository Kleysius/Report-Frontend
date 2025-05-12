import React, { forwardRef } from "react";

const CustomDateInput = forwardRef(({ value, onClick }, ref) => (
  <button
    ref={ref}
    type="button"
    onClick={onClick}
    className="flex items-center gap-2 border px-2 py-1 rounded-md text-sm 
           bg-white dark:bg-gray-900 border-gray-300 dark:border-gray-700
           text-gray-800 dark:text-gray-400 hover:border-indigo-400 transition-colors duration-500
            ease-in-out focus:outline-none focus:ring-2 focus:ring-indigo-400"
  >
    <svg
      className="w-4 h-4 text-gray-500 dark:text-gray-400"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      viewBox="0 0 24 24"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 0 0 2-2V7a2 2 0 0 0-2-2H5a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2Z"
      />
    </svg>
    <span className="truncate">{value || "JJ/MM/AAAA"}</span>
  </button>
));

CustomDateInput.displayName = "CustomDateInput";

export default CustomDateInput;
