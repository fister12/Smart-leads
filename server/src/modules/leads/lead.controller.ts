import { Request, Response } from 'express';
import { LeadService } from './lead.service.js';
import { asyncHandler } from '../../utils/asyncHandler.js';
import { apiResponse } from '../../utils/apiResponse.js';
import { csvExporter } from '../../utils/csvExporter.js';
import { LeadFilterQuery } from '../../types/lead.types.js';
import { UserRole } from '../../types/user.types.js';

export class LeadController {
  static createLead = asyncHandler(async (req: Request, res: Response): Promise<void> => {
    if (!req.user) {
      res.status(401).json(apiResponse.error('User not authenticated'));
      return;
    }

    const lead = await LeadService.createLead(req.body, req.user.userId);
    res.status(201).json(apiResponse.success(lead));
  });

  static getLead = asyncHandler(async (req: Request, res: Response): Promise<void> => {
    if (!req.user) {
      res.status(401).json(apiResponse.error('User not authenticated'));
      return;
    }

    const lead = await LeadService.getLead(req.params.id, req.user.userId, req.user.role as UserRole);
    res.status(200).json(apiResponse.success(lead));
  });

  static listLeads = asyncHandler(async (req: Request, res: Response): Promise<void> => {
    if (!req.user) {
      res.status(401).json(apiResponse.error('User not authenticated'));
      return;
    }

    const filters: LeadFilterQuery = {
      status: req.query.status as any,
      source: req.query.source as any,
      search: req.query.search as string,
      sort: req.query.sort as any,
      page: req.query.page ? parseInt(req.query.page as string, 10) : 1,
      limit: req.query.limit ? parseInt(req.query.limit as string, 10) : 10,
    };

    const result = await LeadService.listLeads(filters, req.user.userId, req.user.role as UserRole);
    res.status(200).json(apiResponse.paginated(result.leads, result.pagination.total, result.pagination.page, result.pagination.limit));
  });

  static exportLeads = asyncHandler(async (req: Request, res: Response): Promise<void> => {
    if (!req.user) {
      res.status(401).json(apiResponse.error('User not authenticated'));
      return;
    }

    const filters: LeadFilterQuery = {
      status: req.query.status as any,
      source: req.query.source as any,
      search: req.query.search as string,
      sort: req.query.sort as any,
    };

    const leads = await LeadService.getLeadsForExport(filters, req.user.userId, req.user.role as UserRole);
    csvExporter.exportLeads(leads, res);
  });

  static updateLead = asyncHandler(async (req: Request, res: Response): Promise<void> => {
    if (!req.user) {
      res.status(401).json(apiResponse.error('User not authenticated'));
      return;
    }

    const lead = await LeadService.updateLead(req.params.id, req.body, req.user.userId, req.user.role as UserRole);
    res.status(200).json(apiResponse.success(lead));
  });

  static deleteLead = asyncHandler(async (req: Request, res: Response): Promise<void> => {
    if (!req.user) {
      res.status(401).json(apiResponse.error('User not authenticated'));
      return;
    }

    await LeadService.deleteLead(req.params.id, req.user.userId, req.user.role as UserRole);
    res.status(204).send();
  });
}
