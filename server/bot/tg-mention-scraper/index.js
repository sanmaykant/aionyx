import 'dotenv/config';
import { Telegraf } from 'telegraf';
import fs from 'fs';

// Load bot token from .env
const bot = new Telegraf(process.env.BOT_TOKEN);

// JSON file path
const DATA_FILE = "./data/messages.json";

// Initialize storage file if it doesn’t exist
if (!fs.existsSync(DATA_FILE)) {
  fs.writeFileSync(DATA_FILE, JSON.stringify([], null, 2));
}

// === Utility function to safely save mentions ===
function saveMention(mention) {
  let data;
  try {
    const fileContent = fs.readFileSync(DATA_FILE, 'utf8');
    data = JSON.parse(fileContent);
    if (!Array.isArray(data)) {
      console.warn('⚠️ Invalid JSON format detected — resetting file.');
      data = [];
    }
  } catch (err) {
    console.error('⚠️ Error reading JSON file:', err);
    data = [];
  }

  data.push(mention);
  fs.writeFileSync(DATA_FILE, JSON.stringify(data, null, 2));
}

// === Handle messages ===
bot.on('message', (ctx) => {
  const messageText = ctx.message.text || '';
  const botUsername = ctx.botInfo.username.toLowerCase();

  // Only process messages that mention the bot
  if (messageText.toLowerCase().includes(`@${botUsername}`)) {
    // Remove the bot mention from text
    const cleanText = messageText.replace(new RegExp(`@${botUsername}`, 'gi'), '').trim();

    const mentionData = {
      user: ctx.from.username || ctx.from.first_name,
      userId: ctx.from.id,
      chatId: ctx.chat.id,
      chatTitle: ctx.chat.title || 'Private Chat',
      text: cleanText, // ✅ cleaned text (without @bot mention)
      timestamp: new Date().toISOString(),
    };

    console.log('📩 Mention detected:', mentionData);
    saveMention(mentionData);

    ctx.reply(`✅ Got it, @${ctx.from.username || ctx.from.first_name}! Your message has been saved.`);
  }
});

// === Launch the bot ===
bot.launch();
console.log('🤖 Bot is running and listening for mentions...');
