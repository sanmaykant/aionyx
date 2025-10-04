import React, { useState, useEffect } from 'react';

const clientId = '803213573314-pl0u081jhi611utaddtleto7u31eopfh.apps.googleusercontent.com'; // your OAuth client ID

function App() {
  const [tokenClient, setTokenClient] = useState(null);
  const [accessToken, setAccessToken] = useState('');
  const [eventStatus, setEventStatus] = useState('');

  useEffect(() => {
    /* global google */
    const client = google.accounts.oauth2.initTokenClient({
      client_id: clientId,
      scope: 'https://www.googleapis.com/auth/calendar.events',
      callback: (tokenResponse) => {
        setAccessToken(tokenResponse.access_token);
        setEventStatus('Access token acquired');
      },
    });
    setTokenClient(client);
  }, []);

  const requestAccessToken = () => {
    if (tokenClient) {
      tokenClient.requestAccessToken();
    }
  };

  const createEvent = () => {
    if (!accessToken) {
      setEventStatus('Please authorize first');
      return;
    }

    const event = {
      summary: 'Test Event from React',
      start: {
        dateTime: new Date(new Date().getTime() + 5 * 60000).toISOString(),
        timeZone: 'UTC',
      },
      // end: {
      //   dateTime: new Date(new Date().getTime() + 65 * 60000).toISOString(),
      //   timeZone: 'UTC',
      // },
    };

    fetch('https://www.googleapis.com/calendar/v3/calendars/primary/events', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${accessToken}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(event),
    })
      .then((res) => {
        if (res.ok) {
          setEventStatus('Event created successfully!');
        } else {
          res.json().then((data) => {
            setEventStatus('Create event failed: ' + JSON.stringify(data));
          });
        }
      })
      .catch((err) => setEventStatus('Error: ' + err.message));
  };

  return (
    <div style={{ maxWidth: 400, margin: '50px auto', textAlign: 'center' }}>
      <button onClick={requestAccessToken}>Authorize Google Calendar Access</button>
      <button onClick={createEvent} style={{ marginLeft: 10 }}>
        Create Event
      </button>
      {eventStatus && <p>{eventStatus}</p>}
    </div>
  );
}

export default App;
