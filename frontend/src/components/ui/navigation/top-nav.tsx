import NavItem from "./nav-item";
import Dropdown from "./dropdown";
import { Link } from "react-router-dom";
import { CircleUserIcon } from "lucide-react";
import useAuthStore from "@/lib/hooks/stores/useAuthStore";
import { queryClient } from "@/main";

export default function TopNav() {
  const { logout } = useAuthStore();

  return (
    <nav className="bg-gray-800 p-3 z-30 fixed top-0 left-0 w-full">
      <ul className="flex flex-row items-center justify-between">
        <div className="flex flex-row">
          <li className="text-white text-xl">MyApp</li>
          <NavItem to="/" label="Dashboard" />
          <NavItem to="/data" label="Data" />
          <Dropdown label="Strategies" animation={true}>
            <Link
              to="/select-strategy"
              className="btn-dropdown"
            >
              View all
            </Link>
            <Link
              to="/create-strategy"
              className="btn-dropdown"
            >
              Create new strategy
            </Link>
          </Dropdown>
        </div>
        <div className="flex space-x-4">
          <Dropdown icon={CircleUserIcon} animation={false} direction="right">
            <button
              onClick={() => { logout(queryClient); }}
              className="btn-dropdown"
            >
              Logout
            </button>
            <Link
              to="/profile"
              className="btn-dropdown"
            >
              Create new profile
            </Link>
          </Dropdown>
        </div>
      </ul>
    </nav>
  );
}
