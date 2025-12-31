"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateStatusValidation = exports.createRequestValidation = exports.updateProfileValidation = exports.loginValidation = exports.registerValidation = exports.validateRequest = void 0;
const express_validator_1 = require("express-validator");
const validateRequest = (req, res, next) => {
    const errors = (0, express_validator_1.validationResult)(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }
    next();
};
exports.validateRequest = validateRequest;
exports.registerValidation = [
    (0, express_validator_1.body)('name').trim().notEmpty().withMessage('Name is required'),
    (0, express_validator_1.body)('email').isEmail().withMessage('Valid email is required'),
    (0, express_validator_1.body)('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters long'),
    (0, express_validator_1.body)('contact_info').notEmpty().withMessage('Contact info is required'),
    (0, express_validator_1.body)('location').notEmpty().withMessage('Location is required'),
    (0, express_validator_1.body)('role').isIn(['Resident', 'Helper']).withMessage('Role must be Resident or Helper'),
];
exports.loginValidation = [
    (0, express_validator_1.body)('email').isEmail().withMessage('Valid email is required'),
    (0, express_validator_1.body)('password').notEmpty().withMessage('Password is required'),
];
exports.updateProfileValidation = [
    (0, express_validator_1.body)('contact_info').notEmpty().withMessage('Contact info is required'),
    (0, express_validator_1.body)('location').notEmpty().withMessage('Location is required'),
];
exports.createRequestValidation = [
    (0, express_validator_1.body)('title').trim().notEmpty().withMessage('Title is required'),
    (0, express_validator_1.body)('category').trim().notEmpty().withMessage('Category is required'),
];
exports.updateStatusValidation = [
    (0, express_validator_1.body)('status').isIn(['Pending', 'Accepted', 'In-progress', 'Completed']).withMessage('Invalid status'),
];
