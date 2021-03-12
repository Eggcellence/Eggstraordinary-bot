//  UsersEggs (userid int, eggs int);

module.exports = {
    name: 'eggboard',
    aliases: ['eb', 'eggb'],
    category: 'egg',
    owner: false,
    run: async (client, message, args, egg, Discord) => {

        const guildid = message.guild.id;

        egg.query(`SELECT * FROM UsersEggs WHERE guild = ${guildid} ORDER BY eggs DESC LIMIT 10`, (err, result) => {
            if (err) return message.channel.send(`⚠ - Code: ${err.code} - Please message the developer with the code`);
            const embed = new Discord.MessageEmbed();
            var topTen = [];
            result.forEach(e => {
                topTen.push(`**${e.username}** - **${e.eggs}** 🥚`);
            });
            embed
                .setTitle(`Top 10 🥚 collectors`)
                .setDescription(topTen.join("\n"))
                .setColor("YELLOW");
            message.channel.send(embed);

        });
    }
};