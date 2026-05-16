import { ILead, ILeadResponse, LeadFilterQuery } from '../../types/lead.types.js';
import { LeadRepository } from './lead.repository.js';
import { AppError } from '../../utils/AppError.js';
import { UserRole } from '../../types/user.types.js';
import { Types } from 'mongoose';

export class LeadService {
  static async createLead(
    leadData: Partial<ILead>,
    createdBy: string
  ): Promise<ILeadResponse> {
    const existingLead = await LeadRepository.findByEmail(leadData.email || '');
    if (existingLead) {
      throw new AppError('Email already in use', 409);
    }

    const lead = await LeadRepository.create({
      ...leadData,
      createdBy: new Types.ObjectId(createdBy),
      email: leadData.email?.toLowerCase(),
    });

    return this.formatLeadResponse(lead);
  }

  static async getLead(id: string, userId: string, role: UserRole): Promise<ILeadResponse> {
    const lead = await LeadRepository.findById(id);
    if (!lead) {
      throw new AppError('Lead not found', 404);
    }

    // Sales users can only view their own leads
    if (role === 'salesUser' && lead.createdBy.toString() !== userId) {
      throw new AppError('Access denied', 403);
    }

    return this.formatLeadResponse(lead);
  }

  static async listLeads(
    filters: LeadFilterQuery,
    userId: string,
    role: UserRole
  ): Promise<{
    leads: ILeadResponse[];
    pagination: { total: number; page: number; limit: number; pages: number };
  }> {
    const { leads, total } = await LeadRepository.findAll(filters, userId, role);

    const page = filters.page || 1;
    const limit = filters.limit || 10;

    return {
      leads: leads.map((lead) => this.formatLeadResponse(lead)),
      pagination: {
        total,
        page,
        limit,
        pages: Math.ceil(total / limit),
      },
    };
  }

  static async getLeadsForExport(
    filters: LeadFilterQuery,
    userId: string,
    role: UserRole
  ): Promise<ILeadResponse[]> {
    const leads = await LeadRepository.findForExport(filters, userId, role);
    return leads.map((lead) => this.formatLeadResponse(lead));
  }

  static async updateLead(
    id: string,
    updates: Partial<ILead>,
    userId: string,
    role: UserRole
  ): Promise<ILeadResponse> {
    const lead = await LeadRepository.findById(id);
    if (!lead) {
      throw new AppError('Lead not found', 404);
    }

    // Sales users can only update their own leads
    if (role === 'salesUser' && lead.createdBy.toString() !== userId) {
      throw new AppError('Access denied', 403);
    }

    // Prevent updates to createdBy
    const sanitizedUpdates = { ...updates };
    delete sanitizedUpdates.createdBy;

    if (updates.email && updates.email !== lead.email) {
      const existingLead = await LeadRepository.findByEmail(updates.email);
      if (existingLead) {
        throw new AppError('Email already in use', 409);
      }
    }

    const updatedLead = await LeadRepository.updateById(id, sanitizedUpdates);
    if (!updatedLead) {
      throw new AppError('Lead not found', 404);
    }

    return this.formatLeadResponse(updatedLead);
  }

  static async deleteLead(id: string, userId: string, role: UserRole): Promise<void> {
    const lead = await LeadRepository.findById(id);
    if (!lead) {
      throw new AppError('Lead not found', 404);
    }

    // Only admins can delete leads
    if (role !== 'admin') {
      throw new AppError('Access denied', 403);
    }

    await LeadRepository.deleteById(id);
  }

  private static formatLeadResponse(lead: ILead): ILeadResponse {
    return {
      _id: lead._id.toString(),
      name: lead.name,
      email: lead.email,
      phone: lead.phone,
      status: lead.status,
      source: lead.source,
      notes: lead.notes,
      assignedTo: lead.assignedTo?.toString(),
      createdBy: lead.createdBy.toString(),
      createdAt: lead.createdAt.toISOString(),
      updatedAt: lead.updatedAt.toISOString(),
    };
  }
}
