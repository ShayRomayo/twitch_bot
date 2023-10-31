function addTrickOrTreaters(target, client, pgClient, value) {
  
    pgClient
        .query(
            `UPDATE public.count_dracula SET total = total + ${value} WHERE service = 'trick_or_treaters'`
        )
        .then((res) =>
            client.say(target, "Oh wow! We got ${value} trick or treater(s)!")
        )
        .catch((e) => console.error(e.stack));
}

function displayTrickOrTreaters(target, client, pgClient) {
    pgClient
        .query(
            "SELECT total FROM public.count_dracula WHERE service = 'trick_or_treaters'"
        )
        .then((res) =>
            client.say(
                target,
                `We've had ${res.rows[0].total} trick or treaters so far`
            )
        )
        .catch((e) => console.error(e.stack));
}

module.exports = { addTrickOrTreaters, displayTrickOrTreaters };