import { Router } from 'express';
import { register, login, updateProfile } from '../controllers/auth.controller';
import { registerValidation, loginValidation, updateProfileValidation, validateRequest } from '../middleware/validation';

import { authenticate } from '../middleware/auth.middleware';

const router = Router();

router.post('/register', registerValidation, validateRequest, register);
router.post('/login', loginValidation, validateRequest, login);
router.put('/profile', authenticate, updateProfileValidation, validateRequest, updateProfile);

export default router;
