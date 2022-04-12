require('dotenv').config();

const tmi = require('tmi.js');

const BOT_USERNAME = process.env.BOT_USERNAME;
const OATH_TOKEN = process.env.OATH_TOKEN;
const CHANNEL_NAME = process.env.CHANNEL_NAME;
// Define configuration options
const opts = {
  identity: {
    username: BOT_USERNAME,
    password: OATH_TOKEN
  },
  channels: [
    CHANNEL_NAME
  ]
};

// Create a client with our options
const client = new tmi.client(opts);

// Register our event handlers (defined below)
client.on('message', onMessageHandler);
client.on('connected', onConnectedHandler);

// Connect to Twitch:
client.connect();

// Called every time a message comes in
function onMessageHandler (target, context, msg, self) {
  if (self) { return; } // Ignore messages from the bot

  // Remove whitespace from chat message
  const commandName = msg.trim();

  // If the command is known, let's execute it
  // if (commandName === '!dice') {
  //   const num = rollDice();
  //   client.say(target, `You rolled a ${num}`);
  //   console.log(`* Executed ${commandName} command`);
  // }
  if (commandName === '!test') {
      first(client, context);
  } else {
    var messageArray = msg.split(' ');
    console.log(context.username);
  }
}

// Function called when the "dice" command is issued
function rollDice () {
  const sides = 6;
  return Math.floor(Math.random() * sides) + 1;
}

// Called every time the bot connects to Twitch chat
function onConnectedHandler (addr, port) {
  console.log(`* Connected to ${addr}:${port}`);
}
