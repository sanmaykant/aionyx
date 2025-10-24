import { OAuth2Client } from "google-auth-library";
import { google } from "googleapis"
import { User } from "../models/user.js";

const ensureSeconds = (timeString) => {
  try {
    if (!timeString) return "";
    const date = new Date(timeString);
    const isoWithSeconds = date.toISOString().slice(0, 19);
    return isoWithSeconds;
  } catch (error) {
    console.error("Invalid time string provided:", timeString, error);
    return "";
  }
};

export const scheduleEvent = async (req, res) => {
    try {
        const { accessToken, eventDetails } = req.body

        const oAuth2Client = new OAuth2Client(
            process.env.CLIENT_ID,
            process.env.CLIENT_SECRET,
            process.env.REDIRECT_URI
        );

        const user = await User.findOne({ accessToken: accessToken })
        const refreshToken = user.refreshToken
        
        console.log(accessToken, refreshToken)
        oAuth2Client.setCredentials({
            access_token: accessToken,
            refresh_token: refreshToken
        })

        const calendar = google.calendar({ version: "v3", auth: oAuth2Client })

        const startTimeWithSeconds = ensureSeconds(eventDetails.start_time);
        console.log("Seconds wala: "+startTimeWithSeconds)
        console.log(eventDetails.start_time)
        const endTimeWithSeconds = ensureSeconds(eventDetails.end_time);
        const event = {
            summary: eventDetails.title,
            description: eventDetails.description,
            start: {
                dateTime: startTimeWithSeconds,
                timeZone: "Asia/Kolkata"
            },
            end: {
                dateTime: endTimeWithSeconds,
                timeZone: "Asia/Kolkata"
            },
            reminders: { useDefault: true }
        }

        console.log(event)

        const result = calendar.events.insert({
            calendarId: 'primary',
            resource: event, 
        });

        console.log('Event created:', result);

        return res.status(200).json({ success: true, message: result.data })
    } catch (error) {
        console.error(error)
        res.status(400).json({ success: false, message: error })
    }
}