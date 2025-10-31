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

async function checkCalendarConflicts(calendar, startTime, endTime) {
  const requestBody = {
    timeMin: new Date(startTime).toISOString(),
    timeMax: new Date(endTime).toISOString(),
    timeZone: "Asia/Kolkata",
    items: [{ id: "primary" }], // check for the user's primary calendar
  };

  const res = await calendar.freebusy.query({
    requestBody,
  });

  const busySlots = res.data.calendars.primary.busy;

  if (busySlots.length > 0) {
    console.log("⚠️ Conflicts found:", busySlots);
    return { conflict: true, busySlots };
  } else {
    console.log("✅ No conflicts found!");
    return { conflict: false };
  }
}

export const scheduleEvent = async (req, res) => {
  try {
    const { accessToken, eventDetails } = req.body;

    const oAuth2Client = new OAuth2Client(
      process.env.CLIENT_ID,
      process.env.CLIENT_SECRET,
      process.env.REDIRECT_URI
    );

    const user = await User.findOne({ accessToken });
    oAuth2Client.setCredentials({
      access_token: accessToken,
      refresh_token: user.refreshToken,
    });

    const calendar = google.calendar({ version: "v3", auth: oAuth2Client });

    const { conflict, busySlots } = await checkCalendarConflicts(
      calendar,
      eventDetails.start_time,
      eventDetails.end_time
    );

    if (conflict) {
      return res.status(409).json({
        success: true,
        message: "Time conflict detected!",
        conflicts: busySlots,
      });
    }

    const event = {
      summary: eventDetails.title,
      description: eventDetails.description,
      start: { dateTime: eventDetails.start_time, timeZone: "Asia/Kolkata" },
      end: { dateTime: eventDetails.end_time, timeZone: "Asia/Kolkata" },
    };

    const result = await calendar.events.insert({
      calendarId: "primary",
      requestBody: event,
    });

    res.status(200).json({ success: true, message: "Event scheduled", result: result.data });
  } catch (error) {
    console.error(error);
    res.status(400).json({ success: false, message: error.message });
  }
};
