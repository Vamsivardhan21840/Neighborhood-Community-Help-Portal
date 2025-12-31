import { Request, Response } from 'express';
import { pool } from '../config/db';
import { ResultSetHeader, RowDataPacket } from 'mysql2';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'fallback_secret';

export const register = async (req: Request, res: Response) => {
    try {
        const { name, email, password, contact_info, location, role } = req.body;

        if (!name || !email || !password || !contact_info || !role) {
            return res.status(400).json({ message: 'Missing required fields' });
        }

        const [existing] = await pool.execute<RowDataPacket[]>(
            'SELECT id FROM Users WHERE email = ?',
            [email]
        );

        if (existing.length > 0) {
            return res.status(409).json({ message: 'User with this email already exists' });
        }

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        const [result] = await pool.execute<ResultSetHeader>(
            'INSERT INTO Users (name, email, password, contact_info, location, role) VALUES (?, ?, ?, ?, ?, ?)',
            [name, email, hashedPassword, contact_info, location, role]
        );

        const user = { id: result.insertId, name, email, role };
        const token = jwt.sign(user, JWT_SECRET, { expiresIn: '24h' });

        res.status(201).json({
            message: 'User registered successfully',
            user,
            token
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error during registration' });
    }
};

export const login = async (req: Request, res: Response) => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({ message: 'Email and password are required' });
        }

        const [rows] = await pool.execute<RowDataPacket[]>(
            'SELECT * FROM Users WHERE email = ?',
            [email]
        );

        if (rows.length === 0) {
            return res.status(401).json({ message: 'Invalid credentials' });
        }

        const user = rows[0];
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(401).json({ message: 'Invalid credentials' });
        }

        delete user.password;

        const token = jwt.sign({ id: user.id, name: user.name, role: user.role }, JWT_SECRET, { expiresIn: '24h' });

        res.json({ message: 'Login successful', user, token });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error during login' });
    }
};

export const updateProfile = async (req: Request, res: Response) => {
    try {
        const { contact_info, location } = req.body;
        const id = (req as any).user?.id;

        if (!id) {
            return res.status(401).json({ message: 'Unauthorized' });
        }

        const [result] = await pool.execute<ResultSetHeader>(
            'UPDATE Users SET contact_info = ?, location = ? WHERE id = ?',
            [contact_info, location, id]
        );

        if (result.affectedRows === 0) {
            return res.status(404).json({ message: 'User not found' });
        }

        const [rows] = await pool.execute<RowDataPacket[]>(
            'SELECT id, name, email, contact_info, location, role FROM Users WHERE id = ?',
            [id]
        );

        res.json({ message: 'Profile updated successfully', user: rows[0] });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error during profile update' });
    }
};
