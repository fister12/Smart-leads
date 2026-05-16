import { body, query, param } from 'express-validator';

export const createLeadValidators = [
  body('name')
    .trim()
    .isLength({ min: 2, max: 100 })
    .withMessage('Name must be between 2 and 100 characters')
    .matches(/^[a-zA-Z\s]+$/)
    .withMessage('Name must contain only letters and spaces'),
  body('email')
    .isEmail()
    .normalizeEmail()
    .withMessage('Enter a valid email address'),
  body('phone')
    .optional()
    .matches(/^\+91\d{10}$/)
    .withMessage('Phone must be in E.164 format (+91XXXXXXXXXX)'),
  body('source')
    .isIn(['website', 'instagram', 'referral'])
    .withMessage('Source must be website, instagram, or referral'),
  body('status')
    .optional()
    .isIn(['new', 'contacted', 'qualified', 'lost'])
    .withMessage('Status must be new, contacted, qualified, or lost'),
  body('notes')
    .optional()
    .isLength({ max: 500 })
    .withMessage('Notes must be at most 500 characters'),
  body('assignedTo')
    .optional()
    .isMongoId()
    .withMessage('Invalid assignedTo user ID'),
];

export const updateLeadValidators = [
  body('name')
    .optional()
    .trim()
    .isLength({ min: 2, max: 100 })
    .withMessage('Name must be between 2 and 100 characters')
    .matches(/^[a-zA-Z\s]+$/)
    .withMessage('Name must contain only letters and spaces'),
  body('email')
    .optional()
    .isEmail()
    .normalizeEmail()
    .withMessage('Enter a valid email address'),
  body('phone')
    .optional()
    .matches(/^\+91\d{10}$/)
    .withMessage('Phone must be in E.164 format (+91XXXXXXXXXX)'),
  body('source')
    .optional()
    .isIn(['website', 'instagram', 'referral'])
    .withMessage('Source must be website, instagram, or referral'),
  body('status')
    .optional()
    .isIn(['new', 'contacted', 'qualified', 'lost'])
    .withMessage('Status must be new, contacted, qualified, or lost'),
  body('notes')
    .optional()
    .isLength({ max: 500 })
    .withMessage('Notes must be at most 500 characters'),
  body('assignedTo')
    .optional()
    .isMongoId()
    .withMessage('Invalid assignedTo user ID'),
];

export const listLeadsValidators = [
  query('status')
    .optional()
    .isIn(['new', 'contacted', 'qualified', 'lost'])
    .withMessage('Invalid status filter'),
  query('source')
    .optional()
    .isIn(['website', 'instagram', 'referral'])
    .withMessage('Invalid source filter'),
  query('search')
    .optional()
    .isLength({ min: 1, max: 100 })
    .withMessage('Search must be between 1 and 100 characters'),
  query('sort')
    .optional()
    .isIn(['latest', 'oldest'])
    .withMessage('Sort must be latest or oldest'),
  query('page')
    .optional()
    .isInt({ min: 1 })
    .withMessage('Page must be a positive integer'),
  query('limit')
    .optional()
    .isInt({ min: 1, max: 100 })
    .withMessage('Limit must be between 1 and 100'),
];

export const getLeadValidators = [
  param('id')
    .isMongoId()
    .withMessage('Invalid lead ID'),
];

export const deleteLeadValidators = [
  param('id')
    .isMongoId()
    .withMessage('Invalid lead ID'),
];
