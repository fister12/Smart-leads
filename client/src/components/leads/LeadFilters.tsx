import React, { useState } from 'react';
import { Input } from '../ui/Input';
import { Select } from '../ui/Select';
import { Button } from '../ui/Button';
import type { LeadFilters as LeadFiltersQuery } from '../../types/lead.types';
import { useDebounce } from '../../hooks/useDebounce';

interface LeadFiltersProps {
  onFiltersChange: (filters: LeadFiltersQuery) => void;
  onExport?: () => void;
  isExporting?: boolean;
}

export const LeadFilters: React.FC<LeadFiltersProps> = ({ onFiltersChange, onExport, isExporting = false }) => {
  const [search, setSearch] = useState('');
  const [status, setStatus] = useState('');
  const [source, setSource] = useState('');
  const [sort, setSort] = useState('latest');

  const debouncedSearch = useDebounce(search, 350);

  const handleFilterChange = () => {
    const filters: LeadFiltersQuery = {
      page: 1,
      limit: 10,
      ...(debouncedSearch && { search: debouncedSearch }),
      ...(status && { status: status as any }),
      ...(source && { source: source as any }),
      sort: sort as any,
    };
    onFiltersChange(filters);
  };

  React.useEffect(() => {
    handleFilterChange();
  }, [debouncedSearch, status, source, sort]);

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-4 space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Input
          placeholder="Search by name or email..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />

        <Select
          options={[
            { value: 'new', label: 'New' },
            { value: 'contacted', label: 'Contacted' },
            { value: 'qualified', label: 'Qualified' },
            { value: 'lost', label: 'Lost' },
          ]}
          value={status}
          onChange={(e) => setStatus(e.target.value)}
        >
          Status Filter
        </Select>

        <Select
          options={[
            { value: 'website', label: 'Website' },
            { value: 'instagram', label: 'Instagram' },
            { value: 'referral', label: 'Referral' },
          ]}
          value={source}
          onChange={(e) => setSource(e.target.value)}
        >
          Source Filter
        </Select>

        <Select
          options={[
            { value: 'latest', label: 'Latest' },
            { value: 'oldest', label: 'Oldest' },
          ]}
          value={sort}
          onChange={(e) => setSort(e.target.value)}
        >
          Sort By
        </Select>
      </div>

      {onExport && (
        <div className="flex justify-end">
          <Button variant="secondary" onClick={onExport} isLoading={isExporting}>
            Export CSV
          </Button>
        </div>
      )}
    </div>
  );
};
