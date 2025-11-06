import fs from "fs";
import path from "path";
import { google } from "googleapis";
import { authenticate } from "@google-cloud/local-auth";
import { Buffer } from "buffer";
import { config } from "dotenv";
import { identifyActivitiesText } from "../controllers/llmController.js";
import { OAuth2Client } from "google-auth-library";
import { User } from "../models/user.js";

config()

// ---------------- CONFIG ----------------
const SCOPES = [
  "https://www.googleapis.com/auth/gmail.readonly",
  "https://www.googleapis.com/auth/gmail.modify"
];
const TOKEN_PATH = path.join(process.cwd(), "token.json");
const CREDENTIALS_PATH = path.join(process.cwd(), "credentials.json");
const LAST_ID_PATH = path.join(process.cwd(), "last_message_id.txt");
const MY_EMAIL = process.env.BOT_MAIL;
const POLL_INTERVAL_MS = 5 * 1000; // 1 minute
// ----------------------------------------

async function loadToken() {
  try {
    const content = await fs.promises.readFile(TOKEN_PATH, "utf-8");
    return JSON.parse(content);
  } catch {
    return null;
  }
}

async function saveToken(token) {
  await fs.promises.writeFile(TOKEN_PATH, JSON.stringify(token, null, 2));
}

async function authorize() {
    const creds = JSON.parse(await fs.promises.readFile(CREDENTIALS_PATH, "utf-8"));
    const { client_id, client_secret, redirect_uris } = creds.installed || creds.web;
    const oauth2Client = new google.auth.OAuth2(client_id, client_secret, redirect_uris[0]);

    const token = await loadToken();
    if (token) {
        oauth2Client.setCredentials(token);
        return oauth2Client;
    }

    const client = await authenticate({
        keyfilePath: CREDENTIALS_PATH,
        scopes: SCOPES,
        port: 8000
    });
    if (client.credentials) {
        oauth2Client.setCredentials(client.credentials);
        await saveToken(client.credentials);
    }

    return oauth2Client;
}

function decodeBase64(data) {
  return data ? Buffer.from(data, "base64").toString("utf-8") : "";
}

function getMessageBody(payload) {
  if (payload.parts) {
    for (const part of payload.parts) {
      if (part.mimeType === "text/plain" && part.body?.data) {
        return decodeBase64(part.body.data).trim();
      }
    }
  }
  if (payload.body?.data) return decodeBase64(payload.body.data).trim();
  return "";
}

function decodeMimeHeader(header) {
  if (!header) return "";
  return header.replace(/=\?[^?]+\?([BQ])\?[^?]+\?=/gi, (match) => {
    try {
      const parts = match.split("?");
      const encoding = parts[2].toUpperCase();
      const data = parts[3];
      if (encoding === "B") return Buffer.from(data, "base64").toString("utf-8");
      if (encoding === "Q")
        return data.replace(/_/g, " ").replace(/=([A-F0-9]{2})/g, (_, hex) =>
          String.fromCharCode(parseInt(hex, 16))
        );
      return match;
    } catch {
      return match;
    }
  });
}

async function addLabelToMessage(auth, messageId, labelId) {
  const gmail = google.gmail({ version: "v1", auth });

  try {
    // Modify the message to add a label
    const res = await gmail.users.messages.modify({
      userId: "me",
      id: messageId,
      requestBody: {
        addLabelIds: [labelId], // Add the labelId to the message
      },
    });
    console.log(`Added label to message with ID: ${messageId}`);
  } catch (err) {
    console.error(`Failed to add label to message with ID: ${messageId}`, err);
  }
}

async function getLabelId(auth, labelName) {
  const gmail = google.gmail({ version: "v1", auth });

  try {
    // Fetch all labels
    const res = await gmail.users.labels.list({
      userId: "me",
    });

    const labels = res.data.labels || [];
    const label = labels.find(l => l.name === labelName);

    if (label) {
      return label.id;
    } else {
      console.log(`Label "${labelName}" not found.`);
      return null;
    }
  } catch (err) {
    console.error("Failed to fetch labels", err);
    return null;
  }
}

async function getLastMessageId() {
  try {
    return await fs.promises.readFile(LAST_ID_PATH, "utf-8");
  } catch {
    return null;
  }
}

async function setLastMessageId(id) {
  await fs.promises.writeFile(LAST_ID_PATH, id);
}

function addHoursToDate(dateString, hoursToAdd) {
    const date = new Date(dateString);
    date.setHours(date.getHours() + hoursToAdd);
    return date.toISOString();
}

async function listCcEmails(auth) {
  const gmail = google.gmail({ version: "v1", auth });
  const res = await gmail.users.messages.list({
    userId: "me",
    q: `cc:${MY_EMAIL}`,
    maxResults: 10,
  });

  const messages = res.data.messages || [];
  if (!messages.length) {
    console.log(`[${new Date().toLocaleTimeString()}] No emails found with ${MY_EMAIL} in CC.`);
    return;
  }

  const lastSeenId = await getLastMessageId();
  const newMessages = lastSeenId
    ? messages.filter((m) => m.id !== lastSeenId)
    : messages;

  if (!newMessages.length) {
    console.log(`[${new Date().toLocaleTimeString()}] No new emails.`);
    setTimeout(() => listCcEmails(auth), POLL_INTERVAL_MS)
    return;
  }

  console.log(`\n📬 [${new Date().toLocaleTimeString()}] Found ${newMessages.length} new email(s)\n`);

    const labelId = await getLabelId(auth, "processed");
    if (!labelId){
        console.error("'processed' label not configured for gmail bot")
        return;
    }

  for (const m of newMessages.reverse()) {
    const msg = await gmail.users.messages.get({
      userId: "me",
      id: m.id,
      format: "full",
    });

    const headers = msg.data.payload.headers;
    const getHeader = (name) =>
      headers.find((h) => h.name.toLowerCase() === name.toLowerCase())?.value || "";

    const subject = decodeMimeHeader(getHeader("Subject"));
    const from = decodeMimeHeader(getHeader("From"));
    const date = getHeader("Date");
    const cc = decodeMimeHeader(getHeader("Cc"));
    const body = getMessageBody(msg.data.payload);
    const snippet = body.replace(/\n/g, " ").slice(0, 200);

      const labels = msg.data.labelIds || [];
      const labelsList = labels.length > 0 ? labels.join(", ") : "No labels";

      console.log(snippet, labelsList)
      if (labelsList.includes(labelId))
          continue

    console.log(`Subject: ${subject}`);
    console.log(`From: ${from}`);
    console.log(`Date: ${date}`);
    console.log(`Cc: ${cc}`);
    console.log(`Body snippet: ${snippet}`)
      console.log(`Labels: ${labelsList}`);
    console.log("-".repeat(60));

      const activities = await identifyActivitiesText(body)
      console.log(activities)
      if (activities.length !== 0) {
          const oAuth2Client = new OAuth2Client(
              process.env.CLIENT_ID,
              process.env.CLIENT_SECRET,
              process.env.REDIRECT_URI
          );

          const email = /<([^>]+)>/.exec(from)[1];
          const user = await User.findOne({ email });
          oAuth2Client.setCredentials({
              access_token: user.accessToken,
              refresh_token: user.refreshToken,
          });

          const calendar = google.calendar({ version: "v3", auth: oAuth2Client });

          for (const activity of activities) {
              if (!activity.start_time) {
                  continue
              }
              let start_time = activity.start_time;
              start_time = start_time.replace("Z", "")
              let end_time = activity.end_time || addHoursToDate(activity.start_time, 1);
              end_time = end_time.replace("Z", "")
              console.log(start_time, end_time)
              const event = {
                  summary: activity.title,
                  description: activity.description,
                  start: { dateTime: start_time, timeZone: "Asia/Kolkata" },
                  end: { dateTime: end_time, timeZone: "Asia/Kolkata" },
              };

              const result = await calendar.events.insert({
                  calendarId: "primary",
                  requestBody: event,
              });
              console.log(result)
          }
      }

      await addLabelToMessage(auth, m.id, labelId)

    await setLastMessageId(m.id);
  }

    setTimeout(() => listCcEmails(auth), POLL_INTERVAL_MS)
}

export async function startWatcher() {
  const auth = await authorize();
  console.log("✅ Gmail watcher started... (polling every", POLL_INTERVAL_MS / 1000, "seconds)\n");

  await listCcEmails(auth);
}
