import { useState, useRef, useEffect } from "react";

export default function Dropdown({ trigger, children, align = "right" }) {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);

  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const alignmentClasses = {
    left: "left-0",
    right: "right-0",
  };

  return (
    <div className="relative" ref={dropdownRef}>
      <div onClick={() => setIsOpen(!isOpen)}>{trigger}</div>

      {isOpen && (
        <div
          className={`absolute ${alignmentClasses[align]} mt-2 w-56 rounded-lg bg-white dark:bg-gray-800 shadow-lg border border-gray-200 dark:border-gray-700 py-1 z-50 animate-fade-in`}
        >
          {children}
        </div>
      )}
    </div>
  );
}

export function DropdownItem({ children, onClick, className = "" }) {
  return (
    <button
      onClick={onClick}
      className={`w-full text-left px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors ${className}`}
    >
      {children}
    </button>
  );
}
