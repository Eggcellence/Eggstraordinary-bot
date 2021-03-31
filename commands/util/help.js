const fs = require("fs")
module.exports = {
    name: "help",
    aliases: ['h'],
    description: "Help desk. View all categories and commands",
    usage: '[command | alias] + command + command name',
    owner: false,
    category: "util",
    run: async (client, message, args, egg, Discord) => {
        let guildid = message.guild.id;
        let help;
        egg.query(`SELECT * FROM prefix WHERE guild = '${guildid}'`, (err, rows) => {

            if (err) return message.reply(`⚠ - Code: ${err.code} - Please message the developer with the code`);
            if (rows.length === 0) {
                help = 'e!help';
            } else {
                help = `${rows[0].prefix}help`;
            }

            if (args[0]) {

                if (args[0] === 'cmd') {
                    if (!args[1]) return message.reply('⚠ please include a command')
                    const cmd = args[1].toLowerCase();
                    let command = client.commands.get(cmd)
                    if (!command) return message.reply(':x: command does not exist')
                    const embed = new Discord.MessageEmbed()
                        .setTitle(`Command help for ${command.name}`)
                        .setDescription(`**❯ Description:** ${command.description || 'None'}
                        \n**❯ Category:** ${command.category || 'Not sorted'}\n**❯ Usage:** ${command.usage || `No specific usage`}\n**❯ Alias(es):** ${command.aliases || 'No aliases'}\n**❯ Dev only:** ${command.owner = true ? 'No' : 'Yes'}`)
                        .setColor('YELLOW')
                        .setThumbnail(client.user.avatarURL())
                    message.channel.send(embed)
                } else {
                    const cat = args[0].toLowerCase();
                    try {
                        let cats = fs.readdirSync(`./commands/${cat}/`).filter((file) => file.endsWith('.js'));
                        let files = ''
                        cats.forEach(e => {
                            files += `\`${e.slice(0, -3)}\`\n`
                        });
                        const embed = new Discord.MessageEmbed()
                            .setTitle(`${args[0].toLowerCase()} | Help Desk`)
                            .setDescription(files)
                            .setFooter(`${help} cmd <command>`)
                            .setThumbnail(client.user.avatarURL())
                            .setColor("YELLOW")

                        message.channel.send(embed)
                    } catch (err) {
                        message.reply(':x: category does not exist')
                    }
                }

            } else {
                let cats = ''
                client.categories.forEach(c => {
                    cats += `${help} \`${c}\`\n`
                });
                const embed = new Discord.MessageEmbed()
                    .setTitle(`Help Desk`)
                    .setDescription(cats)
                    .setThumbnail(client.user.avatarURL())
                    .setFooter(`${help} <category>`)
                    .setColor("YELLOW")
                message.channel.send(embed)
            }


        });


    }
}