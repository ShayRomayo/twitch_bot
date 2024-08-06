require("dotenv").config();

const websocket = require("ws");

const tmi = require("tmi.js");
const express = require("express");
const socket = require('socket.io');
const app = express();
const axios = require("axios");

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
const BROADCASTER_ID = process.env.BROADCASTER_USER_ID;
const USER_ACCESS_TOKEN = process.env.USER_ACCESS_TOKEN;
const CLIENT_ID = process.env.CLIENT_ID;

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

const eventsubOpts = {
    "type": "channel.channel_points_custom_reward_redemption.add",
    "version": "1",
    "condition": {
        "broadcaster_user_id": BROADCASTER_ID.toString(),
    },
    "transport": {
        "method": "websocket",
        "session_id": "None"
    }
}

const eventsubHeaders = {
    headers: {
        "Authorization": "Bearer " + USER_ACCESS_TOKEN,
        "Client-Id": CLIENT_ID,
        "Content-Type": "application/json"
    }
}
// Create a server running our p5 code on predefined port (or port 3000)
var server = app.listen(process.env.PORT || 3000);
console.log(`Running at port `, process.env.PORT || 3000);
app.use(express.static('p5'));

// Create a socket handler
    // TODO: Add OBS Websocket to this server
var io = socket(server);

//Register our event handlers
io.sockets.on("connection", onSocketConnection);

// Create an eventsub websocket client
const ws = new websocket.WebSocket("wss://eventsub.wss.twitch.tv/ws");

// Event handlers for ws client
ws.on("error", console.error);

ws.on("message", onEventsubMessageHandler);

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
        if (commandName === "!nathan") {
            basicText.nathan(target, context, client);
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
        if (commandName === "!color" && context.mod) {
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

function onEventsubMessageHandler(message) {
    var data = JSON.parse(message);
    if (data.metadata.message_type === "session_welcome") {
        eventsubOpts.transport.session_id = data.payload.session.id;
        axios.post("https://api.twitch.tv/helix/eventsub/subscriptions", eventsubOpts, eventsubHeaders)
            .then((res) => {
                console.log("Response: " + res.toString());
            })
            .catch((err) => {
                console.log(`Error: ${err}`);
            });
    } else if (data.metadata.message_type === "notification") {
        if (data.payload.subscription.type === "channel.channel_points_custom_reward_redemption.add") {
            if (data.payload.event.reward.title === "Change Color Box") {
                io.emit('changeColor', "Generate random color");
            } else {
                console.log(`Redemption of ${data.payload.event.reward.title}`);
            }
        }
    } else {
        console.log(`Received: ${data.metadata.message_type}`);
    }
}
