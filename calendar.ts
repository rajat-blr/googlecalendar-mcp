import { google } from 'googleapis';
import { getAuthClient } from './auth';

export async function createEvent(eventDetails: {
  summary: string;
  location?: string;
  description?: string;
  startDateTime: string;
  endDateTime: string;
  timeZone: string;
  attendees?: string[];
}): Promise<string> {
  const auth = await getAuthClient();
  const calendar = google.calendar({ version: 'v3', auth });

  const event = {
    summary: eventDetails.summary,
    location: eventDetails.location,
    description: eventDetails.description,
    start: {
      dateTime: eventDetails.startDateTime,
      timeZone: eventDetails.timeZone,
    },
    end: {
      dateTime: eventDetails.endDateTime,
      timeZone: eventDetails.timeZone,
    },
    recurrence: ['RRULE:FREQ=DAILY;COUNT=1'],
    reminders: {
      useDefault: false,
      overrides: [{ method: 'popup', minutes: 10 }],
    },
    attendees: eventDetails.attendees?.map(email => ({ email })),
  };

  const response = await calendar.events.insert({
    calendarId: 'primary',
    requestBody: event,
  });

  return response.data.htmlLink || 'Event created';
}

export async function listEvents(maxResults: number): Promise<string> {
  const auth = await getAuthClient();
  const calendar = google.calendar({ version: 'v3', auth });

  const response = await calendar.events.list({
    calendarId: 'primary',
    timeMin: new Date().toISOString(),
    maxResults,
    singleEvents: true,
    orderBy: 'startTime',
  });

  const events = response.data.items || [];
  return events.length === 0
    ? 'No upcoming events found.'
    : events.map(e => `- ${e.summary} (${e.start?.dateTime || e.start?.date})`).join('\n');
}
