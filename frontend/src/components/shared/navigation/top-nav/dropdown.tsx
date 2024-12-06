import { useState, useRef, useEffect, ReactNode } from 'react';
import { ChevronDown, type LucideIcon } from 'lucide-react';

interface DropdownProps {
  children: ReactNode;
  icon?: LucideIcon;
  label?: string;
  animation: boolean
}

export default function Dropdown({ icon: Icon, label, animation, children }: DropdownProps) {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLLIElement>(null);

  const toggleDropdown = () => setIsOpen((prev) => !prev);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  return (
    <li ref={dropdownRef} className="relative">
      <button
        onClick={toggleDropdown}
        onMouseEnter={() => setIsOpen(true)}
        onFocus={() => setIsOpen(true)}
        className="flex items-center text-white rounded hover:bg-gray-700"
      >
        {Icon && <Icon className="h-5 w-5 mr-2" />}
        {label && <span className="mr-2">{label}</span>}
        {animation && <ChevronDown
          className={`h-4 w-4 transition-transform duration-200 ease-in-out ${isOpen ? 'rotate-180' : ''
            }`} />
        }
      </button>

      {(isOpen || dropdownRef.current?.matches(':hover')) && (
        <ul
          className="absolute left-0 w-48 bg-gray-800 text-white mt-2 rounded-md shadow-lg py-2 z-10"
          onMouseLeave={() => setIsOpen(false)}
        >
          {children}
        </ul>
      )}
    </li>
  );
}
