import { ReactNode } from "react";
import { Link } from "react-router-dom";

interface TopNavLinkProps {
  href: string;
  children?: ReactNode;
}

export function TopNavLink({ href, children }: TopNavLinkProps) {  // Destructure 'children' here
  return (
    <Link
      to={href}
      className={
        'flex h-[48px] grow items-center justify-center gap-2 rounded-md bg-gray-50 p-3 text-sm font-medium hover:bg-sky-100 hover:text-blue-600 md:flex-none md:justify-start md:p-2 md:px-3'
      }
    >
      {children} {/* Render 'children' here */}
    </Link>
  );
}
