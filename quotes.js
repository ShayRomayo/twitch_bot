const genericQuotes = ["Gaslight! Gatekeep! GIRLBOSS!", "Live! Laugh! Love!"];
const trundleQuotes = [
    "Sunlight?! REALLY?!",
    "I'm gonna crush your dreams! ... They're in your skull right?",
    "Who does this guy think he is?",
    "Time to TROLL!",
];

function generic(target, client) {
    client.say(target, randomQuote(genericQuotes));
}

function trundle(target, client, quoteId = "random") {
    if (isNaN(quoteId)) {
        client.say(target, randomQuote(trundleQuotes));
    } else if (quoteId <= 0 || quoteId > trundleQuotes.length) {
        client.say(target, `Pick a quote numbered 1-${trundleQuotes.length}`);
    } else {
        client.say(target, trundleQuotes[quoteId - 1]);
    }
}

function randomQuote(quotes) {
    return quotes[Math.floor(Math.random() * quotes.length)];
}
module.exports = { generic, trundle };
