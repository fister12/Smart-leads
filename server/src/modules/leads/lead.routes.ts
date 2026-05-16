import { Router } from 'express';
import { LeadController } from './lead.controller.js';
import {
  createLeadValidators,
  updateLeadValidators,
  listLeadsValidators,
  getLeadValidators,
  deleteLeadValidators,
} from './lead.validators.js';
import { validateMiddleware } from '../../middleware/validate.middleware.js';
import { authMiddleware } from '../../middleware/auth.middleware.js';

const router = Router({ mergeParams: true });

router.use(authMiddleware);

router.post('/', createLeadValidators, validateMiddleware, LeadController.createLead);
router.get('/', listLeadsValidators, validateMiddleware, LeadController.listLeads);
router.get('/export/csv', validateMiddleware, LeadController.exportLeads);
router.get('/:id', getLeadValidators, validateMiddleware, LeadController.getLead);
router.put('/:id', updateLeadValidators, validateMiddleware, LeadController.updateLead);
router.delete('/:id', deleteLeadValidators, validateMiddleware, LeadController.deleteLead);

export default router;
