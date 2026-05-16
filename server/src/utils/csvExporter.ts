import { Response } from 'express';
import { ILeadResponse } from '../types/lead.types.js';

export const csvExporter = {
  exportLeads: (leads: ILeadResponse[], res: Response): void => {
    const headers = ['Name', 'Email', 'Phone', 'Status', 'Source', 'Assigned To', 'Created At'];
    const rows = leads.map((lead) => [
      `"${lead.name.replace(/"/g, '""')}"`,
      `"${lead.email}"`,
      `"${lead.phone || ''}"`,
      lead.status,
      lead.source,
      `"${lead.assignedTo || ''}"`,
      lead.createdAt,
    ]);

    const csvContent = [headers.join(','), ...rows.map((row) => row.join(','))].join('\n');

    const timestamp = new Date().toISOString().replace(/[-:]/g, '').split('.')[0];
    const filename = `leads_export_${timestamp}.csv`;

    res.setHeader('Content-Type', 'text/csv');
    res.setHeader('Content-Disposition', `attachment; filename="${filename}"`);
    res.send(csvContent);
  },
};
