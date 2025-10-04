import { OAuth2Client } from "google-auth-library";
import { User } from "../schemas/User.js";
import { google } from "googleapis";

async function getUserData(access_token) {
    const response = await fetch(
`https://www.googleapis.com/oauth2/v3/userinfo?access_token=${access_token}`);
    const data = await response.json();
    return data
}

export const generateGoogleOAuthURI = async (req, res) => {
    const oAuth2Client = new OAuth2Client(
        process.env.CLIENT_ID,
        process.env.CLIENT_SECRET,
        process.env.REDIRECT_URI
    );

    const authorizeUrl = oAuth2Client.generateAuthUrl({
        access_type: 'offline',
        scope: 'https://www.googleapis.com/auth/userinfo.profile https://www.googleapis.com/auth/userinfo.email https://www.googleapis.com/auth/calendar openid',
        prompt: 'consent'
    });

    return res.json({ success: true, url:authorizeUrl })
}

export const retrieveTokensGoogleOAuth = async (req, res) => {
    try {
        const { code } = req.query

        if (!code) {
            return res.status(400).json({ error: "Authorization code is missing." })
        }

        const oAuth2Client = new OAuth2Client(
            process.env.CLIENT_ID,
            process.env.CLIENT_SECRET,
            process.env.REDIRECT_URI
        );

        const r =  await oAuth2Client.getToken(code);
        oAuth2Client.setCredentials(r.tokens);

        const refreshToken = oAuth2Client.credentials.refresh_token
        const accessToken = oAuth2Client.credentials.access_token
        const googleId = oAuth2Client.credentials.id_token

        const { name, email } = await getUserData(
            oAuth2Client.credentials.access_token);

        const user = new User({
            googleId,
            name,
            email,
            accessToken,
            refreshToken
        })
        await user.save()
        console.log(user)

        res.redirect(303, `http://localhost:5173/dashboard?accessToken=${accessToken}`);
    } catch (error) {
        throw error
    }
}

          //const calendar = google.calendar({ version: 'v3', auth: oAuth2Client });

  //// Define event details
  //const event = {
  //  summary: 'Sample Event', // Event title
  //  location: 'Somewhere',   // Event location
  //  description: 'A sample event for testing', // Event description
  //  start: {
  //      dateTime: new Date(new Date().getTime() + 5 * 60000).toISOString(),
  //      timeZone: 'UTC',
  //    },
  //    end: {
  //      dateTime: new Date(new Date().getTime() + 65 * 60000).toISOString(),
  //      timeZone: 'UTC',
  //    },
  //  reminders: {
  //    useDefault: true, // Enable default reminders
  //  },
  //};

  //try {
  //  // Create the event in the user's calendar
  //  const res = await calendar.events.insert({
  //    calendarId: 'primary', // 'primary' for the user's main calendar
  //    resource: event, // The event data
  //  });

  //  console.log('Event created:', res.data);
  //  return res.data; // Event data response (including event ID)
  //} catch (error) {
  //  console.error('Error creating event:', error);
  //  throw error; // Handle error
  //}
