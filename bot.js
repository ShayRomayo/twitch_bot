require('dotenv').config();

const tmi = require('tmi.js');
const first = require('./first.js');
const basicText = require('./basicTextCommands.js');
const backSass = require('./backSass.js');
const quotes = require('./quotes.js');
const swearJar = require('./swearJar.js');
const pg = require('pg');

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

const host = 'localhost';
const user = 'postgres';
const db = 'twitch_bot';
const pw = 'postgres';
const port = 5432;
const pgClient = new pg.Client({
    user: user,
    host: host,
    database: db,
    password: pw,
    port: 5432
});
pgClient.connect();

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
    } if (commandName === '!language') {
        swearJar.addToJar(target, client, pgClient);
    } if (commandName === '!lurk') {
        basicText.lurk(target, context, client);
    } if (commandName === '!playlist') {
        basicText.playlist(target, client);
    } if (commandName === '!quote') {
        if (!commandArgs[1]) {
            quotes.generic(target, client);
        }
        else if (commandArgs[1].toLowerCase() === 'trundle') {
            quotes.trundle(target, client, commandArgs[2]);
        }
    } if (commandName === '!swearjar') {
        swearJar.displayJar(target, client, pgClient);
    }
  }
}

// Called every time the bot connects to Twitch chat
function onConnectedHandler (addr, port) {
  console.log(`* Connected to ${addr}:${port}`);
}
