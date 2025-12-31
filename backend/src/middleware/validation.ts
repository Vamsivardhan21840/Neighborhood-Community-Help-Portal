import { body, validationResult } from 'express-validator';
import { Request, Response, NextFunction } from 'express';

export const validateRequest = (req: Request, res: Response, next: NextFunction) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }
    next();
};

export const registerValidation = [
    body('name').trim().notEmpty().withMessage('Name is required'),
    body('email').isEmail().withMessage('Valid email is required'),
    body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters long'),
    body('contact_info').notEmpty().withMessage('Contact info is required'),
    body('location').notEmpty().withMessage('Location is required'),
    body('role').isIn(['Resident', 'Helper']).withMessage('Role must be Resident or Helper'),
];

export const loginValidation = [
    body('email').isEmail().withMessage('Valid email is required'),
    body('password').notEmpty().withMessage('Password is required'),
];

export const updateProfileValidation = [
    body('contact_info').notEmpty().withMessage('Contact info is required'),
    body('location').notEmpty().withMessage('Location is required'),
];

export const createRequestValidation = [
    body('title').trim().notEmpty().withMessage('Title is required'),
    body('category').trim().notEmpty().withMessage('Category is required'),
];

export const updateStatusValidation = [
    body('status').isIn(['Pending', 'Accepted', 'In-progress', 'Completed']).withMessage('Invalid status'),
];
