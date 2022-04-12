require('dotenv').config();

const tmi = require('tmi.js');
const first = require('./first.js');

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
  
  // If the command is known, let's execute it
  if (commandArgs[0] === 'first') {
      first.command(target, context, client);
  }
}

// Called every time the bot connects to Twitch chat
function onConnectedHandler (addr, port) {
  console.log(`* Connected to ${addr}:${port}`);
}
