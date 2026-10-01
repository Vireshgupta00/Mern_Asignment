import express from 'express';
import dotenv from 'dotenv';
import { connectDB } from '@career-platform/shared';

dotenv.config();

const app = express();
app.use(express.json());

import resumeRoutes from './routes/resume.routes';

const PORT = process.env.PORT || 4003;
const MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:27017/career_platform_resume';

app.use('/api/resume', resumeRoutes);

app.get('/health', (req, res) => res.send({ status: 'Resume Service is running' }));

const start = async () => {
  await connectDB(MONGO_URI);
  app.listen(PORT, () => {
    console.log(`📄 Resume Service listening on port ${PORT}`);
  });
};

start();
