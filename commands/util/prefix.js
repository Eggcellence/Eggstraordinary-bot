module.exports = {
    name: 'prefix',
    description: 'Change the prefix of the bot',
    usage: '[command] <prefix>',
    category: 'util',
    owner: false,
    run: async (client, message, args, egg, Discord) => {
        
        if(!message.member.hasPermission('ADMINISTRATOR')) return message.channel.send(`:x: You don't have rights to run this command`);

        // Guild/Prefix
        const guildid = message.guild.id;
        let prefix = args[0];
        let regex = new RegExp(/[�()"{}[]|]/g);
        
        // SQL Queries
        const mainSQL = `SELECT * FROM prefix WHERE guild = ${guildid}`;
        const insertSQL = `INSERT INTO prefix (guild, prefix) VALUES ('${guildid}', '${prefix}')`;
        const updateSQL = `UPDATE prefix SET prefix = '${prefix}' WHERE guild = '${guildid}'`;

        if(!prefix) {
            return egg.query(mainSQL, (err, rows) => {
                if (err) errorMessage(err)
                console.log(rows)
                if(rows.length === 0) {
                    message.reply(`prefix for \`${message.guild.name}\` is \`e!\``)
                } else {
                    message.reply(`prefix for \`${message.guild.name}\` is \`${rows[0].prefix}\``)
                }
            });
        }

        if(regex.test(prefix) === true) return message.reply(':x: illegal characters in argument')

        egg.query(mainSQL, (err, rows) => {
            if (err) errorMessage(err)
            if(rows.length === 0) {
                egg.query(insertSQL, (err) => {
                    if (err) errorMessage(err)
                    message.reply(`new prefix set: \`${prefix}\``)
                });
            } else {
                egg.query(updateSQL, (err) => {
                    if (err) errorMessage(err)
                    message.reply(`new prefix set: \`${prefix}\``)
                });
            }
        });

        function errorMessage(err) {
            message.reply(`⚠ - Code: ${err.code} - Please message the developer with the code`);
        }

    }
};