import { Link } from 'react-router-dom';

interface DropdownItemProps {
  label: string
  to: string
}

export default function NavItem({ to, label }: DropdownItemProps) {
  return (

    <li className="text-white">
      <Link to={to} className="hover:bg-gray-700 px-4 py-2 rounded text-xl">{label}</Link>
    </li>
  );

}
