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
        "Join my not so brand new discord here: https://discord.gg/NwEajuPZ97"
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
function listSocials(target, client) {
    client.say(
        target,
        "Follow me! (fyi densetsunogo is LegendaryFive in Japanese cuz they were taken lol) GivePLZ Instagram: instagram.com/densetsunogo TakeNRG GivePLZ Twitter: twitter.com/densetsunogo TakeNRG GivePLZ Tik Tok: tiktok.com/DensetsuNoGo TakeNRG GivePLZ YouTube: youtube.com/@LegendFive TakeNRG"
    );
}

function subRaidMessage(target, client) {
    client.say(
        target,
        "legend866WUT legend866WUT LEGENDARY IS CRASHING THE PARTY legend866EARTHQUAKE legend866EARTHQUAKE LEGENDARY HYYYPPPEE legend866WUT legend866WUT LEGENDARY IS CRASHING THE PARTY legend866EARTHQUAKE legend866EARTHQUAKE LEGENDARY HYYYPPPEE legend866WUT  legend866WUT LEGENDARY IS CRASHING THE PARTY legend866EARTHQUAKE legend866EARTHQUAKE LEGENDARY HYYYPPPEE "
    );
}

function followRaidMessage(target, client) {
    client.say(
        target,
        "TwitchSings SingsNote SingsMic SingsNote SingsMic TwitchSings GivePLZ LEGENDARY IS CRASHING THE PARTY TakeNRG TwitchSings SingsNote SingsMic SingsNote SingsMic TwitchSings GivePLZ WAVE UR HANDS IN THE AIR LIKE U JUST DONT CARE TakeNRG TwitchSings SingsNote SingsMic SingsNoteSingsMic TwitchSings GivePLZ LEGENDARY IS CRASHING THE PARTY TakeNRG TwitchSings SingsNote SingsMic SingsNote SingsMic TwitchSings"
    );
}

function toodaloo(target, client) {
    client.say(target, "TOOOOOODAAAAAAAAALLLLOOOOOOOOOOOOOOOOO");
}

function toodaloo(target, client, byeTarget) {
    client.say(target, `TOOOOOODAAAAAAAAALLLLOOOOOOOOOOOOOOOOO ${byeTarget}`);
}
/* TODO: Features/Command ides
        !uptime
*/

module.exports = {
    gfsword,
    hug,
    joinDiscord,
    lurk,
    playlist,
    listSocials,
    subRaidMessage,
    followRaidMessage,
    toodaloo,
};
