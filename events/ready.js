module.exports = (client) => {
    console.log(`${client.user.username}!`)
    client.user.setActivity(`🥚`)
}