"use client";

import React from "react";

interface MenuTopNavItemProps {
  children: React.ReactNode;
}

export function TopNavItem({ children }: MenuTopNavItemProps) {
  return (
    <a
      href="#"
      className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 hover:text-gray-900"
      role="menuitem"
    >
      {children}
    </a>
  );
}
