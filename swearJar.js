function addToJar(target, client, pgClient) {
    pgClient.query("UPDATE public.count_dracula SET total = total + 1 WHERE service = 'swear_jar'")
        .then(res => client.say(target, 'Put another penny in the swear jar!'))
        .catch(e => console.error(e.stack));
}

function displayJar(target, client, pgClient) {
    pgClient.query("SELECT total FROM public.count_dracula WHERE service = 'swear_jar'")
        .then(res => client.say(target, `There are ${res.rows[0].total} pennies in the swear jar`))
        .catch(e => console.error(e.stack));
}

module.exports = { addToJar, displayJar}
