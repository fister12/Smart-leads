import React from 'react';
import { Badge } from '../ui/Badge';
import { LeadStatus, LeadSource } from '../../types/lead.types';

export const statusBadgeVariants: Record<LeadStatus, 'blue' | 'yellow' | 'green' | 'red'> = {
  new: 'blue',
  contacted: 'yellow',
  qualified: 'green',
  lost: 'red',
};

export const sourceBadgeVariants: Record<LeadSource, 'blue' | 'yellow' | 'green' | 'red'> = {
  website: 'blue',
  instagram: 'yellow',
  referral: 'green',
};

interface LeadCardProps {
  name: string;
  email: string;
  phone?: string;
  status: LeadStatus;
  source: LeadSource;
  onView: () => void;
  onEdit: () => void;
  onDelete: () => void;
}

export const LeadCard: React.FC<LeadCardProps> = ({
  name,
  email,
  phone,
  status,
  source,
  onView,
  onEdit,
  onDelete,
}) => {
  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-4 space-y-3">
      <div>
        <h3 className="font-semibold text-gray-900 dark:text-white">{name}</h3>
        <p className="text-sm text-gray-600 dark:text-gray-400">{email}</p>
        {phone && <p className="text-sm text-gray-600 dark:text-gray-400">{phone}</p>}
      </div>
      <div className="flex gap-2 flex-wrap">
        <Badge variant={statusBadgeVariants[status]}>{status}</Badge>
        <Badge variant={sourceBadgeVariants[source]}>{source}</Badge>
      </div>
      <div className="flex gap-2">
        <button onClick={onView} className="text-xs text-primary hover:underline">
          View
        </button>
        <button onClick={onEdit} className="text-xs text-primary hover:underline">
          Edit
        </button>
        <button onClick={onDelete} className="text-xs text-danger hover:underline">
          Delete
        </button>
      </div>
    </div>
  );
};
