import axiosInstance from './axios';
import { Lead, LeadFilters, LeadListResponse, CreateLeadInput, UpdateLeadInput } from '../types/lead.types';

export const leadsApi = {
  listLeads: async (filters: LeadFilters): Promise<LeadListResponse> => {
    const params = new URLSearchParams();
    if (filters.status) params.append('status', filters.status);
    if (filters.source) params.append('source', filters.source);
    if (filters.search) params.append('search', filters.search);
    if (filters.sort) params.append('sort', filters.sort);
    if (filters.page) params.append('page', String(filters.page));
    if (filters.limit) params.append('limit', String(filters.limit));

    const response = await axiosInstance.get('/leads', { params });
    return response.data;
  },

  createLead: async (data: CreateLeadInput): Promise<Lead> => {
    const response = await axiosInstance.post('/leads', data);
    return response.data.data;
  },

  getLead: async (id: string): Promise<Lead> => {
    const response = await axiosInstance.get(`/leads/${id}`);
    return response.data.data;
  },

  updateLead: async (id: string, data: UpdateLeadInput): Promise<Lead> => {
    const response = await axiosInstance.put(`/leads/${id}`, data);
    return response.data.data;
  },

  deleteLead: async (id: string): Promise<void> => {
    await axiosInstance.delete(`/leads/${id}`);
  },

  exportLeads: async (filters: LeadFilters): Promise<void> => {
    const params = new URLSearchParams();
    if (filters.status) params.append('status', filters.status);
    if (filters.source) params.append('source', filters.source);
    if (filters.search) params.append('search', filters.search);
    if (filters.sort) params.append('sort', filters.sort);

    const response = await axiosInstance.get('/leads/export/csv', {
      params,
      responseType: 'blob',
    });

    const url = window.URL.createObjectURL(new Blob([response.data]));
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `leads_export_${new Date().toISOString().replace(/[-:]/g, '').split('.')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    link.parentNode?.removeChild(link);
  },
};
