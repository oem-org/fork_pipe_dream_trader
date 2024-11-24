import { TopNavLink } from "./top-nav-link";
//import { DropdownMenu } from "@/app/components/shared/navigation/dropdown-hover/dropdown-menu";
import { DropdownMenu } from "../dropdown-hover/dropdown-menu";
import useAuthStore from "../../../../lib/hooks/useAuthStore";
import { Link } from 'react-router-dom';

export default function TopNav() {
  const { isAuthenticated, logout } = useAuthStore()
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
      {isAuthenticated && (
        <button onClick={logout} className="flex h-[48px] w-full grow items-center justify-center gap-2 rounded-md bg-gray-50 p-3 text-sm font-medium hover:bg-sky-100 hover:text-blue-600 md:flex-none md:justify-start md:p-2 md:px-3">
          Logout
        </button>
      )}
      {!isAuthenticated && (
        <div className="flex flex-row">
          <Link to="/login">Login</Link>
          <Link to="/signup">Signup</Link>
        </div>
      )}
    </nav >
  );
}
