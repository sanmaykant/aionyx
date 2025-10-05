import { OAuth2Client } from "google-auth-library";
import { google } from "googleapis"
import { User } from "../schemas/User.js";

// Helper function to ensure time includes seconds
const ensureSeconds = (timeString) => {
    const date = new Date(timeString);
    const hours = String(date.getHours()).padStart(2, '0');
    const minutes = String(date.getMinutes()).padStart(2, '0');
    const seconds = String(date.getSeconds()).padStart(2, '0');
    return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}T${hours}:${minutes}:${seconds}`;
}

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

        const startTimeWithSeconds = ensureSeconds(eventDetails.startTime);
        const endTimeWithSeconds = ensureSeconds(eventDetails.endTime);
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
            calendarId: 'primary', // 'primary' for the user's main calendar
            resource: event, // The event data
        });

        console.log('Event created:', result);

        return res.status(200).json({ success: true, message: result.data })
    } catch (error) {
        console.error(error)
        res.status(400).json({ success: false, message: error })
    }
}
