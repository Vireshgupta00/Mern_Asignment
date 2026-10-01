import { google } from 'googleapis';

const oauth2Client = new google.auth.OAuth2(
  process.env.GOOGLE_CLIENT_ID,
  process.env.GOOGLE_CLIENT_SECRET,
  process.env.GOOGLE_REDIRECT_URI
);

// In a real production environment, this refresh token would be stored securely
// or provided via a service account to interact with the platform's calendar.
if (process.env.GOOGLE_REFRESH_TOKEN) {
  oauth2Client.setCredentials({ refresh_token: process.env.GOOGLE_REFRESH_TOKEN });
}

const calendar = google.calendar({ version: 'v3', auth: oauth2Client });

export const createCalendarEvent = async (bookingDetails: {
  _id: string;
  name: string;
  email: string;
  agenda: string;
  startTime: string;
  endTime: string;
}) => {
  try {
    // If no credentials exist locally, gracefully return mock data so local dev doesn't break
    if (!process.env.GOOGLE_CLIENT_ID) {
      console.warn('[Calendar Service] Missing Google Credentials in .env. Falling back to mock data.');
      return { eventId: 'mock-event-id-123', meetingUrl: 'https://meet.google.com/mock-url' };
    }

    const response = await calendar.events.insert({
      calendarId: 'primary',
      conferenceDataVersion: 1, // Requests Google Meet link generation
      requestBody: {
        summary: `Career Consultation with ${bookingDetails.name}`,
        description: `Agenda: ${bookingDetails.agenda}`,
        start: { dateTime: bookingDetails.startTime, timeZone: 'UTC' },
        end: { dateTime: bookingDetails.endTime, timeZone: 'UTC' },
        attendees: [{ email: bookingDetails.email }],
        conferenceData: {
          createRequest: {
            requestId: bookingDetails._id,
            conferenceSolutionKey: { type: 'hangoutsMeet' }
          }
        }
      }
    });

    return {
      eventId: response.data.id,
      meetingUrl: response.data.hangoutLink
    };
  } catch (error: any) {
    console.error('[Calendar Service] API Failure:', error.message);
    throw new Error('Failed to create calendar event');
  }
};
