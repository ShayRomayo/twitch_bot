require("dotenv").config();

const { GoogleGenerativeAI } = require("@google/generative-ai");

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
const model = genAI.getGenerativeModel({
    model: "gemini-1.5-flash"
});


async function sarcasmLevel(target, client, msg) {
    const result = await model.generateContent(`Rate the following message between 0% and 110% for how sarcastic it is intended to be.  Return only the percentage. \\n Message: ${msg}`);

    client.say(target, `This message is ${result.response.text()} sarcastic.`);
}

async function aiJordnSass(target, client) {
    const result = await model.generateContent(`Ensure that there is no hope that Jordn, the writer of the message, was first to appear in chat or will ever be first to appear in chat.`);
    
    client.say(target, `@elfire2 ${result.response.text()}`);
}

async function aiTalkBack(target, client, msg) {
    const result = await model.generateContent(`In the sassiest way possible, and in less than 500 characters, respond to the following message: ${msg}`);

    client.say(target, result.response.text()); 
}

function talkBack(target, context, client) {
    client.say(
        target,
        `@${context.username} I'm a bot, pay attention to the streamer`
    );
}

module.exports = { aiJordnSass, aiTalkBack, sarcasmLevel, talkBack };
