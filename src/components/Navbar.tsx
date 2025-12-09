import { Moon, Sun, LogOut } from "lucide-react";
import { useTheme } from "@/context/ThemeContext";
import { useAuth } from "@/context/AuthContext";
import Button from "./Button";
import Avatar from "./Avatar";
import Dropdown, { DropdownItem } from "./Dropdown";

export default function Navbar() {
  const { theme, toggleTheme } = useTheme();
  const { user, logout } = useAuth();
  const displayName = user?.name || "User";

  return (
    <nav className="fixed top-0 left-0 right-0 z-40 border-b border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800">
      <div className="flex h-16 items-center px-6">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center">
            <span className="text-white font-bold text-lg">TC</span>
          </div>
          <span className="text-xl font-bold text-gray-900 dark:text-gray-100">
            Team Collab
          </span>
        </div>

        <div className="ml-auto flex items-center gap-4">
          <Button
            variant="ghost"
            size="icon"
            onClick={toggleTheme}
            className="rounded-full"
            aria-label="Toggle theme"
          >
            {theme === "dark" ? (
              <Sun className="h-5 w-5" />
            ) : (
              <Moon className="h-5 w-5" />
            )}
          </Button>

          <Dropdown
            trigger={
              <button className="focus:outline-none" aria-label="User menu">
                <Avatar name={displayName} size="md" />
              </button>
            }
          >
            <div className="px-4 py-3 border-b border-gray-200 dark:border-gray-700">
              <p className="text-sm font-medium text-gray-900 dark:text-gray-100">
                {user?.name}
              </p>
              <p className="text-xs text-gray-500 dark:text-gray-400">
                {user?.email}
              </p>
              <p className="text-xs text-blue-600 dark:text-blue-400 mt-1">
                {user?.role}
              </p>
            </div>
            <DropdownItem onClick={logout}>
              <div className="flex items-center gap-2">
                <LogOut className="h-4 w-4" />
                Logout
              </div>
            </DropdownItem>
          </Dropdown>
        </div>
      </div>
    </nav>
  );
}

