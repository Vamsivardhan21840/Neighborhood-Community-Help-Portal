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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateProfile = exports.login = exports.register = void 0;
const db_1 = require("../config/db");
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const JWT_SECRET = process.env.JWT_SECRET || 'fallback_secret';
const register = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { name, email, password, contact_info, location, role } = req.body;
        if (!name || !email || !password || !contact_info || !role) {
            return res.status(400).json({ message: 'Missing required fields' });
        }
        const [existing] = yield db_1.pool.execute('SELECT id FROM Users WHERE email = ?', [email]);
        if (existing.length > 0) {
            return res.status(409).json({ message: 'User with this email already exists' });
        }
        const salt = yield bcryptjs_1.default.genSalt(10);
        const hashedPassword = yield bcryptjs_1.default.hash(password, salt);
        const [result] = yield db_1.pool.execute('INSERT INTO Users (name, email, password, contact_info, location, role) VALUES (?, ?, ?, ?, ?, ?)', [name, email, hashedPassword, contact_info, location, role]);
        const user = { id: result.insertId, name, email, role };
        const token = jsonwebtoken_1.default.sign(user, JWT_SECRET, { expiresIn: '24h' });
        res.status(201).json({
            message: 'User registered successfully',
            user,
            token
        });
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error during registration' });
    }
});
exports.register = register;
const login = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { email, password } = req.body;
        if (!email || !password) {
            return res.status(400).json({ message: 'Email and password are required' });
        }
        const [rows] = yield db_1.pool.execute('SELECT * FROM Users WHERE email = ?', [email]);
        if (rows.length === 0) {
            return res.status(401).json({ message: 'Invalid credentials' });
        }
        const user = rows[0];
        const isMatch = yield bcryptjs_1.default.compare(password, user.password);
        if (!isMatch) {
            return res.status(401).json({ message: 'Invalid credentials' });
        }
        delete user.password;
        const token = jsonwebtoken_1.default.sign({ id: user.id, name: user.name, role: user.role }, JWT_SECRET, { expiresIn: '24h' });
        res.json({ message: 'Login successful', user, token });
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error during login' });
    }
});
exports.login = login;
const updateProfile = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    try {
        const { contact_info, location } = req.body;
        const id = (_a = req.user) === null || _a === void 0 ? void 0 : _a.id;
        if (!id) {
            return res.status(401).json({ message: 'Unauthorized' });
        }
        const [result] = yield db_1.pool.execute('UPDATE Users SET contact_info = ?, location = ? WHERE id = ?', [contact_info, location, id]);
        if (result.affectedRows === 0) {
            return res.status(404).json({ message: 'User not found' });
        }
        const [rows] = yield db_1.pool.execute('SELECT id, name, email, contact_info, location, role FROM Users WHERE id = ?', [id]);
        res.json({ message: 'Profile updated successfully', user: rows[0] });
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error during profile update' });
    }
});
exports.updateProfile = updateProfile;
