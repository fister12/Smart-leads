import React from 'react';
import { Navbar } from '../components/layout/Navbar';
import { Sidebar } from '../components/layout/Sidebar';
import { useAuthStore } from '../store/authStore';

export const DashboardPage: React.FC = () => {
  const { user } = useAuthStore();

  return (
    <div className="flex min-h-screen bg-gray-100 dark:bg-gray-900">
      <Sidebar />
      <div className="flex-1 flex flex-col">
        <Navbar />
        <main className="flex-1 p-4 md:p-8">
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-8 text-center">
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
              Welcome, {user?.name}!
            </h1>
            <p className="text-gray-600 dark:text-gray-400 mb-8">
              You're logged in as a {user?.role === 'admin' ? 'Admin' : 'Sales User'}
            </p>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-8">
              <div className="bg-blue-50 dark:bg-blue-900 p-6 rounded-lg">
                <h3 className="text-xl font-semibold text-primary mb-2">Leads</h3>
                <p className="text-gray-600 dark:text-gray-300">Manage your sales leads</p>
              </div>

              <div className="bg-green-50 dark:bg-green-900 p-6 rounded-lg">
                <h3 className="text-xl font-semibold text-success mb-2">Performance</h3>
                <p className="text-gray-600 dark:text-gray-300">Track your metrics</p>
              </div>

              <div className="bg-purple-50 dark:bg-purple-900 p-6 rounded-lg">
                <h3 className="text-xl font-semibold text-accent mb-2">Analytics</h3>
                <p className="text-gray-600 dark:text-gray-300">View detailed reports</p>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};
