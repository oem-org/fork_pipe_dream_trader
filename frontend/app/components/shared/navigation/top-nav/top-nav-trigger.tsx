"use client";

import React from "react";

interface MenuTopNavTriggerProps {
  children: React.ReactNode;
  isOpen?: boolean;
  setIsOpen?: (isOpen: boolean) => void;
}

export function TopNavTrigger({
  children,
  isOpen,
  setIsOpen,
}: MenuTopNavTriggerProps) {
  return (
    <button
      className={`px-3 py-2 text-sm font-medium rounded-md ${
        isOpen ? "bg-gray-100" : "hover:bg-gray-100"
      }`}
      onClick={() => setIsOpen && setIsOpen(!isOpen)}
    >
      {children}
    </button>
  );
}
