import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { checkDatabaseConnection } from './config/db';
import authRoutes from './routes/auth.routes';
import requestRoutes from './routes/requests.routes';
import { errorHandler } from './middleware/error';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ limit: '50mb', extended: true }));

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/requests', requestRoutes);

// Health Check
app.get('/', (req, res) => {
    res.send('Neighborhood Community API is running');
});

// Error Handling
app.use(errorHandler);

// Start Server
app.listen(PORT, async () => {
    console.log(`🚀 Server running on port ${PORT}`);
    await checkDatabaseConnection();
});
