const TelegramApi = require("node-telegram-bot-api");

const {gameOptions, againOptions} = require('./options')

const token = "5306629500:AAHOeVd4nwgYWYnl8iSPMgSA050XPDsPgM4";

const bot = new TelegramApi(token, {
  polling: true,
});

const chats = {};



const startGame = async (chatId) => {
  await bot.sendMessage(
    chatId,
    `${msg.from.first_name}, я загадаю цифру от 0 до 9, угадай какую!`
  );
  const randomNumber = Math.floor(Math.random() * 10);
  chats[chatId] = randomNumber;
  await bot.sendMessage(chatId, "Отгадай", gameOptions);
};

const start = async () => {
  bot.setMyCommands([
    {
      command: "/start",
      description: "Начальное приветствие",
    },
    {
      command: "/info",
      description: "Информация о юзере",
    },
    {
      command: "/game",
      description: "Игра Угадай цифру",
    },
  ]);

  bot.on("message", async msg => {
    const text = msg.text;
    const chatId = msg.chat.id;

    if (text === "/start") {
      await bot.sendSticker(
        chatId,
        `https://tlgrm.ru/_/stickers/9df/619/9df6199a-ff6a-338d-9f74-625b0a647045/1.webp`
      );
      return bot.sendMessage(
        chatId,
        `${msg.from.first_name}, добро пожаловать в телеграм бот Funstock`
      );
    }
    if (text === "/info") {
      return bot.sendMessage(
        chatId,
        `Тебя зовут ${msg.from.first_name} ${msg.from.last_name}`
      );
    }
    if (text === "/game") {
      return startGame(chatId);
    }

    return bot.sendMessage(chatId, "Я тебя не понимаю, попробуй еще раз!");
  });

  bot.on("callback_query", async msg => {
    const data = msg.data;
    const chatId = msg.message.chat.id;

    if (data === "/again") {
      return startGame(chatId);
    }

    if (data === chats[chatId]) {
      return bot.sendMessage(
        chatId,
        `Поздравляю ${msg.from.first_name}, ты отгадал цифпу ${chats[chatId]}`,
        againOptions
      );
    } else {
      return bot.sendMessage(
        chatId,
        `Увы ${msg.from.first_name}, ты не отгадал, бот загадал цифпу ${chats[chatId]}`,
        againOptions
      );
    }
  });
};

start();


