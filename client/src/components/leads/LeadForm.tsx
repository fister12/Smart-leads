import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Input } from '../ui/Input';
import { Select } from '../ui/Select';
import { Button } from '../ui/Button';
import { Lead, CreateLeadInput, UpdateLeadInput } from '../../types/lead.types';

const leadSchema = z.object({
  name: z
    .string()
    .min(2, 'Name must be at least 2 characters')
    .max(100, 'Name must be at most 100 characters')
    .regex(/^[a-zA-Z\s]+$/, 'Name must contain only letters and spaces'),
  email: z.string().email('Invalid email address'),
  phone: z
    .string()
    .optional()
    .refine((val) => !val || /^\+91\d{10}$/.test(val), 'Phone must be in E.164 format (+91XXXXXXXXXX)'),
  source: z.enum(['website', 'instagram', 'referral']),
  status: z.enum(['new', 'contacted', 'qualified', 'lost']).optional(),
  notes: z
    .string()
    .optional()
    .refine((val) => !val || val.length <= 500, 'Notes must be at most 500 characters'),
});

type LeadFormData = z.infer<typeof leadSchema>;

interface LeadFormProps {
  onSubmit: (data: CreateLeadInput | UpdateLeadInput) => Promise<void>;
  initialData?: Lead;
  isLoading?: boolean;
  onCancel?: () => void;
}

export const LeadForm: React.FC<LeadFormProps> = ({ onSubmit, initialData, isLoading = false, onCancel }) => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LeadFormData>({
    resolver: zodResolver(leadSchema),
    defaultValues: initialData
      ? {
          name: initialData.name,
          email: initialData.email,
          phone: initialData.phone,
          source: initialData.source,
          status: initialData.status,
          notes: initialData.notes,
        }
      : {},
  });

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <Input
        label="Name *"
        placeholder="Enter lead name"
        {...register('name')}
        error={errors.name?.message}
      />

      <Input
        label="Email *"
        type="email"
        placeholder="Enter email address"
        {...register('email')}
        error={errors.email?.message}
      />

      <Input
        label="Phone"
        placeholder="+91XXXXXXXXXX"
        {...register('phone')}
        error={errors.phone?.message}
      />

      <Select
        label="Source *"
        {...register('source')}
        options={[
          { value: 'website', label: 'Website' },
          { value: 'instagram', label: 'Instagram' },
          { value: 'referral', label: 'Referral' },
        ]}
        error={errors.source?.message}
      />

      <Select
        label="Status"
        {...register('status')}
        options={[
          { value: 'new', label: 'New' },
          { value: 'contacted', label: 'Contacted' },
          { value: 'qualified', label: 'Qualified' },
          { value: 'lost', label: 'Lost' },
        ]}
        error={errors.status?.message}
      />

      <div className="flex flex-col gap-1">
        <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Notes</label>
        <textarea
          placeholder="Enter notes (max 500 characters)"
          className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary dark:bg-gray-800 dark:border-gray-600 dark:text-white"
          rows={4}
          {...register('notes')}
        />
        {errors.notes?.message && <span className="text-xs text-danger">{errors.notes.message}</span>}
      </div>

      <div className="flex gap-3">
        <Button type="submit" variant="primary" isLoading={isLoading}>
          {initialData ? 'Update Lead' : 'Create Lead'}
        </Button>
        {onCancel && (
          <Button type="button" variant="secondary" onClick={onCancel}>
            Cancel
          </Button>
        )}
      </div>
    </form>
  );
};
