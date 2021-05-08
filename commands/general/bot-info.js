const moment = require("moment");

module.exports = {
    name: 'bot-info',
    description: 'Get general information about the bot',
    usage: '[command]',
    aliases: ['botinfo', 'botinformation', 'bot-information'],
    category: 'general',
    run: async (client, message, args, egg, Discord) => {

       const guildsSize = client.guilds.cache.size;
       const channelSize = client.channels.cache.size;
       const userSize = client.users.cache.size;
       const joinedGuild = moment(message.guild.joinedAt).format("YYYY-MM-DD");
       const totalCmds = client.commands.size;
       const totalCats = client.categories.length;


       const embed = new Discord.MessageEmbed()
            .setTitle(`${client.user.username}'s general information`)
            .setAuthor('A7U', 'https://cdn.discordapp.com/avatars/554762539586682880/a_4996bcf82d46269c073ae41da7cc6456.webp', 'https://a7u.dev')
            .addFields(
                { name: 'Servers I serve', value: guildsSize, inline: true },
                { name: 'Users', value: userSize, inline: true },
                { name: 'Channels', value: channelSize, inline: true },
                { name: 'Joined at', value: joinedGuild, inline: true },
                { name: 'Total commands', value: totalCmds, inline: true },
                { name: 'Total categories', value: totalCats, inline: true }
            )
            .setColor("YELLOW")
            .setThumbnail(client.user.displayAvatarURL())
            .setTimestamp()
            .setFooter(`Requested by ${message.author.username}`)

            message.channel.send(embed)
    }
};