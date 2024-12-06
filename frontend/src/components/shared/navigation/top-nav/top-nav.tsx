import NavItem from "./nav-item";
import Dropdown from "./dropdown";
import { Link } from "react-router-dom";
import { CircleUserIcon } from "lucide-react";

export default function TopNav() {
  return (
    <nav className="bg-gray-800 p-3">
      <ul className="flex flex-row items-center justify-between">
        <div className="flex flex-row"> {/* Corrected the comma to space */}
          <li className="text-white text-xl">MyApp</li>
          <NavItem to="/" label="Dashboard" />
          <Dropdown label="Strategies" animation={true}>
            <Link to="/select-strategy" className="block text-white px-4 py-2">View all</Link>
            <Link to="/create-strategy" className="block text-white px-4 py-2">Create new strategy</Link>
          </Dropdown>
        </div>
        <div className="flex space-x-4">
          <Dropdown icon={CircleUserIcon} animation={false}>
            <Link to="/profile" className="block text-white px-4 py-2">Profiles</Link>
            <Link to="/profile" className="block text-white px-4 py-2">Create new profile</Link>
            <Link to="/profile" className="block text-white px-4 py-2">Logout</Link>
          </Dropdown>
        </div>

      </ul>
    </nav>
  );
}
