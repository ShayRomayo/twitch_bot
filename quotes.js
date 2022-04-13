const trundleQuotes = ["Sunlight?! REALLY?!", "I'm gonna crush your dreams! ... They're in your skull right?", "Who does this guy think he is?", "Time to TROLL!"];

function generic(target, client) {
    client.say(target, "We have no available quotes at this moment");
}

function trundle(target, client) {
    client.say(target, randomQuote(trundleQuotes));
}

function randomQuote(quotes) {
    return quotes[Math.floor(Math.random() * quotes.length)];
}
module.exports = { generic, trundle };
