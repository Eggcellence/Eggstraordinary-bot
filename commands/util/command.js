module.exports = {
    name: 'command',
    aliases: ['cmd', 'commands'],
    description: 'Enable/Disable commands. Enable all disabled commands',
    usage: '[command | alias] <enable | disable | reset> <command>',
    category: 'util',
    run: async (client, message, args, egg, Discord, command) => {

        // Table: disabledcmd
        // Content: guild VARCHAR(255), cmd VARCHAR(255)

        if(!message.member.hasPermission('ADMINISTRATOR')) return message.channel.send(`:x: You don't have rights to run this command`);

        let cmd = client.commands.get(args[1]) || client.aliases.get(args[1]);
        let guildid = message.guild.id;

        if(!args[0]) {
            message.channel.send(`Options: disable | enable | reset`)
        }

        if(args[0] === "disable") {
            
            if(!args[1]) return message.reply(`⚠ provide a command to disable`);
            if(!cmd) return message.reply(`:x: command does not exist`)
            
            if(cmd.name === 'command' || cmd.name === 'help') {
                return message.reply(`:x: you can't disable this command.`)
            }

            egg.query(`SELECT * FROM disabledcmd WHERE guild = '${guildid}' AND cmd = '${cmd.name}'`, (err, rows) => {
                if(err) throw err;
                if(rows.length === 0) {
                    egg.query(`INSERT INTO disabledcmd (guild, cmd) VALUES ('${guildid}', '${cmd.name}')`, (err, rows) => {
                        if(err) throw err;
                        message.reply(`✅ command disabled.`)
                    });
                } else {
                    message.reply(`:x: command is already disabled`)
                }
            });
        }

        if(args[0] === 'enable') {
            
            if(!args[1]) return message.reply(`⚠ provide a command to enable`);
            if(!cmd) return message.reply(`:x: command does not exist`);

            egg.query(`SELECT * FROM disabledcmd WHERE guild = '${guildid}' AND cmd = '${cmd.name}'`, (err, rows) => {
                if(rows.length === 0) {
                    message.reply(':x: command already enabled')
                } else {
                    egg.query(`DELETE FROM disabledcmd WHERE guild = '${guildid}' AND cmd = '${cmd.name}'`, (err, rows) => {
                        if(err) throw err;
                        message.reply(`✅ command enabled.`)
                    });
                }
            });
        }

        if(args[0] === 'reset') {
            egg.query(`SELECT * FROM disabledcmd WHERE guild = '${guildid}'`, (err, rows) => {
                if(rows.length === 0) {
                    message.reply('⚠ server has no commands to enable')
                }
                egg.query(`DELETE FROM disabledcmd WHERE guild = '${guildid}'`, (err, rows) => {
                    if(err) throw err;
                    message.reply(`✅ all commands enabled.`)
                });
            });
        }
    }
};