import nodemailer from 'nodemailer';

// In a real application, you would configure process.env.SMTP_HOST, SMTP_USER, etc.
// Here we set up the transporter required by Section 13.
const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST || 'smtp.ethereal.email',
  port: Number(process.env.SMTP_PORT) || 587,
  auth: {
    user: process.env.SMTP_USER || 'mock_user',
    pass: process.env.SMTP_PASS || 'mock_pass',
  },
});

export const sendConfirmationEmail = async (booking: any, consultantName: string, meetingUrl: string) => {
  try {
    if (!process.env.SMTP_USER) {
      console.warn('[Email Service] Missing SMTP credentials. Simulating successful email delivery.');
    }

    // Constructs the email containing all 6 fields required by the PDF
    const mailOptions = {
      from: '"CareerAI Platform" <no-reply@careerai.com>',
      to: booking.email,
      subject: 'Your Consultation is Confirmed!',
      html: `
        <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e2e8f0; border-radius: 10px;">
          <h2 style="color: #2563eb;">Consultation Confirmed</h2>
          <p>Hi <strong>${booking.name}</strong>,</p>
          <p>Your payment was successful and your career consultation is officially booked.</p>
          
          <div style="background-color: #f8fafc; padding: 15px; border-radius: 8px; margin: 20px 0;">
            <ul style="list-style: none; padding: 0; margin: 0;">
              <li style="margin-bottom: 10px;"><strong>Booking ID:</strong> ${booking._id}</li>
              <li style="margin-bottom: 10px;"><strong>Consultant:</strong> ${consultantName}</li>
              <li style="margin-bottom: 10px;"><strong>Date:</strong> ${new Date(booking.date).toLocaleDateString()}</li>
              <li style="margin-bottom: 10px;"><strong>Time:</strong> ${booking.timeSlot}</li>
              <li><strong>Meeting Link:</strong> <a href="${meetingUrl}" style="color: #2563eb;">${meetingUrl}</a></li>
            </ul>
          </div>
          
          <p>Please come prepared to discuss your agenda: <em>"${booking.agenda}"</em></p>
          <p>Best regards,<br>The CareerAI Team</p>
        </div>
      `
    };

    // If real credentials exist, execute the actual network delivery
    if (process.env.SMTP_USER) {
       const info = await transporter.sendMail(mailOptions);
       console.log('[Email Service] Message sent successfully: %s', info.messageId);
    }
    
  } catch (error: any) {
    console.error('[Email Service] Failed to send email:', error.message);
    // We throw the error so the webhook can catch it and handle the failure gracefully
    throw new Error('Email delivery failed');
  }
};
