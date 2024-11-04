const { Telegraf, Markup } = require('telegraf');
const express = require('express');
const { getDetails } = require('./api'); // Assuming this is your API module
const { sendFile } = require('./utils'); // Assuming this is your utility module

const bot = new Telegraf(process.env.BOT_TOKEN);
const app = express();

// Extract link using regex
function extractLink(text, pattern) {
  const regex = new RegExp(pattern, 'i');
  const match = regex.exec(text);
  return match ? match[1] : null;
}

// Handle /start command
bot.start((ctx) => {
  ctx.reply(
    `Hi ${ctx.message.from.first_name},\n\nSend any study material link to download.`,
    Markup.inlineKeyboard([
      Markup.button.url('Admin', 'https://t.me/Don_coreleon'),
    ])
  );
});

// Handle messages
bot.on('message', async (ctx) => {
  if (ctx.message?.text) {
    const messageText = ctx.message.text;
    const pattern = /(https:\/\/(?:teraboxapp\.com|teraboxlink\.com|terafileshare\.com|www\.1024tera\.com)\/([^\s/]+))/i;
    const extractedLink = extractLink(messageText, pattern);

    if (extractedLink) {
      try {
        const details = await getDetails(extractedLink);
        if (details?.direct_link) {
          await ctx.reply('Sending files, please wait...');
          await sendFile(details.direct_link, ctx);
        } else {
          ctx.reply('Something went wrong while fetching details 🙃');
        }
      } catch (error) {
        console.error('Error fetching details or sending file:', error);
        ctx.reply('An error occurred while processing your request.');
      }
    } else {
      ctx.reply('Please send a valid Terabox link.');
    }
  }
});

// Set the bot API endpoint
app.use(bot.createWebhook({ domain: process.env.WEBHOOK_URL }));

// Start the server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server started on port ${PORT}`);
});
