'use client';

import React, { useState, useEffect } from 'react';
import { signIn, onAuthStateChanged } from '../../utils/auth';

function Calendar() {
  const [user, setUser] = useState(null);
  const [googleAccessToken, setGoogleAccessToken] = useState(null);
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged((currentUser) => {
      setUser(currentUser);
      if (!currentUser) {
        setGoogleAccessToken(null);
        setEvents([]);
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const fetchCalendarEvents = async (token) => {
    if (!token) {
      setError('No Google Access Token available to fetch events.');
      setLoading(false);
      return;
    }

    setLoading(true);
    setError(null);
    try {
      const now = new Date();
      const sevenDaysLater = new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000);

      const response = await fetch(`https://www.googleapis.com/calendar/v3/calendars/primary/events?timeMin=${now.toISOString()}&timeMax=${sevenDaysLater.toISOString()}&singleEvents=true&orderBy=startTime`, {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(`Failed to fetch events: ${response.status} - ${errorData.error.message}`);
      }

      const data = await response.json();
      setEvents(data.items || []);
      console.log('Fetched events:', data.items);
    } catch (err) {
      console.error('Error fetching calendar events:', err);
      setError(`Error fetching events: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  const createSampleEvent = async () => {
    if (!googleAccessToken) {
      setError('Please sign in to create events.');
      return;
    }

    setLoading(true);
    setError(null);
    try {
      const now = new Date();
      const oneHourLater = new Date(now.getTime() + 60 * 60 * 1000);

      const event = {
        summary: 'My App Test Event',
        description: 'Created automatically by my calendar app.',
        start: {
          dateTime: now.toISOString(),
          timeZone: Intl.DateTimeFormat().resolvedOptions().timeZone,
        },
        end: {
          dateTime: oneHourLater.toISOString(),
          timeZone: Intl.DateTimeFormat().resolvedOptions().timeZone,
        },
      };

      const response = await fetch('https://www.googleapis.com/calendar/v3/calendars/primary/events', {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${googleAccessToken}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(event),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(`Failed to create event: ${response.status} - ${errorData.error.message}`);
      }

      const newEvent = await response.json();
      console.log('Event created:', newEvent);
      alert('Event "My App Test Event" created successfully in your Google Calendar!');
      fetchCalendarEvents(googleAccessToken);
    } catch (err) {
      console.error('Error creating event:', err);
      setError(`Error creating event: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  const handleSignIn = async () => {
    setLoading(true);
    setError(null);
    try {
      const { user: signedInUser, token } = await signIn();

      setUser(signedInUser);
      setGoogleAccessToken(token);
      console.log('Signed in successfully! Google Access Token:', token);

      fetchCalendarEvents(token);
    } catch (err) {
      console.error('Error during sign-in:', err);
      if (err.code === 'auth/popup-closed-by-user') {
        setError('Sign-in process cancelled by the user.');
      } else {
        setError(`Sign-in failed: ${err.message || 'Please try again.'}`);
      }
      setLoading(false);
    }
  };

  return (
    <div style={{ maxWidth: '800px', margin: '20px auto', padding: '20px', border: '1px solid #ccc', borderRadius: '8px', boxShadow: '2px 2px 8px rgba(0,0,0,0.1)' }}>
      <h1 style={{ textAlign: 'center', color: '#333' }}>My Calendar</h1>

      {loading && <p style={{ textAlign: 'center', color: '#007bff' }}>Loading...</p>}
      {error && <p style={{ textAlign: 'center', color: 'red', fontWeight: 'bold' }}>Error: {error}</p>}

      {user ? (
        <div>
          <p style={{ textAlign: 'center', fontSize: '1.1em' }}>
            Welcome, <strong style={{ color: '#007bff' }}>{user.displayName || user.email}</strong>!
          </p>

          <hr style={{ margin: '30px 0' }} />

          <h2 style={{ textAlign: 'center', color: '#555' }}>Your Upcoming Events</h2>
          {events.length === 0 && !loading && !error && <p style={{ textAlign: 'center', color: '#777' }}>No upcoming events found in the next 7 days.</p>}
          <ul style={{ listStyleType: 'none', padding: 0 }}>
            {events.map((event) => (
              <li key={event.id} style={{ border: '1px solid #eee', borderRadius: '5px', padding: '10px', marginBottom: '10px', backgroundColor: '#f9f9f9' }}>
                <strong style={{ color: '#007bff' }}>{event.summary || 'No Title'}</strong>
                <p style={{ margin: '5px 0', fontSize: '0.9em', color: '#666' }}>
                  {event.start && (event.start.dateTime ? new Date(event.start.dateTime).toLocaleString() : new Date(event.start.date).toLocaleDateString())}
                  {' - '}
                  {event.end && (event.end.dateTime ? new Date(event.end.dateTime).toLocaleString() : new Date(event.end.date).toLocaleDateString())}
                </p>
                {event.location && <p style={{ margin: '5px 0', fontSize: '0.85em', color: '#888' }}>Location: {event.location}</p>}
                {event.description && <p style={{ margin: '5px 0', fontSize: '0.85em', color: '#888' }}>{event.description}</p>}
              </li>
            ))}
          </ul>

          <hr style={{ margin: '30px 0' }} />

          <h2 style={{ textAlign: 'center', color: '#555' }}>Create an appointment</h2>
          <div style={{ textAlign: 'center' }}>
            <button type="button" onClick={createSampleEvent} disabled={loading} style={{ padding: '12px 25px', fontSize: '1.1em', backgroundColor: '#28a745', color: 'white', border: 'none', borderRadius: '5px', cursor: 'pointer' }}>
              Sample Calendar Event
            </button>
          </div>
        </div>
      ) : (
        <div>
          <p style={{ textAlign: 'center', padding: '50px 0', fontSize: '1.2em', color: '#666' }}>Please sign in with your Google account to view and interact with your calendar.</p>
          <div style={{ textAlign: 'center' }}>
            <button type="button" onClick={handleSignIn} disabled={loading} style={{ padding: '15px 30px', fontSize: '1.2em', backgroundColor: '#007bff', color: 'white', border: 'none', borderRadius: '5px', cursor: 'pointer' }}>
              Sign In with Google
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default Calendar;
