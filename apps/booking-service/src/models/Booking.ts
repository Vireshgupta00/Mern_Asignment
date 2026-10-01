import mongoose from 'mongoose';

// Section 14: Define the strict business rules for state transitions
const validTransitions: Record<string, string[]> = {
  PENDING_PAYMENT: ['PAID', 'PAYMENT_FAILED', 'CANCELLED'],
  PAYMENT_FAILED: ['PENDING_PAYMENT', 'CANCELLED'],
  PAID: ['CONFIRMED', 'CANCELLED'],
  CONFIRMED: ['COMPLETED', 'CANCELLED'],
  CANCELLED: [],
  COMPLETED: []
};

const bookingSchema = new mongoose.Schema({
  consultantId: { type: mongoose.Schema.Types.ObjectId, ref: 'Consultant' },
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  date: { type: String, required: true },
  timeSlot: { type: String, required: true },
  name: { type: String, required: true },
  email: { type: String, required: true },
  phone: { type: String, required: true },
  agenda: { type: String },
  calendarEventId: { type: String },
  meetingUrl: { type: String },
  status: { 
    type: String, 
    // Enforcing strict Database-level Enum
    enum: ['PENDING_PAYMENT', 'PAYMENT_FAILED', 'PAID', 'CONFIRMED', 'CANCELLED', 'COMPLETED'],
    default: 'PENDING_PAYMENT' 
  }
}, { timestamps: true });

// Section 14: Method to enforce strict state machine transitions and prevent invalid paths
bookingSchema.methods.transitionState = async function (newStatus: string) {
  const allowedNextStates = validTransitions[this.status];
  
  if (!allowedNextStates || !allowedNextStates.includes(newStatus)) {
    throw new Error(`Invalid state transition: Cannot move from ${this.status} to ${newStatus}`);
  }
  
  this.status = newStatus;
  await this.save();
  return this;
};

export const Booking = mongoose.model('Booking', bookingSchema);
