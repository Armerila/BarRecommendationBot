require('dotenv').config()
const TelegramBot = require('node-telegram-bot-api');

// replace the value below with the Telegram token you receive from @BotFather
const token = process.env.BOT_TOKEN;
console.log(token);
// Create a bot that uses 'polling' to fetch new updates
const bot = new TelegramBot(token, {polling: true});

bot.on('message', (msg) => {
  const chatId = msg.chat.id;

  // send a message to the chat acknowledging receipt of their message
  //bot.sendMessage(chatId, 'Received your message');

  msgText = msg.text.toString().toLowerCase();

  switch (msgText) {
    case "/getRecommendation":
      bot.sendMessage(chatId, 'I would recommend the following bars:');
      break;
    default:
      bot.sendMessage(chatId, 'Invalid command!');
      break;
  }
});