import express from 'express';
import dotenv from 'dotenv';
import { connectDB } from '@career-platform/shared';

dotenv.config();

const app = express();
// Note: Webhook routes might need raw body parsing for Stripe
import bookingRoutes from './routes/booking.routes';
import { stripeWebhook } from './webhooks/stripe.webhook';

const PORT = process.env.PORT || 4004;
const MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:27017/career_platform_booking';

// Webhook requires raw body parsing, MUST be before app.use(express.json())
app.post('/api/bookings/webhook', express.raw({ type: 'application/json' }), stripeWebhook);

app.use(express.json());
app.use('/api/bookings', bookingRoutes);

app.get('/health', (req, res) => res.send({ status: 'Booking Service is running' }));

const start = async () => {
  await connectDB(MONGO_URI);
  app.listen(PORT, () => {
    console.log(`📅 Booking Service listening on port ${PORT}`);
  });
};

start();
