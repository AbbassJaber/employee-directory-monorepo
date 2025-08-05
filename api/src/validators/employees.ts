import { body, param, query } from 'express-validator';
import { validateRequest } from '@/utils/validation';

const e164Regex = /^\+[1-9]\d{1,14}$/;

export const createEmployeeValidation = [
    body('email')
        .isEmail()
        .withMessage('Please provide a valid email address')
        .normalizeEmail(),
    body('password')
        .isLength({ min: 6 })
        .withMessage('Password must be at least 6 characters long'),
    body('firstName')
        .trim()
        .isLength({ min: 1, max: 50 })
        .withMessage('First name must be between 1 and 50 characters'),
    body('lastName')
        .trim()
        .isLength({ min: 1, max: 50 })
        .withMessage('Last name must be between 1 and 50 characters'),
    body('phone')
        .notEmpty()
        .withMessage('Phone number is required')
        .matches(e164Regex)
        .withMessage(
            'Phone number must be in E.164 format (e.g., +96170123456)'
        ),
    body('hireDate')
        .isISO8601()
        .withMessage('Please provide a valid hire date'),
    body('departmentId')
        .optional()
        .isInt({ min: 1 })
        .withMessage('Department ID must be a positive integer'),
    body('locationId')
        .optional()
        .isInt({ min: 1 })
        .withMessage('Location ID must be a positive integer'),
    body('reportsToId')
        .optional()
        .isInt({ min: 1 })
        .withMessage('Reports to ID must be a positive integer'),
    validateRequest,
];

export const updateEmployeeValidation = [
    param('id')
        .isInt({ min: 1 })
        .withMessage('Employee ID must be a positive integer'),
    body('firstName')
        .optional()
        .trim()
        .isLength({ min: 1, max: 50 })
        .withMessage('First name must be between 1 and 50 characters'),
    body('lastName')
        .optional()
        .trim()
        .isLength({ min: 1, max: 50 })
        .withMessage('Last name must be between 1 and 50 characters'),
    body('phone')
        .optional()
        .isMobilePhone('any')
        .withMessage('Please provide a valid phone number'),
    body('isActive')
        .optional()
        .isBoolean()
        .withMessage('isActive must be a boolean'),
    body('departmentId')
        .optional()
        .isInt({ min: 1 })
        .withMessage('Department ID must be a positive integer'),
    body('locationId')
        .optional()
        .isInt({ min: 1 })
        .withMessage('Location ID must be a positive integer'),
    body('reportsToId')
        .optional()
        .isInt({ min: 1 })
        .withMessage('Reports to ID must be a positive integer'),
    validateRequest,
];

export const getEmployeeValidation = [
    param('id')
        .isInt({ min: 1 })
        .withMessage('Employee ID must be a positive integer'),
    validateRequest,
];

export const listEmployeesValidation = [
    query('page')
        .optional()
        .isInt({ min: 1 })
        .withMessage('Page must be a positive integer'),
    query('limit')
        .optional()
        .isInt({ min: 1, max: 100 })
        .withMessage('Limit must be between 1 and 100'),
    query('search')
        .optional()
        .isString()
        .isLength({ max: 100 })
        .withMessage('Search term must be less than 100 characters'),
    query('departmentId')
        .optional()
        .isInt({ min: 1 })
        .withMessage('Department ID must be a positive integer'),
    query('locationId')
        .optional()
        .isInt({ min: 1 })
        .withMessage('Location ID must be a positive integer'),
    query('reportsToId')
        .optional()
        .isInt({ min: 1 })
        .withMessage('Reports to ID must be a positive integer'),
    query('sortField')
        .optional()
        .isString()
        .isIn([
            'firstName',
            'lastName',
            'email',
            'position',
            'department.name',
            'location.name',
            'reportsTo.firstName',
        ])
        .withMessage('Invalid sort field'),
    query('sortOrder')
        .optional()
        .isString()
        .isIn(['asc', 'desc'])
        .withMessage('Sort order must be asc or desc'),
    validateRequest,
];
