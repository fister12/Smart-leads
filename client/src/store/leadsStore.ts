import { create } from 'zustand';
import { Lead, LeadFilters } from '../types/lead.types';

interface LeadsState {
  leads: Lead[];
  isLoading: boolean;
  error: string | null;
  pagination: {
    total: number;
    page: number;
    limit: number;
    pages: number;
  };
  filters: LeadFilters;

  setLeads: (leads: Lead[]) => void;
  setIsLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
  setPagination: (pagination: any) => void;
  setFilters: (filters: LeadFilters) => void;
  updateFilters: (partial: Partial<LeadFilters>) => void;
  resetFilters: () => void;
  clearError: () => void;
}

const defaultFilters: LeadFilters = {
  page: 1,
  limit: 10,
  sort: 'latest',
};

export const useLeadsStore = create<LeadsState>((set) => ({
  leads: [],
  isLoading: false,
  error: null,
  pagination: {
    total: 0,
    page: 1,
    limit: 10,
    pages: 0,
  },
  filters: defaultFilters,

  setLeads: (leads) => set({ leads }),

  setIsLoading: (loading) => set({ isLoading: loading }),

  setError: (error) => set({ error }),

  setPagination: (pagination) => set({ pagination }),

  setFilters: (filters) => set({ filters }),

  updateFilters: (partial) =>
    set((state) => ({
      filters: { ...state.filters, ...partial },
    })),

  resetFilters: () => set({ filters: defaultFilters }),

  clearError: () => set({ error: null }),
}));
