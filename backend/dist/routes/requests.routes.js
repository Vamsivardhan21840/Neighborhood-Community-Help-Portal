"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const request_controller_1 = require("../controllers/request.controller");
const validation_1 = require("../middleware/validation");
const auth_middleware_1 = require("../middleware/auth.middleware");
const router = (0, express_1.Router)();
// All request routes require authentication
router.use(auth_middleware_1.authenticate);
router.post('/', validation_1.createRequestValidation, validation_1.validateRequest, request_controller_1.createRequest); // Residents post
router.get('/', request_controller_1.getAllRequests); // Helpers view all pending
router.get('/my', request_controller_1.getMyRequests); // Residents/Helpers view their own
router.patch('/:id/status', validation_1.updateStatusValidation, validation_1.validateRequest, request_controller_1.updateRequestStatus); // Helpers update status
exports.default = router;
