import React, { useState } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { useTheme } from '../../contexts/ThemeContext';
import { LogOut, User, FileText, Moon, Sun, Menu } from 'lucide-react';

const Header: React.FC = () => {
  const { user, logout } = useAuth();
  const { isDark, toggleTheme } = useTheme();
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <header className="bg-white/80 dark:bg-gray-900/80 backdrop-blur-md shadow-lg border-b border-gray-200/50 dark:border-gray-700/50 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo & Title */}
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-gradient-to-r from-blue-500 to-purple-600 rounded-xl shadow-lg transform hover:scale-110 transition-transform duration-300">
              <FileText className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-gradient">FeedbackPro</h1>
              <p className="text-xs text-gray-500 dark:text-gray-400 hidden sm:block">
                Collect. Analyze. Improve.
              </p>
            </div>
          </div>

          {/* Mobile Menu Toggle */}
          <button
            onClick={() => setMenuOpen(!menuOpen)}
            className="sm:hidden p-2 rounded-lg focus:outline-none hover:bg-gray-200 dark:hover:bg-gray-700 transition"
          >
            <Menu className="w-5 h-5 text-gray-600 dark:text-gray-300" />
          </button>

          {/* User Controls (Hidden on small screens) */}
          {user && (
            <div className="hidden sm:flex items-center space-x-4">
              {/* Theme Toggle */}
              <button
                onClick={toggleTheme}
                className="p-2 rounded-xl bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 transition-all duration-300 transform hover:scale-110"
                title={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
              >
                {isDark ? (
                  <Sun className="w-5 h-5 text-yellow-500" />
                ) : (
                  <Moon className="w-5 h-5 text-gray-600" />
                )}
              </button>

              {/* User Info */}
              <div className="flex items-center space-x-3 bg-gray-50 dark:bg-gray-800 rounded-xl px-3 py-2">
                <div className="p-1 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg">
                  <User className="w-4 h-4 text-white" />
                </div>
                <div className="text-sm">
                  <span className="font-semibold text-gray-700 dark:text-gray-200 block truncate max-w-[100px]">
                    {user.name}
                  </span>
                  <p className="text-xs text-gray-500 dark:text-gray-400 truncate max-w-[120px]">
                    {user.email}
                  </p>
                </div>
              </div>

              {/* Logout */}
              <button
                onClick={logout}
                className="flex items-center text-gray-500 hover:text-red-500 dark:text-gray-400 dark:hover:text-red-400 transition-colors duration-300 p-2 rounded-xl hover:bg-red-50 dark:hover:bg-red-900/20"
                title="Logout"
              >
                <LogOut className="w-5 h-5" />
              </button>
            </div>
          )}
        </div>

        {/* Mobile Dropdown Menu */}
        {menuOpen && user && (
          <div className="sm:hidden mt-2 space-y-2">
            <div className="flex items-center justify-between bg-gray-100 dark:bg-gray-800 rounded-xl p-3">
              <div className="flex items-center space-x-3">
                <div className="p-1 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg">
                  <User className="w-4 h-4 text-white" />
                </div>
                <div className="text-sm">
                  <span className="font-semibold text-gray-700 dark:text-gray-200 block">
                    {user.name}
                  </span>
                  <p className="text-xs text-gray-500 dark:text-gray-400">
                    {user.email}
                  </p>
                </div>
              </div>
              <button
                onClick={logout}
                className="text-gray-500 hover:text-red-500 dark:text-gray-400 dark:hover:text-red-400"
              >
                <LogOut className="w-5 h-5" />
              </button>
            </div>
            <button
              onClick={toggleTheme}
              className="w-full flex justify-center items-center gap-2 bg-gray-200 dark:bg-gray-700 py-2 rounded-xl text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-300 dark:hover:bg-gray-600 transition"
            >
              {isDark ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
              Toggle Theme
            </button>
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;
