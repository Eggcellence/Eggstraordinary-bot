const fs = require("fs")
module.exports = {
    name: "help",
    owner: false,
    category: "util",
    run: async (client, message, args, egg, Discord) => {

        if (!args[0]) {
            fs.readdir("./commands", (err, data) => {
                let cats = ''
                data.forEach(c => {
                    cats += `e!help \`${c}\`\n`
                })
                const embed = new Discord.MessageEmbed()
                    .setTitle(`Help Desk`)
                    .setDescription(cats)
                    .setThumbnail(client.user.defaultAvatarURL)
                    .setColor("YELLOW")
                message.channel.send(embed)
            })


        } else {

            const cat = args[0]

            fs.readdir(`./commands/${cat}`, (err, data) => {
                if(err) return message.channel.send(`:x: - Invalid category`)

                let files = ''
                data.forEach(e => {
                    files += `**${e.slice(0, -3)}**\n `
                })
                const embed = new Discord.MessageEmbed()
                    .setTitle(`${args[0]} | Help Desk`)
                    .setDescription(files)
                    .setThumbnail(client.user.defaultAvatarURL)
                    .setColor("YELLOW")

                message.channel.send(embed)

            });

        }

    }
}