import { useState, useRef, useEffect, ReactNode } from 'react';
import { ChevronDown, type LucideIcon } from 'lucide-react';

interface DropdownProps {
  children: ReactNode;
  icon?: LucideIcon;
  label?: string;
  animation: boolean;
  direction?: 'left' | 'right';
  textColor?: string;  // New prop for text color
}

export default function Dropdown({
  icon: Icon,
  label,
  animation,
  children,
  direction = 'left',
  textColor = 'text-white' // Default text color is white
}: DropdownProps) {
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
    <li ref={dropdownRef} className="relative list-none">
      <button
        onClick={toggleDropdown}
        onMouseEnter={() => setIsOpen(true)}
        onFocus={() => setIsOpen(true)}
        className={`flex items-center ${textColor} rounded hover:bg-gray-700`}
      >
        {Icon && <Icon className="h-5 w-5 mr-2" />}
        {label && <span className="mr-2">{label}</span>}
        {animation && (
          <ChevronDown
            className={`h-4 w-4 transition-transform duration-200 ease-in-out ${isOpen ? 'rotate-180' : ''
              }`}
          />
        )}
      </button>

      {(isOpen || dropdownRef.current?.matches(':hover')) && (
        <ul
          className={`absolute ${direction === 'right' ? 'right-0' : 'left-0'} w-48 bg-gray-800 ${textColor} mt-2 rounded-md shadow-lg z-10`}
          onMouseLeave={() => setIsOpen(false)}
        >
          {children}
        </ul>
      )}
    </li>
  );
}
