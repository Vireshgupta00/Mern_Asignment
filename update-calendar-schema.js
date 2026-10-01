const fs = require('fs');

// 1. Update Booking Schema for Section 12 persistence requirements
let bookingSchema = fs.readFileSync('./apps/booking-service/src/models/Booking.ts', 'utf8');
if (!bookingSchema.includes('calendarEventId')) {
  bookingSchema = bookingSchema.replace(
    "agenda: { type: String },", 
    "agenda: { type: String },\n  calendarEventId: { type: String },\n  meetingUrl: { type: String },"
  );
  fs.writeFileSync('./apps/booking-service/src/models/Booking.ts', bookingSchema);
}
