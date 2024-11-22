import {
  HomeIcon,
} from '@heroicons/react/24/outline';
import clsx from 'clsx';
import { useLocation, Link } from 'react-router-dom';

const links = [
  { name: 'strategies', href: '/strategy', icon: HomeIcon },
];

export default function NavLinks() {
  const location = useLocation(); // React Router hook
  const { pathname } = location;

  return (
    <>
      {links.map((link) => {
        const LinkIcon = link.icon;
        return (
          <Link
            key={link.name}
            to={link.href} // React Router's `to` instead of `href`
            className={clsx(
              'flex h-[48px] grow items-center justify-center gap-2 rounded-md bg-gray-50 p-3 text-sm font-medium hover:bg-sky-100 hover:text-blue-600 md:flex-none md:justify-start md:p-2 md:px-3',
              {
                'bg-sky-100 text-blue-600': pathname === link.href,
              },
            )}
          >
            <LinkIcon className="w-6" />
            <p className="hidden md:block">{link.name}</p>
          </Link>
        );
      })}
    </>
  );
}
