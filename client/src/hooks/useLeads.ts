import { useCallback } from 'react';
import { useLeadsStore } from '../store/leadsStore';
import { leadsApi } from '../api/leads.api';
import { LeadFilters } from '../types/lead.types';

export const useLeads = () => {
  const {
    leads,
    isLoading,
    error,
    pagination,
    filters,
    setLeads,
    setIsLoading,
    setError,
    setPagination,
    updateFilters,
  } = useLeadsStore();

  const fetchLeads = useCallback(async (newFilters?: LeadFilters) => {
    setIsLoading(true);
    setError(null);
    try {
      const filterToUse = newFilters || filters;
      const response = await leadsApi.listLeads(filterToUse);
      setLeads(response.data);
      setPagination(response.pagination);
      updateFilters(filterToUse);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch leads');
    } finally {
      setIsLoading(false);
    }
  }, [filters, setLeads, setIsLoading, setError, setPagination, updateFilters]);

  const createLead = useCallback(async (data: any) => {
    try {
      const newLead = await leadsApi.createLead(data);
      setLeads([newLead, ...leads]);
      return newLead;
    } catch (err) {
      throw err;
    }
  }, [leads, setLeads]);

  const updateLead = useCallback(async (id: string, data: any) => {
    try {
      const updatedLead = await leadsApi.updateLead(id, data);
      setLeads(leads.map((lead) => (lead._id === id ? updatedLead : lead)));
      return updatedLead;
    } catch (err) {
      throw err;
    }
  }, [leads, setLeads]);

  const deleteLead = useCallback(async (id: string) => {
    try {
      await leadsApi.deleteLead(id);
      setLeads(leads.filter((lead) => lead._id !== id));
    } catch (err) {
      throw err;
    }
  }, [leads, setLeads]);

  const exportLeads = useCallback(async () => {
    try {
      await leadsApi.exportLeads(filters);
    } catch (err) {
      throw err;
    }
  }, [filters]);

  return {
    leads,
    isLoading,
    error,
    pagination,
    filters,
    fetchLeads,
    createLead,
    updateLead,
    deleteLead,
    exportLeads,
    updateFilters,
  };
};
