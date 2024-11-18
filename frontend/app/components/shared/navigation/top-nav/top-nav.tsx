"use client";
import React from "react";
import { TopNavLink } from "@/app/components/shared/navigation/top-nav/top-nav-link";
import { Button } from "@/app/components/shared/navigation/top-nav/button";
//import { DropdownMenu } from "@/app/components/shared/navigation/dropdown-hover/dropdown-menu";
import { DropdownMenuTrigger } from "@/app/components/shared/navigation/dropdown-hover/dropdown-menu-trigger";
import { DropdownMenuContent } from "@/app/components/shared/navigation/dropdown-hover/dropdown-menu-content";
import { DropdownMenuItem } from "@/app/components/shared/navigation/dropdown-hover/dropdown-menu-item";
import { User } from "@/app/components/shared/navigation/top-nav/icons";

export function TopNav() {
  return (
    <nav className="flex justify-between items-center px-4 py-2 bg-white border-b border-gray-200">
      <div className="flex items-center">
        Logo
      </div>

      <div className="flex items-center space-x-4">
        <TopNavLink href="/lol" name="lol">Examples</TopNavLink>
      </div>

      <div className="flex items-center">
        <DropdownMenuTrigger>
          <Button variant="ghost" size="icon">
            <User className="h-5 w-5" />
            <span className="sr-only">User menu</span>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent>
          <DropdownMenuItem>Profile</DropdownMenuItem>
          <DropdownMenuItem>Settings</DropdownMenuItem>
          <DropdownMenuItem>Billing</DropdownMenuItem>
          <DropdownMenuItem>Log out</DropdownMenuItem>
        </DropdownMenuContent>
      </div>
    </nav >
  );
}
