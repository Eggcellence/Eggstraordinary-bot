//  UsersEggs (userid int, eggs int);

module.exports = {
    name: 'leaderboard',
    aliases: ['lb', 'top'],
    category: 'egg',
    owner: false,
    run: async (client, message, args, egg, Discord) => {

        let topTen = [];
        const guild = message.guild;
        egg.query(`SELECT * FROM leveling WHERE guild = ${guild.id} ORDER BY eggs DESC LIMIT 10`, (err, rows) => {
            for (let i = 0; i < rows.length; i++) {
                let my_object = {}
                my_object.id = i + 1;
                my_object.level = rows[i].level;
                my_object.xp = rows[i].xp;
                my_object.userid = rows[i].userid;

                topTen.push(my_object);

            }
            let embed = new Discord.MessageEmbed()
                .setTitle('Leaderboard')
                .setThumbnail(message.guild.iconURL())
                .setColor('YELLOW')

            topTen.forEach(e => {
                embed.addFields({
                    name: `#${e.id}`,
                    value: `<@${e.userid}>`,
                    inline: true
                }, {
                    name: 'Level',
                    value: e.level,
                    inline: true
                }, {
                    name: 'XP',
                    value: e.xp,
                    inline: true
                });
            });

            message.channel.send(embed)
        });
    }
}