const { Telegraf } = require('telegraf');

// Replace 'YOUR_BOT_TOKEN' with your actual bot token
const bot = new Telegraf(process.env.BOT_TOKEN || 'YOUR_BOT_TOKEN');

// Handle /start command
bot.start((ctx) => {
  ctx.reply('Welcome! Send me "hi" or "hello" to get a greeting!');
});

// Handle "hi" message
bot.hears('hi', (ctx) => {
  ctx.reply('Hello! How can I assist you today?');
});

// Handle "hello" message
bot.hears('hello', (ctx) => {
  ctx.reply('Hi there! How can I help you?');
});

// Handle other messages
bot.on('text', (ctx) => {
  ctx.reply("I only respond to 'hi' or 'hello'. Try again!");
});

// Start the bot
bot.launch()
  .then(() => console.log('Bot is running...'))
  .catch((error) => console.error('Error starting bot:', error));
