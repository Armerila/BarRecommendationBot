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

        recommendations.insertBar(addBarInfo);
        bot.sendMessage(chatId, "Bar added to the database!");

        addBarDialog.step1 = false;
        addBarDialog.step2 = false;

      } else {
        addBarInfo.name = msgText;
        bot.sendMessage(chatId, 'Thank you, now give an address for the bar:');
        addBarDialog.step2 = true;
      }
    } else if (msgText == "/addBar") {
      bot.sendMessage(chatId, 'Please give a name for the bar:');
      addBarDialog.step1 = true;
      addBarInfo = {};
    }
  } else {
    if (msgText.indexOf("/rateBar") > -1) {
      let rating = msgText.split(" ");

      if (rating.length == 3) {
        recommendations.insertRating(msg.from.id, msg.from.username, rating[1], rating[2], function(res) {
          bot.sendMessage(chatId, res);
        });
      }
    } else if (msgText.indexOf("/getSingleRecommendation") > -1) {
      recommendations.getRatingData(function(allUsers, allBars, allRatings) {
        console.log(allUsers);
        let userRatings = [];
        let senderIndex = 0;
        allUsers.forEach((user, index) => {
          let ratings = [];
          console.log(index);
          if (user.id == msg.from.id) {
            senderIndex = index;
          }
          allBars.forEach((bar) => {
            var uRating = 0;
            allRatings.forEach((rating) => {
              if (rating.bar == bar.id && rating.user == user.id) {
                uRating = rating.rating;
              }
            });
            ratings.push(uRating);
          });
          userRatings.push(ratings);
        });
        
        recommendations.getSingleRecommendation(userRatings, senderIndex,function(res) {
          bot.sendMessage(chatId, "I would recommend the following 3 bars for you:\n" 
          + "1. " + allBars[res[0].itemId - 1].name + ", " + allBars[res[0].itemId - 1].address
          + "\n2. " + allBars[res[1].itemId - 1].name + ", " + allBars[res[1].itemId - 1].address
          + "\n3. " + allBars[res[2].itemId - 1].name + ", " + allBars[res[2].itemId - 1].address);
        });
      });
    }
  }
});
