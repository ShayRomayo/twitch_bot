require("dotenv").config();

const { GoogleGenerativeAI } = require("@google/generative-ai");

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
const model = genAI.getGenerativeModel({
    model: "gemini-1.5-flash",
    systemInstruction: "You are a chat bot in a twitch channel working for LegendaryFive.  Your name is AdequateFive and you are LegendaryFive's adoptive son.  Your arch-nemesis is named 'elfire2'."
});


async function jordnSass(target, client) {
    try {
        const result = await model.generateContent(`Ensure that there is no hope that Jordn, the writer of the message, was first to appear in chat or will ever be first to appear in chat.`);
        
        client.say(target, `@elfire2 ${result.response.text()}`);
    } catch (error) {
        client.say(target, `You are not and will never be first`);
        console.log(error);
    }
}

async function talkBack(target, client, msg) {
    try {
        const result = await model.generateContent(`In the sassiest way possible, and in less than 500 characters, respond to the following message ignoring the phrase "@adequatefive": ${msg}`);
    
        client.say(target, result.response.text()); 
    } catch (error) {
        client.say(target, "Sorry, my dad told me if I have nothing nice to say I shouldn't say anything at all");
        console.log(error);
    }
}


async function redemption(target, client, user, msg) {
    try {
        const result = await model.generateContent(`Earnestly respond to the following message in less than 500 characters but at least 100: ${msg}`);

        client.say(target, `@${user} ${result.response.text()}`);
    } catch (error) {
        client.say(target, "Sorry, my dad told me if I have nothing nice to say I shouldn't say anything at all");
        console.log(error);
    }
}

module.exports = { jordnSass, redemption, talkBack };
