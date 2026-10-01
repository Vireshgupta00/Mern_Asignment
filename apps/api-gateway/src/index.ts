import express from 'express';
import cors from 'cors';
import { createProxyMiddleware } from 'http-proxy-middleware';
import dotenv from 'dotenv';

dotenv.config();

const app = express();
app.use(cors());

const PORT = process.env.PORT || 4000;

// API Routes proxying to microservices
app.use('/api/auth', createProxyMiddleware({ target: process.env.AUTH_SERVICE_URL || 'http://localhost:4001', changeOrigin: true }));
app.use('/api/ai', createProxyMiddleware({ target: process.env.AI_SERVICE_URL || 'http://localhost:4002', changeOrigin: true }));
app.use('/api/resume', createProxyMiddleware({ target: process.env.RESUME_SERVICE_URL || 'http://localhost:4003', changeOrigin: true }));
app.use('/api/bookings', createProxyMiddleware({ target: process.env.BOOKING_SERVICE_URL || 'http://localhost:4004', changeOrigin: true }));

app.get('/health', (req, res) => res.send({ status: 'API Gateway is running 🚀' }));

app.listen(PORT, () => {
  console.log(`🚀 API Gateway listening on port ${PORT}`);
});
