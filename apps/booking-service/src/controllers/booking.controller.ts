import { Response } from 'express';
import { AuthRequest } from '@career-platform/shared';
import Stripe from 'stripe';
import Booking from '../models/Booking';
import Consultant from '../models/Consultant';

// @ts-ignore - Mocking version type mismatch for this test environment
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || 'sk_test_dummy', { apiVersion: '2023-10-16' });

export const getConsultants = async (req: AuthRequest, res: Response) => {
  try {
    const consultants = await Consultant.find();
    res.json(consultants);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};

export const createBooking = async (req: AuthRequest, res: Response) => {
  try {
    const { consultantId, date, timeSlot, name, email, phone, agenda } = req.body;
    if (new Date(date) < new Date(new Date().setHours(0,0,0,0))) return res.status(400).json({ error: 'Cannot book in the past' });
    
    const existing = await Booking.findOne({ consultantId, date, timeSlot, status: { $ne: 'CANCELLED' } });
    if (existing) {
      return res.status(409).json({ error: 'This time slot is already booked.' });
    }

    const consultant = await Consultant.findById(consultantId);
    if (!consultant) return res.status(404).json({ error: 'Consultant not found.' });

    const booking = new Booking({
      userId: req.user?.id,
      consultantId,
      date,
      timeSlot,
      status: 'PENDING_PAYMENT',
      name, email, phone, agenda
    });

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: [{
        price_data: {
          currency: 'usd',
          product_data: { name: `Consultation with ${consultant.name}` },
          unit_amount: consultant.hourlyRate * 100,
        },
        quantity: 1,
      }],
      mode: 'payment',
      success_url: `${process.env.FRONTEND_URL || 'http://localhost:3000'}/consultations/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${process.env.FRONTEND_URL || 'http://localhost:3000'}/consultations/cancel`,
      metadata: { bookingId: booking._id.toString() }
    });

    booking.stripeSessionId = session.id;
    await booking.save();

    res.status(201).json({ booking, checkoutUrl: session.url });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};
