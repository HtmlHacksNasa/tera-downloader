 async function main() {
  const { Telegraf, Markup } = require("telegraf");
  const { getDetails } = require("./api");
  const { sendFile } = require("./utils");
  const express = require("express");
   
  function extractLink(text, pattern) {
    
    const regex = new RegExp(pattern, 'i');
    
    const match = regex.exec(text);

    if (match) {
      return match[1];
    }
    return null;
  }
   
  const bot = new Telegraf(process.env.BOT_TOKEN);

  bot.start(async (ctx) => {
    try {
      ctx.reply(
        `Hi ${ctx.message.from.first_name},\n\nSend any study material link to download. "teraboxapp.com" waali link j naakhvi`,
        Markup.inlineKeyboard([
          Markup.button.url("Sexy Archives", "https://t.me/+tz6M9qdk5QNhMjc1"),
          Markup.button.url("Admin", "https://t.me/Don_coreleon"),
        ]),
      );
    } catch (e) {
      console.error(e);
    }
  });

  bot.on("message", async (ctx) => {
    
    if (ctx.message && ctx.message.text) {
      const messageText = ctx.message.text;

      const pattern = /(https:\/\/teraboxapp\.com[^\s]+)/i; // Match any http/https URL
  
      const extractedLink = extractLink(messageText, pattern);
      if (extractedLink
        // messageText.includes("terabox.com") ||
        // messageText.includes("teraboxapp.com") 
      ) {
        //const parts = messageText.split("/");
        //const linkID = parts[parts.length - 1];

        // ctx.reply(linkID)

        const details = await getDetails(extractedLink);
        if (details && details.direct_link) {
          try {
            ctx.reply(`Sending Files Please Wait.!!`);
            sendFile(details.direct_link, ctx);
          } catch (e) {
            console.error(e); // Log the error for debugging
          }
        } else {
          ctx.reply('Something went wrong 🙃');
        }
        console.log(details);
      } else {
        ctx.reply("Please send a valid Terabox link.");
      }
    } else {
      //ctx.reply("No message text found.");
    }
  });

  const app = express();
  // Set the bot API endpoint
  app.use(await bot.createWebhook({ domain: process.env.WEBHOOK_URL }));

  app.listen(process.env.PORT || 3000, () => console.log("Server Started"));
}

main();
