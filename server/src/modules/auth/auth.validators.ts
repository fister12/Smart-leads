import { body } from 'express-validator';

export const registerValidators = [
  body('name')
    .trim()
    .isLength({ min: 2, max: 80 })
    .withMessage('Name must be between 2 and 80 characters'),
  body('email')
    .isEmail()
    .normalizeEmail()
    .withMessage('Enter a valid email address'),
  body('password')
    .isLength({ min: 6 })
    .withMessage('Password must be at least 6 characters'),
  body('role')
    .optional()
    .isIn(['admin', 'salesUser'])
    .withMessage('Role must be either admin or salesUser'),
];

export const loginValidators = [
  body('email')
    .isEmail()
    .normalizeEmail()
    .withMessage('Enter a valid email address'),
  body('password')
    .notEmpty()
    .withMessage('Password is required'),
];
