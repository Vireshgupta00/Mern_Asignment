import rateLimit from 'express-rate-limit';
import express from 'express';
import dotenv from 'dotenv';
import { connectDB } from '@career-platform/shared';

dotenv.config();

const app = express();
app.use(express.json());

import chatRoutes from './routes/chat.routes';

const PORT = process.env.PORT || 4002;
const MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:27017/career_platform_ai';

const limiter = rateLimit({ windowMs: 15 * 60 * 1000, max: 100 });
app.use('/api/ai', limiter, chatRoutes);

app.get('/health', (req, res) => res.send({ status: 'AI Service is running' }));

const start = async () => {
  await connectDB(MONGO_URI);
  app.listen(PORT, () => {
    console.log(`🤖 AI Service listening on port ${PORT}`);
  });
};

start();
