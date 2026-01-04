import { Response } from 'express';
import { pool } from '../config/db';
import { ResultSetHeader, RowDataPacket } from 'mysql2';
import { AuthRequest } from '../middleware/auth.middleware';

// Post a help request
export const createRequest = async (req: AuthRequest, res: Response) => {
    try {
        const { title, description, category, attachments } = req.body;
        const resident_id = req.user?.id;

        if (!resident_id || !title || !category) {
            return res.status(400).json({ message: 'Missing required fields' });
        }

        const [result] = await pool.execute<ResultSetHeader>(
            'INSERT INTO HelpRequests (resident_id, title, description, category, attachments, status) VALUES (?, ?, ?, ?, ?, ?)',
            [resident_id, title, description, category, attachments || null, 'Pending']
        );

        res.status(201).json({
            message: 'Request created successfully',
            requestId: result.insertId
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error during request creation' });
    }
};

// Get all pending requests (for Helpers to browse)
export const getAllRequests = async (req: AuthRequest, res: Response) => {
    try {
        const [rows] = await pool.execute(
            `SELECT hr.*, u.name as resident_name 
             FROM HelpRequests hr 
             JOIN Users u ON hr.resident_id = u.id 
             WHERE hr.status = 'Pending'
             ORDER BY hr.created_at DESC`
        );
        res.json(rows);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error fetching requests' });
    }
};

// Update request status
export const updateRequestStatus = async (req: AuthRequest, res: Response) => {
    try {
        const { id } = req.params;
        const { status } = req.body;
        const helper_id = req.user?.id;
        const userRole = req.user?.role;

        if (!status) {
            return res.status(400).json({ message: 'Status is required' });
        }

        if (userRole !== 'Helper') {
            return res.status(403).json({ message: 'Only helpers can update status' });
        }

        let query = '';
        let params: any[] = [];

        if (status === 'Accepted') {
            query = 'UPDATE HelpRequests SET status = ?, helper_id = ? WHERE id = ? AND status = ?';
            params = [status, helper_id, id, 'Pending'];
        } else {
            // For In-progress and Completed, ensure it's the assigned helper
            query = 'UPDATE HelpRequests SET status = ? WHERE id = ? AND helper_id = ?';
            params = [status, id, helper_id];
        }

        const [result] = await pool.execute<ResultSetHeader>(query, params);

        if (result.affectedRows === 0) {
            return res.status(404).json({ message: 'Request not found or unauthorized' });
        }

        res.json({ message: 'Request status updated' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error updating status' });
    }
};

// Get requests for a specific user (My Requests / My Tasks)
export const getMyRequests = async (req: AuthRequest, res: Response) => {
    try {
        const userId = req.user?.id;
        const role = req.user?.role;

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
        } else {
            query = `SELECT hr.*, u.name as resident_name 
                     FROM HelpRequests hr 
                     JOIN Users u ON hr.resident_id = u.id 
                     WHERE hr.helper_id = ? 
                     ORDER BY hr.created_at DESC`;
        }

        const [rows] = await pool.execute<RowDataPacket[]>(query, [userId]);
        res.json(rows);
    } catch (error) {
        console.error('getMyRequests ERROR:', error);
        res.status(500).json({ message: 'Server error fetching your requests' });
    }
}
// Get a single request by ID
export const getRequestById = async (req: AuthRequest, res: Response) => {
    try {
        const { id } = req.params;
        const userId = req.user?.id;
        const role = req.user?.role;

        const [rows] = await pool.execute<RowDataPacket[]>(
            `SELECT hr.*, u1.name as resident_name, u2.name as helper_name 
             FROM HelpRequests hr 
             JOIN Users u1 ON hr.resident_id = u1.id 
             LEFT JOIN Users u2 ON hr.helper_id = u2.id 
             WHERE hr.id = ?`,
            [id]
        );

        if (rows.length === 0) {
            return res.status(404).json({ message: 'Request not found' });
        }

        const request = rows[0];

        // Authorization check: only the resident who created it or the assigned helper (or any helper if it's pending?)
        // Actually, for community portal, maybe helpers can see details of pending ones too.
        if (role === 'Resident' && request.resident_id !== userId) {
            return res.status(403).json({ message: 'Unauthorized' });
        }

        res.json(request);
    } catch (error) {
        console.error('getRequestById ERROR:', error);
        res.status(500).json({ message: 'Server error fetching request details' });
    }
};
