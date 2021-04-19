module.exports = {
    name: 'invite',
    description: 'util',
    usage: '[command]',
    aliases: ['inv'],
    category: 'util',
    run: async (client, message, args, egg, Discord) => {

        function genEmbed(invite) {
            const embed = new Discord.MessageEmbed()
                .setTitle(`Invite me!`)
                .setDescription(`Invite me [here](${invite})`)
                .setColor('YELLOW')
                .setThumbnail(client.user.displayAvatarURL())
            return embed
        }
        client.generateInvite().then(inv => message.author.send(genEmbed(inv)))
    }
};