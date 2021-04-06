module.exports = {
    name: 'levelmessage',
    description: 'Disable message that gets sent when a user levels up',
    usage: '[command]',
    aliases: ['lvlmsg'],
    category: 'util',
    run: async (client, message, args, egg, Discord) => {

        if (!message.member.hasPermission('ADMINISTRATOR')) return message.channel.send(`:x: You don't have rights to run this command`).then(m => m.delete({timeout: 5000}));

        // Guild
        const guildid = message.guild.id;

        // SQL queries
        const mainSQL = `SELECT * FROM disablemsg WHERE guild = ${guildid}`;
        const disableSQL = `INSERT INTO disablemsg (guild, msg) VALUES (${guildid}, 1)`;
        const enableSQL = `DELETE FROM disablemsg WHERE guild = ${guildid}`;

        if (args[0] === 'disable') {
            egg.query(mainSQL, (err, rows) => {
                if (err) errorMessage(err)
                if (rows.length === 0) {
                    egg.query(disableSQL, (err, rows) => {
                        if (err) errorMessage(err)
                        message.channel.send('✅ Leveling message is now disabled')
                    });
                } else {
                    if (rows[0] === 1) {
                        message.channel.send('⚠ Leveling message is already disabled for this server')
                    }
                }
            });
        }

        if (args[0] === 'enable') {
            egg.query(mainSQL, (err, rows) => {
                if (rows.length === 0) {
                    message.channel.send('⚠ Leveling message is already enabled')
                } else {
                    egg.query(enableSQL, (err, rows) => {
                        if (err) errorMessage(err)
                        message.channel.send('✅ Leveling message is now enabled.')
                    });
                }
            });
        }

        message.channel.send(`\`e!lvlmsg <enable/disable>\` - disable leveling message`)

        function errorMessage(err) {
            message.reply(`⚠ - Code: ${err.code} - Please message the developer with the code`);
        }

    }
};