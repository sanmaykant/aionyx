import fs from "fs";
import path from "path";
import { google } from "googleapis";
import { authenticate } from "@google-cloud/local-auth";
import { Buffer } from "buffer";

// ---------------- CONFIG ----------------
const SCOPES = ["https://www.googleapis.com/auth/gmail.readonly"];
const TOKEN_PATH = path.join(process.cwd(), "token.json");
const CREDENTIALS_PATH = path.join(process.cwd(), "credentials.json");
const LAST_ID_PATH = path.join(process.cwd(), "last_message_id.txt");
const MY_EMAIL = "rahulmalu25@gmail.com";
const POLL_INTERVAL_MS = 60 * 1000; // 1 minute
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

  const client = await authenticate({ keyfilePath: CREDENTIALS_PATH, scopes: SCOPES });
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
    return;
  }

  console.log(`\n📬 [${new Date().toLocaleTimeString()}] Found ${newMessages.length} new email(s)\n`);

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

    console.log(`Subject: ${subject}`);
    console.log(`From: ${from}`);
    console.log(`Date: ${date}`);
    console.log(`Cc: ${cc}`);
    console.log(`Body snippet: ${snippet}`);
    console.log("-".repeat(60));

    await setLastMessageId(m.id);
  }
}

async function startWatcher() {
  const auth = await authorize();
  console.log("✅ Gmail watcher started... (polling every", POLL_INTERVAL_MS / 1000, "seconds)\n");

  await listCcEmails(auth);
  setInterval(() => listCcEmails(auth), POLL_INTERVAL_MS);
}

// Run watcher
startWatcher().catch((err) => console.error("❌ Error:", err));
