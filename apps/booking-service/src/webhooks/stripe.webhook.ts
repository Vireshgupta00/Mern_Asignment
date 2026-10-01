import { Request, Response } from 'express';
import Stripe from 'stripe';
import { Booking } from '../models/Booking';
import { Consultant } from '../models/Consultant';
import { createCalendarEvent } from '../services/calendar.service';
import { sendConfirmationEmail } from '../services/email.service';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || 'sk_test_mock', { apiVersion: '2024-04-10' as any });

export const handleStripeWebhook = async (req: Request, res: Response) => {
  const sig = req.headers['stripe-signature'] as string;
  let event;

  try {
    event = stripe.webhooks.constructEvent(req.body, sig, process.env.STRIPE_WEBHOOK_SECRET || 'whsec_mock');
  } catch (err: any) {
    return res.status(400).send(`Webhook Error: ${err.message}`);
  }

  // Handle successful payment completion
  if (event.type === 'checkout.session.completed') {
    const session = event.data.object as any;
    const bookingId = session.metadata.bookingId;

    const booking: any = await Booking.findById(bookingId);
    if (!booking) return res.status(404).json({ error: 'Booking not found' });

    if (booking.status === 'CONFIRMED') return res.json({ received: true, message: 'Already processed' });

    try {
      // Section 14: Enforce strict State Machine transitions
      await booking.transitionState('PAID');
      await booking.transitionState('CONFIRMED');
    } catch (transitionError: any) {
      console.error('[State Machine Error]', transitionError.message);
      return res.status(400).json({ error: transitionError.message });
    }

    let meetingUrl = 'Pending Google Credentials';
    
    // Calendar Integration
    try {
      const startTime = new Date(booking.date);
      const endTime = new Date(startTime.getTime() + 60 * 60 * 1000); 

      const calResult = await createCalendarEvent({
        _id: booking._id.toString(),
        name: booking.name,
        email: booking.email,
        agenda: booking.agenda || 'Career Consultation',
        startTime: startTime.toISOString(),
        endTime: endTime.toISOString()
      });

      booking.calendarEventId = calResult.eventId;
      booking.meetingUrl = calResult.meetingUrl;
      meetingUrl = calResult.meetingUrl;
      await booking.save();
    } catch (calendarError) {
      console.error('[Webhook Critical] Calendar integration failed:', calendarError);
    }

    // Email Integration
    try {
      const consultant: any = await Consultant.findById(booking.consultantId);
      const consultantName = consultant ? consultant.name : 'Career Expert';
      
      await sendConfirmationEmail(booking, consultantName, meetingUrl);
      console.log('[Webhook] Confirmation email dispatched successfully.');
    } catch (emailError) {
      console.error('[Webhook Critical] Email notification failed:', emailError);
    }
  }

  // Handle Failed or Expired Payments (Triggering PAYMENT_FAILED State)
  if (event.type === 'checkout.session.expired' || event.type === 'checkout.session.async_payment_failed') {
    const session = event.data.object as any;
    const bookingId = session.metadata.bookingId;
    const booking: any = await Booking.findById(bookingId);
    
    if (booking) {
      try {
        await booking.transitionState('PAYMENT_FAILED');
        console.log(`[Webhook] Booking ${bookingId} transitioned to PAYMENT_FAILED`);
      } catch (transitionError) {
        console.error('[State Machine Error]', transitionError);
      }
    }
  }

  res.json({ received: true });
};
