import { body } from 'express-validator';
import { validateRequest } from '@/utils/validation';

export const loginValidation = [
    body('email')
        .isEmail()
        .withMessage('Please provide a valid email address')
        .normalizeEmail(),
    body('password')
        .isLength({ min: 6 })
        .withMessage('Password must be at least 6 characters long'),
    validateRequest,
];
