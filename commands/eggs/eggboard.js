//  UsersEggs (userid int, eggs int);

module.exports = {
    name: 'eggboard',
    aliases: ['eb', 'elb'],
    description: "Check the top 10 egg collectors of this server",
    category: 'egg',
    owner: false,
    run: async (client, message, args, egg, Discord) => {

        let topTen = [];
        const guild = message.guild;
        egg.query(`SELECT * FROM UsersEggs WHERE guild = ${guild.id} ORDER BY eggs DESC LIMIT 10`, (err, rows) => {

            for (let i = 0; i < rows.length; i++) {
                let obj = {}
                obj.id = i + 1;
                obj.userid = rows[i].userid;
                obj.eggs = rows[i].eggs;

                topTen.push(obj);
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
                }, 
                { name: '\u200B', value: '\u200B', inline: true },
                {
                    name: 'Eggs',
                    value: e.eggs,
                    inline: true
                });
            });

            message.channel.send(embed)
        });

    }
}