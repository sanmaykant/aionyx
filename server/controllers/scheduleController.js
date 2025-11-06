import { OAuth2Client } from "google-auth-library";
import { google } from "googleapis"
import { User } from "../models/user.js";

const ensureSeconds = (timeString) => {
  try {
    if (!timeString) return "";

    // Remove 'Z' from the string if it exists (optional based on input)
    timeString = timeString.replace("Z", "");

    // Parse the time string as a local date
    const date = new Date(timeString);

    // If the date is invalid, return an empty string
    if (isNaN(date)) {
      console.error("Invalid date string:", timeString);
      return "";
    }

    // Use the local time parts (hours, minutes) and set seconds to '00'
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    const hours = String(date.getHours()).padStart(2, '0');
    const minutes = String(date.getMinutes()).padStart(2, '0');
    const seconds = '00'; // Always set seconds to 00

    // Return the formatted string in the form: "YYYY-MM-DDTHH:MM:SS"
    return `${year}-${month}-${day}T${hours}:${minutes}:${seconds}`;
  } catch (error) {
    console.error("Error processing time string:", timeString, error);
    return "";
  }
};

async function checkCalendarConflicts(calendar, startTime, endTime) {
  // Convert start and end times to UTC and log for debugging
  const timeMin = new Date(startTime).toISOString();
  const timeMax = new Date(endTime).toISOString();
  console.log('Start Time (UTC):', timeMin);
  console.log('End Time (UTC):', timeMax);

  const requestBody = {
    timeMin: timeMin,
    timeMax: timeMax,
    timeZone: "Asia/Kolkata", // Make sure this is correct
    items: [{ id: "primary" }], // Check for the user's primary calendar
  };

  try {
    const res = await calendar.freebusy.query({
      requestBody,
    });

    const busySlots = res.data.calendars.primary.busy;

    // Log detailed information on busy slots
    console.log("Returned Busy Slots:", JSON.stringify(busySlots, null, 2));

    if (busySlots.length > 0) {
      console.log("⚠️ Conflicts found:", busySlots);
      return { conflict: true, busySlots };
    } else {
      console.log("✅ No conflicts found!");
      return { conflict: false };
    }
  } catch (error) {
    console.error("Error querying calendar:", error);
    return { conflict: false, error: error.message };
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

    console.log(eventDetails.start, eventDetails.end)
    const start_time = ensureSeconds(eventDetails.start)
    const end_time = ensureSeconds(eventDetails.end)
      console.log("here", start_time, end_time)

    const { conflict, busySlots } = await checkCalendarConflicts(
      calendar,
      start_time,
      end_time
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
      start: { dateTime: start_time, timeZone: "Asia/Kolkata" },
      end: { dateTime: end_time, timeZone: "Asia/Kolkata" },
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
