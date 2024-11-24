import { useState } from 'react';
import { DropdownMenuTrigger } from "../dropdown-hover/dropdown-menu-trigger";
import { DropdownMenuContent } from "../dropdown-hover/dropdown-menu-content";
import { DropdownMenuItem } from "../dropdown-hover/dropdown-menu-item";
import { UserIcon } from "@heroicons/react/24/outline";

export function DropdownMenu() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div
      className="relative"
      onMouseEnter={() => setIsOpen(true)}   // Open on hover
      onMouseLeave={() => setIsOpen(false)}  // Close on hover out
    >
      <div className={isOpen ? 'block' : 'hidden'}>
        <DropdownMenuTrigger>
          <UserIcon className="w-6" />
        </DropdownMenuTrigger>
        <DropdownMenuContent>
          <p>lool</p>
          <DropdownMenuItem>Profile</DropdownMenuItem>
          <DropdownMenuItem>Settings</DropdownMenuItem>
          <DropdownMenuItem>Billing</DropdownMenuItem>
          <DropdownMenuItem>Log out</DropdownMenuItem>
        </DropdownMenuContent>

      </div>
    </div>
  );
}
