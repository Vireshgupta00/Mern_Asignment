const fs = require('fs');

// 1. Update Booking Schema to include Section 10 required fields
let bookingSchema = fs.readFileSync('./apps/booking-service/src/models/Booking.ts', 'utf8');
if (!bookingSchema.includes('agenda')) {
  bookingSchema = bookingSchema.replace(
    "timeSlot: { type: String, required: true },", 
    "timeSlot: { type: String, required: true },\n  name: { type: String, required: true },\n  email: { type: String, required: true },\n  phone: { type: String, required: true },\n  agenda: { type: String },\n"
  );
  fs.writeFileSync('./apps/booking-service/src/models/Booking.ts', bookingSchema);
}

// 2. Update Booking Controller to accept and save the new fields
let bookingCtrl = fs.readFileSync('./apps/booking-service/src/controllers/booking.controller.ts', 'utf8');
if (!bookingCtrl.includes('agenda')) {
  bookingCtrl = bookingCtrl.replace(
    "const { consultantId, date, timeSlot } = req.body;", 
    "const { consultantId, date, timeSlot, name, email, phone, agenda } = req.body;"
  );
  
  // Try to find the Booking.create call and inject the fields
  if (bookingCtrl.includes('userId: req.user.userId,')) {
    bookingCtrl = bookingCtrl.replace(
      "userId: req.user.userId,", 
      "userId: req.user.userId,\n      name, email, phone, agenda,"
    );
  } else if (bookingCtrl.includes('userId: req.user.userId }')) { // Alternative formatting
     bookingCtrl = bookingCtrl.replace(
      "userId: req.user.userId }", 
      "userId: req.user.userId, name, email, phone, agenda }"
    );
  } else {
     // Generic fallback if formatting differs
     bookingCtrl = bookingCtrl.replace(
      "status: 'PENDING_PAYMENT'", 
      "status: 'PENDING_PAYMENT',\n      name, email, phone, agenda"
    );
  }
  
  fs.writeFileSync('./apps/booking-service/src/controllers/booking.controller.ts', bookingCtrl);
}
