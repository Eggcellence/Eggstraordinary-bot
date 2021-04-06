
module.exports = (client, message, args, egg, Discord, command) => {

    const guildid = message.guild.id;

    egg.query(`SELECT * FROM disabledcmd WHERE guild = '${guildid}' AND cmd = '${command.name}'`, (err, rows) => {
        if(err) return message.channel.send(`⚠ - Code: ${err.code} - Please message the developer with the code`);
        if(rows.length !== 0) {
            return message.reply(":x: an admin has disabled this command for this server").then(m => m.delete({timeout: 5000}));
        } else {
            command.run(client, message, args, egg, Discord, command);
        }
    });
}