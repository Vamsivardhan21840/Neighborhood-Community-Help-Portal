import { Router } from 'express';
import { createRequest, getAllRequests, updateRequestStatus, getMyRequests, getRequestById } from '../controllers/request.controller';
import { createRequestValidation, updateStatusValidation, validateRequest } from '../middleware/validation';

import { authenticate } from '../middleware/auth.middleware';

const router = Router();

// All request routes require authentication
router.use(authenticate);

router.post('/', createRequestValidation, validateRequest, createRequest); // Residents post
router.get('/', getAllRequests); // Helpers view all pending
router.get('/my', getMyRequests); // Residents/Helpers view their own
router.patch('/:id/status', updateStatusValidation, validateRequest, updateRequestStatus); // Helpers update status
router.get('/:id', getRequestById); // Get details

export default router;
