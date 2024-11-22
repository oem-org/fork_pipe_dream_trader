import { TopNavLink } from "./top-nav-link";
//import { DropdownMenu } from "@/app/components/shared/navigation/dropdown-hover/dropdown-menu";
import { DropdownMenu } from "../dropdown-hover/dropdown-menu";

export default function TopNav() {
  return (
    <nav className="flex justify-between items-center px-4 py-2 bg-red border-b border-gray-200">
      <div className="flex items-center">
        Logo
      </div>

      <div className="flex items-center space-x-4">
        <TopNavLink href="/strategy">Strategies</TopNavLink>
      </div>

      <p>lool</p>
      <div className="flex items-center">
        <DropdownMenu />
      </div>
    </nav >
  );
}
