//  UsersEggs (userid int, eggs int);

module.exports = {
    name: 'leaderboard',
    aliases: ['lb', 'top'],
    description: 'A list of top 10 in leveling in this server',
    category: 'leveling',
    owner: false,
    run: async (client, message, args, egg, Discord) => {

        let topTen = [];
        const guild = message.guild;
        egg.query(`SELECT * FROM leveling WHERE guild = ${guild.id} ORDER BY level DESC LIMIT 10`, (err, rows) => {
            if(err) throw err;
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
                    name: 'EggXP',
                    value: e.xp,
                    inline: true
                });
            });

            message.channel.send(embed)
        });
    }
}