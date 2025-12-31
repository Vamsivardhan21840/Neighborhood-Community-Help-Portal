"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getMyRequests = exports.updateRequestStatus = exports.getAllRequests = exports.createRequest = void 0;
const db_1 = require("../config/db");
// Post a help request
const createRequest = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    try {
        const { title, description, category, attachments } = req.body;
        const resident_id = (_a = req.user) === null || _a === void 0 ? void 0 : _a.id;
        if (!resident_id || !title || !category) {
            return res.status(400).json({ message: 'Missing required fields' });
        }
        const [result] = yield db_1.pool.execute('INSERT INTO HelpRequests (resident_id, title, description, category, attachments, status) VALUES (?, ?, ?, ?, ?, ?)', [resident_id, title, description, category, attachments || null, 'Pending']);
        res.status(201).json({
            message: 'Request created successfully',
            requestId: result.insertId
        });
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error during request creation' });
    }
});
exports.createRequest = createRequest;
// Get all pending requests (for Helpers to browse)
const getAllRequests = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const [rows] = yield db_1.pool.execute(`SELECT hr.*, u.name as resident_name 
             FROM HelpRequests hr 
             JOIN Users u ON hr.resident_id = u.id 
             WHERE hr.status = 'Pending'
             ORDER BY hr.created_at DESC`);
        res.json(rows);
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error fetching requests' });
    }
});
exports.getAllRequests = getAllRequests;
// Update request status
const updateRequestStatus = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a, _b;
    try {
        const { id } = req.params;
        const { status } = req.body;
        const helper_id = (_a = req.user) === null || _a === void 0 ? void 0 : _a.id;
        const userRole = (_b = req.user) === null || _b === void 0 ? void 0 : _b.role;
        if (!status) {
            return res.status(400).json({ message: 'Status is required' });
        }
        if (userRole !== 'Helper') {
            return res.status(403).json({ message: 'Only helpers can update status' });
        }
        let query = '';
        let params = [];
        if (status === 'Accepted') {
            query = 'UPDATE HelpRequests SET status = ?, helper_id = ? WHERE id = ? AND status = ?';
            params = [status, helper_id, id, 'Pending'];
        }
        else {
            // For In-progress and Completed, ensure it's the assigned helper
            query = 'UPDATE HelpRequests SET status = ? WHERE id = ? AND helper_id = ?';
            params = [status, id, helper_id];
        }
        const [result] = yield db_1.pool.execute(query, params);
        if (result.affectedRows === 0) {
            return res.status(404).json({ message: 'Request not found or unauthorized' });
        }
        res.json({ message: 'Request status updated' });
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error updating status' });
    }
});
exports.updateRequestStatus = updateRequestStatus;
// Get requests for a specific user (My Requests / My Tasks)
const getMyRequests = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a, _b;
    try {
        const userId = (_a = req.user) === null || _a === void 0 ? void 0 : _a.id;
        const role = (_b = req.user) === null || _b === void 0 ? void 0 : _b.role;
        if (!userId) {
            return res.status(401).json({ message: 'Unauthorized' });
        }
        let query = '';
        if (role === 'Resident') {
            query = `SELECT hr.*, u.name as helper_name 
                     FROM HelpRequests hr 
                     LEFT JOIN Users u ON hr.helper_id = u.id 
                     WHERE hr.resident_id = ? 
                     ORDER BY hr.created_at DESC`;
        }
        else {
            query = `SELECT hr.*, u.name as resident_name 
                     FROM HelpRequests hr 
                     JOIN Users u ON hr.resident_id = u.id 
                     WHERE hr.helper_id = ? 
                     ORDER BY hr.created_at DESC`;
        }
        const [rows] = yield db_1.pool.execute(query, [userId]);
        res.json(rows);
    }
    catch (error) {
        console.error('getMyRequests ERROR:', error);
        res.status(500).json({ message: 'Server error fetching your requests' });
    }
});
exports.getMyRequests = getMyRequests;
