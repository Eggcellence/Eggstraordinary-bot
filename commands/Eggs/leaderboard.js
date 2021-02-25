
//  UsersEggs (userid int, eggs int);

module.exports = {
    name: 'leaderboard',
    aliases: ['lb', 'leader'],
    category: 'egg',
    owner: true,
    run: async (client, message, args, egg, Discord) => {

        egg.query(`SELECT * FROM UsersEggs ORDER BY eggs DESC LIMIT 10`, (err, result) => {
            if (err) return message.channel.send(`⚠ - Code: ${err.code} - Please message the developer with the code`)
            const embed = new Discord.MessageEmbed()
            var topTen = [];
            result.forEach(e => {
                topTen.push(`**${e.username}** - **${e.eggs}** 🥚`)
            });
            embed
                .setTitle(`Top 10 🥚 collectors`)
                .setDescription(topTen.join("\n"))
            message.channel.send(embed)

        })
    }
};