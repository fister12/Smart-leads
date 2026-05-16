import { Types } from 'mongoose';
import { Lead } from '../../models/Lead.model.js';
import { ILead, LeadFilterQuery } from '../../types/lead.types.js';

export class LeadRepository {
  static async create(leadData: Partial<ILead>): Promise<ILead> {
    return Lead.create(leadData);
  }

  static async findById(id: string): Promise<ILead | null> {
    return Lead.findById(id).populate('createdBy', 'name email').populate('assignedTo', 'name email');
  }

  static async findByEmail(email: string): Promise<ILead | null> {
    return Lead.findOne({ email: email.toLowerCase() });
  }

  static async findAll(
    filters: LeadFilterQuery,
    createdBy: string,
    role: string
  ): Promise<{ leads: ILead[]; total: number }> {
    const page = filters.page || 1;
    const limit = filters.limit || 10;
    const skip = (page - 1) * limit;

    const query: any = {};

    // RBAC: Sales users see only their leads
    if (role === 'salesUser') {
      query.createdBy = new Types.ObjectId(createdBy);
    }

    // Apply status filter
    if (filters.status) {
      query.status = filters.status;
    }

    // Apply source filter
    if (filters.source) {
      query.source = filters.source;
    }

    // Apply search filter
    if (filters.search) {
      query.$or = [
        { name: { $regex: filters.search, $options: 'i' } },
        { email: { $regex: filters.search, $options: 'i' } },
      ];
    }

    // Apply sorting
    const sortQuery: any = {};
    if (filters.sort === 'latest') {
      sortQuery.createdAt = -1;
    } else if (filters.sort === 'oldest') {
      sortQuery.createdAt = 1;
    } else {
      sortQuery.createdAt = -1;
    }

    const leads = await Lead.find(query)
      .sort(sortQuery)
      .skip(skip)
      .limit(limit)
      .populate('createdBy', 'name email')
      .populate('assignedTo', 'name email')
      .lean();

    const total = await Lead.countDocuments(query);

    return { leads: leads as unknown as ILead[], total };
  }

  static async findForExport(filters: LeadFilterQuery, createdBy: string, role: string): Promise<ILead[]> {
    const query: any = {};

    // RBAC: Sales users export only their leads
    if (role === 'salesUser') {
      query.createdBy = new Types.ObjectId(createdBy);
    }

    // Apply status filter
    if (filters.status) {
      query.status = filters.status;
    }

    // Apply source filter
    if (filters.source) {
      query.source = filters.source;
    }

    // Apply search filter
    if (filters.search) {
      query.$or = [
        { name: { $regex: filters.search, $options: 'i' } },
        { email: { $regex: filters.search, $options: 'i' } },
      ];
    }

    // Apply sorting
    const sortQuery: any = {};
    if (filters.sort === 'latest') {
      sortQuery.createdAt = -1;
    } else if (filters.sort === 'oldest') {
      sortQuery.createdAt = 1;
    } else {
      sortQuery.createdAt = -1;
    }

    return Lead.find(query)
      .sort(sortQuery)
      .populate('createdBy', 'name email')
      .populate('assignedTo', 'name email')
      .lean() as any as ILead[];
  }

  static async updateById(id: string, updates: Partial<ILead>): Promise<ILead | null> {
    return Lead.findByIdAndUpdate(id, updates, { new: true, runValidators: true });
  }

  static async deleteById(id: string): Promise<void> {
    await Lead.findByIdAndDelete(id);
  }

  static async findByIdAndCreator(id: string, createdBy: string): Promise<ILead | null> {
    return Lead.findOne({ _id: id, createdBy });
  }
}
