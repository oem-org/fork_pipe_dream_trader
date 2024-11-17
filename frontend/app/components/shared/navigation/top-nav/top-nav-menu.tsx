"use client";

import React, { useState } from "react";

interface MenuTopNavMenuProps {
  children: React.ReactNode;
}

export function
TopNavMenu({ children }: MenuTopNavMenuProps) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div
      className="relative"
      onMouseEnter={() => setIsOpen(true)}
      onMouseLeave={() => setIsOpen(false)}
    >
      {React.Children.map(children, (child) => {
        if (React.isValidElement(child)) {
          return React.cloneElement(child, { isOpen, setIsOpen });
        }
        return child;
      })}
    </div>
  );
}
