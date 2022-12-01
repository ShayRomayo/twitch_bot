function talkBack(target, context, client) {
    client.say(
        target,
        `@${context.username} I'm a bot, pay attention to the streamer`
    );
}

module.exports = { talkBack };
