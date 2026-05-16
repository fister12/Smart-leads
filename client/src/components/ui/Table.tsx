import React from 'react';
import { Spinner } from './Spinner';

interface TableColumn<T> {
  key: keyof T;
  label: string;
  render?: (value: any, item: T) => React.ReactNode;
}

interface TableProps<T> {
  columns: TableColumn<T>[];
  data: T[];
  isLoading?: boolean;
  emptyMessage?: string;
}

export const Table = React.forwardRef<HTMLDivElement, TableProps<any>>(
  ({ columns, data, isLoading = false, emptyMessage = 'No data found' }, ref) => {
    if (isLoading) {
      return (
        <div className="flex justify-center items-center h-64">
          <Spinner />
        </div>
      );
    }

    if (data.length === 0) {
      return (
        <div className="flex justify-center items-center h-64 text-gray-500 dark:text-gray-400">
          {emptyMessage}
        </div>
      );
    }

    return (
      <div ref={ref} className="overflow-x-auto">
        <table className="w-full border-collapse">
          <thead className="bg-gray-100 dark:bg-gray-800">
            <tr>
              {columns.map((column) => (
                <th
                  key={String(column.key)}
                  className="px-4 py-3 text-left text-sm font-semibold text-gray-900 dark:text-white border-b border-gray-200 dark:border-gray-700"
                >
                  {column.label}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {data.map((item, rowIndex) => (
              <tr key={rowIndex} className="border-b border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800">
                {columns.map((column) => (
                  <td
                    key={`${rowIndex}-${String(column.key)}`}
                    className="px-4 py-3 text-sm text-gray-700 dark:text-gray-300"
                  >
                    {column.render ? column.render(item[column.key], item) : String(item[column.key] || '')}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    );
  }
);

Table.displayName = 'Table';
