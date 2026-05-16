import React from 'react';

interface BadgeProps {
  children: React.ReactNode;
  variant?: 'blue' | 'yellow' | 'green' | 'red';
}

export const Badge: React.FC<BadgeProps> = ({ children, variant = 'blue' }) => {
  const bgColors = {
    blue: 'bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-200',
    yellow: 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900 dark:text-yellow-200',
    green: 'bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-200',
    red: 'bg-red-100 text-red-700 dark:bg-red-900 dark:text-red-200',
  };

  return <span className={`px-2 py-1 text-xs font-semibold rounded-full ${bgColors[variant]}`}>{children}</span>;
};
