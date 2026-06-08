import express, { Request, Response } from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import path from 'path';
import { apiRouter, rateLimiter, securityHeaders } from './api';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Enable CORS
app.use(cors({
  origin: ['http://localhost:3000', 'http://127.0.0.1:3000'],
  credentials: true
}));

// Express built-in parser for body payloads (JSON and urlencoded)
// Size limit is set to 10mb to safely allow base64 image uploads in media manager
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ limit: '10mb', extended: true }));

// Apply Security and Rate-Limiting rules
app.use(securityHeaders);
app.use(rateLimiter);

// Serve uploads statically
app.use('/uploads', express.static(path.join(__dirname, '../public/uploads')));

// Register versioned API router
app.use('/api/v1', apiRouter);

// Health check
app.get('/api/health', (req: Request, res: Response) => {
  res.json({ status: 'ok', message: 'Backend server is running!' });
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
