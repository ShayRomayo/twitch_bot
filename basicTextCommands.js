function hug(target, context, client, hugTarget) {
    client.say(
        target,
        `${context.username} gives GivePLZ  ${hugTarget} TakeNRG  a warm hug <3`
    );
}

function gfsword(target, client) {
    client.say(
        target,
        "@erincanada16 is my girlfriend/moderator/manager, she has the power!"
    );
}

function joinDiscord(target, client) {
    client.say(
        target,
        "Join my brand new discord here: https://discord.gg/NwEajuPZ97"
    );
}

function lurk(target, context, client) {
    client.say(target, `Thanks @${context.username} for lurking!`);
}

function playlist(target, client) {
    client.say(
        target,
        "I mostly play an artist called Blu Velvet.  Check them out on Spotify here: https://open.spotify.com/artist/4GhQUESEKnWAUS4d9pcSS8?si=fNRpG_yCT4asUkZ6n7KtVw"
    );
}

module.exports = { gfsword, hug, joinDiscord, lurk, playlist };
