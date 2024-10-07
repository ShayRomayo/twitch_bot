var textCommands;

function hug(target, context, client, hugTarget) {
    client.say(
        target,
        `${context.username} gives GivePLZ  ${hugTarget} TakeNRG  a warm hug <3`
    );
}

function lurk(target, context, client) {
    client.say(target, `Thanks for lurking!`);
}

function toodaloo(target, client) {
    client.say(target, "TOOOOOODAAAAAAAAALLLLOOOOOOOOOOOOOOOOO");
}

function toodaloo(target, client, byeTarget) {
    client.say(target, `TOOOOOODAAAAAAAAALLLLOOOOOOOOOOOOOOOOO ${byeTarget}`);
}

function birthday(target, client) {
    client.say(target, "Everyone wish a happy (early) birthday to the all powerful GF Sword @erincanada16");
}

function nathan(target, context, client) {
    if (context.username === "erincanada16") {
        client.say(target, "Gosh darn it Nathan!");
    } else {
        client.say(target, "God damn it Nathan!");
    }
}

async function createTextCommand(target, context, client, pgClient, message) {
    // Create
}

function exectueTextCommand(target, context, client, textCommand) {
    if(textCommand.tag_caller) {
        client.say(target, `@${context.username} ${textCommand.message}`)
    } else {
        client.say(target, `${textCommand.message}`);
    }
}

async function retrieveTextCommands(pgClient) {
    const result = await pgClient.query('SELECT * FROM public.text_commands');

    return result.rows;
}

async function toggleCommand(enabled) {
    if (enabled === undefined) {
        // Update is_active to the value that it's not
    } else {
        // Update is_actiave to the value provided
    }
}
/* TODO: Features/Command ides
        !uptime
*/

module.exports = {
    birthday,
    hug,
    lurk,
    toodaloo,
    nathan,
    createTextCommand,
    exectueTextCommand,
    retrieveTextCommands,
    toggleCommand
};
