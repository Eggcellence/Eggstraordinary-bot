const fs = require("fs")
module.exports = {
    name: "help",
    owner: false,
    category: "util",
    run: async (client, message, args, egg, Discord) => {
        let guildid = message.guild.id;
        let help;
        egg.query(`SELECT * FROM prefix WHERE guild = '${guildid}'`, (err, rows) => {
            if(err) return message.reply(`⚠ - Code: ${err.code} - Please message the developer with the code`);
            if (rows.length === 0) {
                help = 'e!help';
            } else {
                help = `${rows[0].prefix}help`;
            }

            if (!args[0]) {
                let cats = ''
                client.categories.forEach(c => {
                    cats += `${help} \`${c}\`\n`
                });
                const embed = new Discord.MessageEmbed()
                    .setTitle(`Help Desk`)
                    .setDescription(cats)
                    .setThumbnail(client.user.avatarURL())
                    .setColor("YELLOW")
                message.channel.send(embed)
            } else {

                const cat = args[0].toLowerCase();

                let cats = fs.readdirSync(`./commands/${cat}/`).filter((file) => file.endsWith('.js'));
                let files = ''
                cats.forEach(e => {
                    files += `\`${e.slice(0, -3)}\`\n`
                });
                const embed = new Discord.MessageEmbed()
                    .setTitle(`${args[0].toLowerCase()} | Help Desk`)
                    .setDescription(files)
                    .setThumbnail(client.user.avatarURL())
                    .setColor("YELLOW")

                message.channel.send(embed)
            }


        });


    }
}