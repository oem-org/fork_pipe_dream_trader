import { TopNavLink } from "./top-nav-link";
//import { DropdownMenu } from "@/app/components/shared/navigation/dropdown-hover/dropdown-menu";
import { DropdownMenuTrigger } from "../dropdown-hover/dropdown-menu-trigger";
import { DropdownMenuContent } from "../dropdown-hover/dropdown-menu-content";
import { DropdownMenuItem } from "../dropdown-hover/dropdown-menu-item";
import { UserIcon } from "@heroicons/react/24/outline";

export default function TopNav() {
  return (
    <nav className="flex justify-between items-center px-4 py-2 bg-red border-b border-gray-200">
      <div className="flex items-center">
        Logo
      </div>

      <div className="flex items-center space-x-4">
        <TopNavLink href="/lol" name="lol">Examples</TopNavLink>
      </div>

      <div className="flex items-center">
        <DropdownMenuTrigger>
          <UserIcon />
          <span className="sr-only">User menu</span>
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
