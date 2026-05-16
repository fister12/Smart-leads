import React from 'react';
import { Table } from '../ui/Table';
import { Badge } from '../ui/Badge';
import { Lead, LeadStatus, LeadSource } from '../../types/lead.types';
import { formatDate } from '../../utils/formatDate';
import { statusBadgeVariants, sourceBadgeVariants } from './LeadCard';

interface LeadTableProps {
  leads: Lead[];
  isLoading?: boolean;
  onView: (id: string) => void;
  onEdit: (id: string) => void;
  onDelete: (id: string) => void;
}

export const LeadTable: React.FC<LeadTableProps> = ({ leads, isLoading, onView, onEdit, onDelete }) => {
  return (
    <Table
      columns={[
        { key: 'name' as const, label: 'Name' },
        { key: 'email' as const, label: 'Email' },
        { key: 'phone' as const, label: 'Phone' },
        {
          key: 'status' as const,
          label: 'Status',
          render: (status: LeadStatus) => (
            <Badge variant={statusBadgeVariants[status]}>{status}</Badge>
          ),
        },
        {
          key: 'source' as const,
          label: 'Source',
          render: (source: LeadSource) => (
            <Badge variant={sourceBadgeVariants[source]}>{source}</Badge>
          ),
        },
        {
          key: 'createdAt' as const,
          label: 'Created',
          render: (createdAt: string) => formatDate(createdAt),
        },
        {
          key: '_id' as const,
          label: 'Actions',
          render: (id: string) => (
            <div className="flex gap-2">
              <button onClick={() => onView(id)} className="text-xs text-primary hover:underline">
                View
              </button>
              <button onClick={() => onEdit(id)} className="text-xs text-primary hover:underline">
                Edit
              </button>
              <button onClick={() => onDelete(id)} className="text-xs text-danger hover:underline">
                Delete
              </button>
            </div>
          ),
        },
      ]}
      data={leads}
      isLoading={isLoading}
      emptyMessage="No leads found"
    />
  );
};
