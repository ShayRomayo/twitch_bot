require("dotenv").config();

const tmi = require("tmi.js");
const express = require("express");
const socket = require('socket.io');
const app = express();

const first = require("./first.js");
const basicText = require("./basicTextCommands.js");
const backSass = require("./backSass.js");
const halloween = require("./halloween.js");
const quotes = require("./quotes.js");
const swearJar = require("./swearJar.js");
const pg = require("pg");

const BOT_USERNAME = process.env.BOT_USERNAME;
const OAUTH_TOKEN = process.env.OAUTH_TOKEN;
const CHANNEL_NAME = process.env.CHANNEL_NAME;

// Define configuration options
const botOpts = {
    identity: {
        username: BOT_USERNAME,
        password: OAUTH_TOKEN,
    },
    channels: [CHANNEL_NAME],
};

const pgOpts = {
    user: "postgres",
    host: "localhost",
    database: "twitch_bot",
    password: "postgres",
    port: 5432,
};

// Create a server running our p5 code on predefined port (or port 3000)
var server = app.listen(process.env.PORT || 3000);
console.log(`Running at port `, process.env.PORT || 3000);
app.use(express.static('p5'));

// Create a socket handler
var io = socket(server);

//Register our event handlers
io.sockets.on("connection", onSocketConnection);

// Create a client with our options
const client = new tmi.client(botOpts);

// Register our event handlers (defined below)
client.on("message", onMessageHandler);
client.on("connected", onConnectedHandler);

// Connect to Twitch:
client.connect();

const pgClient = new pg.Client(pgOpts);
pgClient.connect();

// Called every time a message comes in
function onMessageHandler(target, context, msg, self) {
    if (self) {
        return;
    } // Ignore messages from the bot

    // Remove trailing whitespace and split on all whitespace
    const commandArgs = msg.trim().split(/[\s]+/);
    const commandName = commandArgs[0].toLowerCase();

    // If the command is known, let's execute it
    if (commandName === "first") {
        first.command(target, context, client);
    }
    if (msg.toLowerCase().includes("@adequatefive")) {
        backSass.talkBack(target, context, client);
    }
    if (commandName.charAt(0) === "!") {
        // if (commandName === "!boo") {
        //     if (context.mod || context.username === 'legendaryfive') {
        //         var numTricks = 1
        //         if (commandArgs.length > 1 && !isNaN(+commandArgs[1])) {
        //             numTricks = +commandArgs[1];
        //         }
        //         halloween.addTrickOrTreaters(target, client, pgClient, numTricks);
        //     }
        // }
        // if (commandName === "!burfday") {
        //     basicText.birthday(target, client);
        // }
        if (commandName === "!bye") {
            if (commandArgs.length > 1) {
                basicText.toodaloo(target, client, commandArgs[1]);
            } else {
                basicText.toodaloo(target, client);
            }
        }
        if (commandName === "!gfsword") {
            basicText.gfsword(target, client);
        }
        if (commandName === "!hug") {
            if (!!commandArgs[1]) {
                basicText.hug(target, context, client, commandArgs[1]);
            } else {
                client.say(target, "You have to hug someone silly!");
            }
        }
        if (commandName === "!discord") {
            basicText.joinDiscord(target, client);
        }
        if (commandName === "!language") {
            if (context.mod) {
                swearJar.addToJar(target, client, pgClient);
            }
        }
        if (commandName === "!lurk") {
            basicText.lurk(target, context, client);
        }
        if (commandName === "!playlist") {
            basicText.playlist(target, client);
        }
        if (commandName === "!quote") {
            if (!commandArgs[1]) {
                quotes.generic(target, client);
            } else if (commandArgs[1].toLowerCase() === "trundle") {
                quotes.trundle(target, client, commandArgs[2]);
            }
        }
        if (commandName === "!raid") {
            basicText.subRaidMessage(target, client);
        }
        if (commandName === "!raid2") {
            basicText.followRaidMessage(target, client);
        }
        if (commandName === "!socials") {
            basicText.listSocials(target, client);
        }
        if (commandName === "!swearjar") {
            swearJar.displayJar(target, client, pgClient);
        }
        if (commandName === "!color") {
            io.emit('changeColor', "Generate random color");
        }
    }
}

// Called every time a socket connects to the websocket server
function onSocketConnection(socket) {
    console.log("New connection: " + socket.id);
}

// Called every time the bot connects to Twitch chat
function onConnectedHandler(addr, port) {
    console.log(`* Connected to ${addr}:${port}`);

    /*
        Call someFile.js
            (Ping the database [commandNames, quotes -tagged i.e. Trundle -Generic])
    */
}
