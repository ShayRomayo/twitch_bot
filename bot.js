require("dotenv").config();

const websocket = require("ws");

const tmi = require("tmi.js");
const express = require("express");
const socket = require('socket.io');
const app = express();
const axios = require("axios");
const fs = require("fs");
const os = require("os");

const first = require("./first.js");
const basicText = require("./basicTextCommands.js");
const genAI = require("./genAI.js");
const halloween = require("./halloween.js");
const quotes = require("./quotes.js");
const swearJar = require("./swearJar.js");
const pg = require("pg");

// dot env constants
const BOT_USERNAME = process.env.BOT_USERNAME;
const OAUTH_TOKEN = process.env.OAUTH_TOKEN;
const CHANNEL_NAME = process.env.CHANNEL_NAME;
const BROADCASTER_ID = process.env.BROADCASTER_USER_ID;
const USER_ACCESS_TOKEN = process.env.USER_ACCESS_TOKEN;
const REFRESH_TOKEN = process.env.REFRESH_TOKEN;
const CLIENT_ID = process.env.CLIENT_ID;
const CLIENT_SECRET = process.env.CLIENT_SECRET;

// other const values
const loyaltyInterval = 10 * 60 * 1000 // 10 minutes
// const loyaltyInterval = 10 * 1000 // 10 seconds for testing
const loyaltyExemptUsers = ['737322970', '30079871', '100135110'];

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

const twitchApiHeaders = {
    headers: {
        "Authorization": "Bearer " + USER_ACCESS_TOKEN,
        "Client-Id": CLIENT_ID,
        "Content-Type": "application/json"
    }
}

const eventsubRefreshOpts = {
    "client_id": CLIENT_ID,
    "client_secret": CLIENT_SECRET,
    "grant_type": "refresh_token",
    "refresh_token": REFRESH_TOKEN
}

const eventsubRefreshHeaders = {
    "Content-Type": "application/x-www-form-urlencoded"
}

// Helper function for rewriting environment values such as on use of refresh token
function setEnvValue(key, value) {

    // read file from hdd & split if from a linebreak to a array
    const ENV_VARS = fs.readFileSync("./.env", "utf8").split(os.EOL);

    // find the env we want based on the key
    const target = ENV_VARS.indexOf(ENV_VARS.find((line) => {
        return line.match(new RegExp(key));
    }));

    // replace the key/value with the new value
    ENV_VARS.splice(target, 1, `${key}=${value}`);

    // write everything back to the file system
    fs.writeFileSync("./.env", ENV_VARS.join(os.EOL));

}

function eventsubConnectWebsocket(userAccessToken) {
    twitchApiHeaders.headers.Authorization = "Bearer " + userAccessToken;
    axios.post("https://api.twitch.tv/helix/eventsub/subscriptions", eventsubOpts, twitchApiHeaders)
        .then((res) => {
            console.log("Response: " + res.toString());
        })
        .catch((err) => {
            console.log(`Error: ${err}`);
            if (err.response.status == 401) {
                axios.post("https://id.twitch.tv/oauth2/token", eventsubRefreshOpts, eventsubRefreshHeaders)
                .then((res) => {
                    setEnvValue("USER_ACCESS_TOKEN", res.data.access_token);
                    setEnvValue("REFRESH_TOKEN", res.data.refresh_token);
                    eventsubConnectWebsocket(res.data.access_token);
                })
                .catch((err) => {
                    console.log(err);
                })
            }
        });
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
ws.on("error", onEventsubErrorHandler);

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

let textCommands;
let textCommandNames = [];

// Retrieve all the stored text commands from database
basicText.retrieveTextCommands(pgClient).then(res => {
    textCommands = res;
    textCommandNames = res.map((val) => {
        return val.func_name;
    })
});

let loyaltyFiveMembers = [];
let loyaltyFiveRoster = [];
pgClient.query('SELECT user_id, user_login, legendary_points FROM public.loyalty_five')
    .then((result) => {
        loyaltyFiveRoster = result.rows;
        result.rows.forEach((member) => {
            loyaltyFiveMembers.push(member.user_id);
        })
    })

var loyalty = setInterval(loyaltyProgram, loyaltyInterval);

async function loyaltyProgram() {
    axios.get(`https://api.twitch.tv/helix/chat/chatters?broadcaster_id=${BROADCASTER_ID}&moderator_id=${BROADCASTER_ID}`, twitchApiHeaders)
        .then((res) => {
            res.data.data.filter((user) => !loyaltyExemptUsers.includes(user.user_id)).forEach(user => {
                updatePoints(user.user_id, user.user_login, user.user_name, 10);
            });
        })
        .catch((err) => {
            console.log(err);
        })
}

function getActiveMember(userId) {
    for (let i = 0 ; i < loyaltyFiveRoster.length ; i++) {
        if (loyaltyFiveRoster[i].user_id == userId) {
            return loyaltyFiveRoster[i];
        }
    }
    return null;
}

function updatePoints(userId, userLogin, userName, points) {
    if (loyaltyFiveMembers.includes(userId)) {
        loyaltyFiveRoster.forEach((member) => {
            if (member.user_id == userId) {
                member.legendary_points += points;
            }
        })
        pgClient.query(`UPDATE public.loyalty_five SET legendary_points = legendary_points + ${points} WHERE user_id = '${userId}'`)
            .then((res) => {
                console.log(`${userName} just received ${points} loyalty points!`);
            });
    } else {
        pgClient.query(`INSERT INTO public.loyalty_five VALUES ('${userId}', '${userLogin}', 100)`)
        .then((res) => {
            loyaltyFiveMembers.push(userId);
            loyaltyFiveRoster.push({user_id: userId, user_login: userLogin, legendary_points: 100});
            console.log(`${userName} is now a Loyalty Five member!`);
        });
    }
}

// Called every time a message comes in
function onMessageHandler(target, context, msg, self) {
    if (self) {
        return;
    } // Ignore messages from the bot

    // Remove trailing whitespace and split on all whitespace
    const commandArgs = msg.trim().split(/\s+/);
    const commandName = commandArgs[0].toLowerCase().substring(1);

    // If the command is known, let's execute it
    if (commandArgs[0] === "first" && context.username === "elfire2") {
        genAI.jordnSass(target, client);
    }
    if (msg.toLowerCase().includes("@adequatefive")) {
        genAI.talkBack(target, client, msg);
    }
    if (commandArgs[0].charAt(0) === "!") {
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
        if (commandName === "bye") {
            if (commandArgs.length > 1) {
                basicText.toodaloo(target, client, commandArgs[1]);
            } else {
                basicText.toodaloo(target, client);
            }
        }
        if (commandName === "hug") {
            if (!!commandArgs[1]) {
                basicText.hug(target, context, client, commandArgs[1]);
            } else {
                client.say(target, "You have to hug someone silly!");
            }
        }
        if (commandName === "language") {
            if (context.mod) {
                swearJar.addToJar(target, client, pgClient);
            }
        }
        if (commandName === "lurk") {
            basicText.lurk(target, context, client);
        }
        if (commandName === "quote") {
            if (!commandArgs[1]) {
                quotes.generic(target, client);
            } else if (commandArgs[1].toLowerCase() === "trundle") {
                quotes.trundle(target, client, commandArgs[2]);
            }
        }
        if (commandName === "nathan") {
            basicText.nathan(target, context, client);
        }
        if (commandName === "swearjar") {
            swearJar.displayJar(target, client, pgClient);
        }
        if (commandName === "logo" && (context.username === "legendaryfive" || context.username === "erincanada16")) {
            io.emit('activateLogo', "Show logo for 30 more seconds");
        }
        if (commandName === "loyalty") {
            let loyaltyMember = getActiveMember(context['user-id']);
            if (loyaltyMember == null) {
                client.say(target, `@${context.username} You are not a member yet`);
            } else {
                client.say(target, `@${context.username} You have ${loyaltyMember.legendary_points} legendary points`);
            }
        }
        if (commandName === "gamba") {
            if (commandArgs.length < 2) {
                client.say(target, 'You must provide a bet');
            } else {
                let bet = parseInt(commandArgs[1].toString());
                if (isNaN(bet)) {
                    client.say(target, "That's not a valid bet");
                } else {
                    let better = getActiveMember(context['user-id']);
                    if (better == null || better.legendary_points < bet) {
                        client.say(target, `@${context.username} You do not have enough legendary points`);
                    } else {
                        io.emit('spinWheel', [context.username, context['user-id'], context['display-name'], bet]);
                    }
                }
            }
        }
        if (textCommandNames.includes(commandName)) {
            const textCommand = textCommands.find((val) => {
                return val.func_name === commandName;
            });
            if (textCommand.is_active) {
                basicText.exectueTextCommand(target, context, client, textCommand);
            }
        }
    }
}

// Called every time a socket connects to the websocket server
function onSocketConnection(socket) {
    socket.on('successfulGamble', (res) => {
        console.log(`succeeded with ${res}`);
        let formatText;
        if (res[3] < 0) {
            formatText = `@${res[0]} lost ${-res[3]} legendary points`;
        } else if (res[3] == 0) {
            formatText = `@${res[0]} went even.`;
        } else {
            formatText = `@${res[0]} won ${res[3]} legendary points`;
        }
        updatePoints(res[1], res[2], res[0], res[3]);
        client.say(CHANNEL_NAME, formatText);
        socket.emit('clearSlots', "Clear slots and prepare to hide");
    })
    socket.on('failedGamble', (res) => {
        client.say(CHANNEL_NAME, `@${res[0]} wait your turn for gamba!`)
    })
    console.log("New connection: " + socket.id);
}

// Called every time the bot connects to Twitch chat
function onConnectedHandler(addr, port) {
    console.log(`* Connected to ${addr}:${port}`);
}

function onEventsubMessageHandler(message) {
    var data = JSON.parse(message);
    if (data.metadata.message_type === "session_welcome") {
        eventsubOpts.transport.session_id = data.payload.session.id;
        eventsubConnectWebsocket(USER_ACCESS_TOKEN);
    } else if (data.metadata.message_type === "notification") {
        let event = data.payload.event;
        if (data.payload.subscription.type === "channel.channel_points_custom_reward_redemption.add") {
            if (event.reward.title === "Ask AdequateFive a Question") {
                genAI.redemption(`#${data.payload.event.broadcaster_user_login}`, client, data.payload.event.user_name, data.payload.event.user_input);
            } else if (event.reward.title === "WUT for 30 Seconds") {
                io.emit('activateLogo', "Show logo for 30 more seconds");
            } else if (event.reward.title === "Buy Legendary Points") {
                updatePoints(event.user_id, event.user_login, event.user_name, 100);
            } else {
                console.log(`Redemption of "${data.payload.event.reward.title}"`);
            }
        }
    } else {
        console.log(`Received: ${data.metadata.message_type}`);
    }
}

function onEventsubErrorHandler(error) {
    console.log(error);
}
