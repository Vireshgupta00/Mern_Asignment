import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { connectDB } from '@career-platform/shared';

dotenv.config();

const app = express();
app.use(express.json());
app.use(cors());

import authRoutes from './routes/auth.routes';

const PORT = process.env.PORT || 4001;
const MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:27017/career_platform_auth';

app.use('/api/auth', authRoutes);

app.get('/health', (req, res) => res.send({ status: 'Auth service is running' }));

const start = async () => {
  await connectDB(MONGO_URI);
  app.listen(PORT, () => {
    console.log(`🔒 Auth service listening on port ${PORT}`);
  });
};

start();
