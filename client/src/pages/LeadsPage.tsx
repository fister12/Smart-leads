import React, { useEffect, useState } from 'react';
import { Navbar } from '../components/layout/Navbar';
import { Sidebar } from '../components/layout/Sidebar';
import { LeadFilters } from '../components/leads/LeadFilters';
import { LeadTable } from '../components/leads/LeadTable';
import { LeadForm } from '../components/leads/LeadForm';
import { Modal } from '../components/ui/Modal';
import { Button } from '../components/ui/Button';
import { Toast } from '../components/ui/Toast';
import { useLeads } from '../hooks/useLeads';
import { Lead, LeadFilters as LeadFiltersType } from '../types/lead.types';

export const LeadsPage: React.FC = () => {
  const { leads, isLoading, pagination, filters, fetchLeads, createLead, updateLead, deleteLead, exportLeads, updateFilters } = useLeads();

  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [selectedLead, setSelectedLead] = useState<Lead | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isExporting, setIsExporting] = useState(false);
  const [toast, setToast] = useState<{ message: string; type: 'error' | 'success' } | null>(null);

  useEffect(() => {
    fetchLeads();
  }, []);

  const handleCreateLead = async (data: any) => {
    setIsSubmitting(true);
    try {
      await createLead(data);
      setToast({ message: 'Lead created successfully', type: 'success' });
      setIsCreateModalOpen(false);
      await fetchLeads();
    } catch (error) {
      setToast({ message: error instanceof Error ? error.message : 'Failed to create lead', type: 'error' });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleUpdateLead = async (data: any) => {
    if (!selectedLead) return;

    setIsSubmitting(true);
    try {
      await updateLead(selectedLead._id, data);
      setToast({ message: 'Lead updated successfully', type: 'success' });
      setIsEditModalOpen(false);
      setSelectedLead(null);
      await fetchLeads();
    } catch (error) {
      setToast({ message: error instanceof Error ? error.message : 'Failed to update lead', type: 'error' });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeleteLead = async (id: string) => {
    if (!confirm('Are you sure you want to delete this lead?')) return;

    try {
      await deleteLead(id);
      setToast({ message: 'Lead deleted successfully', type: 'success' });
      await fetchLeads();
    } catch (error) {
      setToast({ message: error instanceof Error ? error.message : 'Failed to delete lead', type: 'error' });
    }
  };

  const handleExport = async () => {
    setIsExporting(true);
    try {
      await exportLeads();
      setToast({ message: 'CSV exported successfully', type: 'success' });
    } catch (error) {
      setToast({ message: error instanceof Error ? error.message : 'Failed to export CSV', type: 'error' });
    } finally {
      setIsExporting(false);
    }
  };

  const handleFilterChange = async (newFilters: LeadFiltersType) => {
    updateFilters(newFilters);
    await fetchLeads(newFilters);
  };

  const handlePageChange = async (newPage: number) => {
    const newFilters = { ...filters, page: newPage };
    updateFilters(newFilters);
    await fetchLeads(newFilters);
  };

  return (
    <div className="flex min-h-screen bg-gray-100 dark:bg-gray-900">
      <Sidebar />
      <div className="flex-1 flex flex-col">
        <Navbar />
        <main className="flex-1 p-4 md:p-8 space-y-6">
          <div className="flex justify-between items-center">
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Leads</h1>
            <Button variant="primary" onClick={() => setIsCreateModalOpen(true)}>
              + New Lead
            </Button>
          </div>

          <LeadFilters onFiltersChange={handleFilterChange} onExport={handleExport} isExporting={isExporting} />

          <LeadTable
            leads={leads}
            isLoading={isLoading}
            onView={(id) => {
              const lead = leads.find((l) => l._id === id);
              if (lead) setSelectedLead(lead);
            }}
            onEdit={(id) => {
              const lead = leads.find((l) => l._id === id);
              if (lead) {
                setSelectedLead(lead);
                setIsEditModalOpen(true);
              }
            }}
            onDelete={handleDeleteLead}
          />

          {pagination && (
            <div className="flex justify-center gap-2">
              <Button
                variant="secondary"
                onClick={() => handlePageChange(pagination.page - 1)}
                disabled={pagination.page === 1}
              >
                Previous
              </Button>
              <span className="px-4 py-2 text-gray-700 dark:text-gray-300">
                Page {pagination.page} of {pagination.pages}
              </span>
              <Button
                variant="secondary"
                onClick={() => handlePageChange(pagination.page + 1)}
                disabled={pagination.page === pagination.pages}
              >
                Next
              </Button>
            </div>
          )}

          <Modal
            isOpen={isCreateModalOpen}
            title="Create New Lead"
            onClose={() => setIsCreateModalOpen(false)}
          >
            <LeadForm onSubmit={handleCreateLead} isLoading={isSubmitting} onCancel={() => setIsCreateModalOpen(false)} />
          </Modal>

          <Modal
            isOpen={isEditModalOpen}
            title="Edit Lead"
            onClose={() => {
              setIsEditModalOpen(false);
              setSelectedLead(null);
            }}
          >
            {selectedLead && (
              <LeadForm
                initialData={selectedLead}
                onSubmit={handleUpdateLead}
                isLoading={isSubmitting}
                onCancel={() => {
                  setIsEditModalOpen(false);
                  setSelectedLead(null);
                }}
              />
            )}
          </Modal>

          {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}
        </main>
      </div>
    </div>
  );
};
