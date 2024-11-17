"use client";

import React from "react";
import { TopNavMenu } from "@/app/components/shared/navigation/top-nav/top-nav-menu";
import { TopNavTrigger } from "@/app/components/shared/navigation/top-nav/top-nav-trigger";
import { TopNavContent } from "@/app/components/shared/navigation/top-nav/top-nav-content";
import { TopNavItem } from "@/app/components/shared/navigation/top-nav/top-nav-item";
import { Button } from "@/app/components/shared/navigation/top-nav/button";
import { DropdownMenu } from "@/app/components/shared/navigation/top-nav/dropdown-menu";
import { DropdownMenuTrigger } from "@/app/components/shared/navigation/top-nav/dropdown-menu-trigger";
import { DropdownMenuContent } from "@/app/components/shared/navigation/top-nav/dropdown-menu-content";
import { DropdownMenuItem } from "@/app/components/shared/navigation/top-nav/dropdown-menu-item";
import { User } from "@/app/components/shared/navigation/top-nav/icons";

export function TopNav() {
  return (
    <nav className="flex justify-between items-center px-4 py-2 bg-white border-b border-gray-200">
      <div className="flex items-center">
        <img
          src="/placeholder.svg?height=32&width=32"
          alt="Logo"
          className="h-8 w-8 mr-2"
        />
      </div>

      <div className="flex items-center space-x-4">
        <TopNavMenu>
          <TopNavTrigger>Documentation</TopNavTrigger>
          <TopNavContent>
            <TopNavItem>Examples</TopNavItem>
          </TopNavContent>
        </TopNavMenu>
        <TopNavMenu>
          <TopNavTrigger>Platform</TopNavTrigger>
          <TopNavContent>
            <TopNavItem>Features</TopNavItem>
          </TopNavContent>
        </TopNavMenu>
        <TopNavMenu>
          <TopNavTrigger>Tutorial</TopNavTrigger>
          <TopNavContent>
            <TopNavItem>Beginner Guide</TopNavItem>
          </TopNavContent>
        </TopNavMenu>
      </div>

      <div className="flex items-center">
        <DropdownMenu>
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
        </DropdownMenu>
      </div>
    </nav>
  );
}
