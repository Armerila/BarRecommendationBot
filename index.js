require('dotenv').config();
let recommendations = require ('./controllers/recommendations');
const TelegramBot = require('node-telegram-bot-api');

// replace the value below with the Telegram token you receive from @BotFather
const token = process.env.BOT_TOKEN;
console.log(token);
// Create a bot that uses 'polling' to fetch new updates
const bot = new TelegramBot(token, {polling: true});

let addBarDialog = {
  step1: false,
  step2: false
};
let addBarInfo = {};

bot.on('message', (msg) => {
  const chatId = msg.chat.id;
  msgText = msg.text.toString();

  if (msg.chat.type == "private") {
    if (addBarDialog.step1) {
      if (addBarDialog.step2) {
        addBarInfo.address = msgText;
        bot.sendMessage(chatId, 'A new bar added to the database!');
        recommendations.insertBar(addBarInfo);
        addBarDialog.step1 = false;
        addBarDialog.step2 = false;
      } else {
        addBarInfo.name = msgText;
        bot.sendMessage(chatId, 'Thank you, now give an address for the bar:');
        addBarDialog.step2 = true;
      }
    } else {
      if (msgText == "/addBar") {
        bot.sendMessage(chatId, 'Please give a name for the bar:');
        addBarDialog.step1 = true;
        addBarInfo = {};
      }
    }
  }
});
