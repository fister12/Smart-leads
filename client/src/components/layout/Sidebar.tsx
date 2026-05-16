import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuthStore } from '../../store/authStore';

export const Sidebar: React.FC = () => {
  const location = useLocation();
  const { user } = useAuthStore();

  const isActive = (path: string) => location.pathname === path;

  return (
    <div className="hidden md:flex w-64 h-screen bg-gray-50 dark:bg-gray-900 border-r border-gray-200 dark:border-gray-700 flex-col">
      <div className="p-6">
        <h2 className="text-lg font-bold text-primary">Navigation</h2>
      </div>

      <nav className="flex-1 px-4 space-y-2">
        <Link
          to="/dashboard"
          className={`block px-4 py-2 rounded-lg transition-colors ${
            isActive('/dashboard')
              ? 'bg-primary text-white'
              : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800'
          }`}
        >
          Dashboard
        </Link>

        <Link
          to="/leads"
          className={`block px-4 py-2 rounded-lg transition-colors ${
            isActive('/leads')
              ? 'bg-primary text-white'
              : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800'
          }`}
        >
          Leads
        </Link>

        {user?.role === 'admin' && (
          <Link
            to="/admin/users"
            className={`block px-4 py-2 rounded-lg transition-colors ${
              isActive('/admin/users')
                ? 'bg-primary text-white'
                : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800'
            }`}
          >
            Users
          </Link>
        )}
      </nav>
    </div>
  );
};
