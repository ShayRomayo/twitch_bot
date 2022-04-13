require('dotenv').config();

const tmi = require('tmi.js');
const first = require('./first.js');
const basicText = require('./basicTextCommands.js');
const backSass = require('./backSass.js');

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

  // Remove trailing whitespace and split on all whitespace
  const commandArgs = msg.trim().split(/[\s]+/);
  const commandName = commandArgs[0].toLowerCase();

  // If the command is known, let's execute it
  if (commandName === 'first') {
    first.command(target, context, client);
  }
  if (msg.toLowerCase().includes("@adequatefive")) {
      backSass.talkBack(target, context, client);
  }
  if (commandName.charAt(0) === '!') {
    if (commandName === '!gfsword') {
        basicText.gfsword(target, client);
    } if (commandName === '!hug') {
        if (!!commandArgs[1]) {
            basicText.hug(target, context, client, commandArgs[1]);
        } else {
            client.say(target, "You have to hug someone silly!");
        }
    } if (commandName === '!discord') {
        basicText.joinDiscord(target, client);
    } if (commandName === '!lurk') {
        basicText.lurk(target, context, client);
    } if (commandName === '!playlist') {
        basicText.playlist(target, client);
    }
  }
}

// Called every time the bot connects to Twitch chat
function onConnectedHandler (addr, port) {
  console.log(`* Connected to ${addr}:${port}`);
}
