const canvacord = require("canvacord")

module.exports = {
    name: 'rank',
    aliases: ['myrank', 'level'],
    description: 'Check your current rank in this server',
    category: 'leveling',
    run: async (client, message, args, egg, Discord) => {

        const userid = message.author.id;
        const username = message.author.username;
        const pfp = message.author.displayAvatarURL({
            format: 'png',
            dynamic: true
        });
        const status = message.author.presence.status;
        const discriminator = message.author.discriminator;
        const guildid = message.guild.id;

        // if (args[0]) {
        //     message.guild.members.fetch({
        //         query: args[0]
        //     }).then(e => {
        //         if (!e.first()) return message.channel.send(`I've searched everywhere but I couldn't find someone with the name of \`${args[0]}\``);
        //         let user = e.first().user;

        //         egg.query(`SELECT * FROM leveling WHERE guild = ${guildid} AND userid = ${user.id}`, (err, rows) => {

        //             if (rows.length === 0) return message.reply(`<:woah:833072727224614963> Oh my god. This user never chatted here to gain XP!`).then(m => m.delete({
        //                 timeout: 5000
        //             }));

        //             let xp = rows[0].xp
        //             let level = rows[0].level
        //             let reqxp = 5 * (level ** 2) + 50 * level + 100
        //             const rank = new canvacord.Rank()
        //                 .setAvatar(user.avatarURL({format: 'png'}))
        //                 .setCurrentXP(xp)
        //                 .setRequiredXP(reqxp)
        //                 .setLevel(level)
        //                 .setRank(0, 0, display = false)
        //                 .setLevelColor('#FFFFFF', '#f6b92b')
        //                 .setStatus(user.presence.status)
        //                 .setProgressBar("#f6b92b", "COLOR")
        //                 .setUsername(user.username)

        //                 .setDiscriminator(user.discriminator);

        //             rank.build()
        //                 .then(data => {
        //                     const attachment = new Discord.MessageAttachment(data, "RankCard.png");
        //                     message.channel.send(attachment);
        //                 });
        //         });
        //     })
        // } else {
            egg.query(`SELECT * FROM leveling WHERE guild = ${guildid} AND userid = '${userid}'`, (err, rows) => {

                if (rows.length === 0) return message.reply(`you don't have any level/xp`).then(m => m.delete({
                    timeout: 5000
                }))

                let xp = rows[0].xp
                let level = rows[0].level
                let reqxp = 5 * (level ** 2) + 50 * level + 100

                const rank = new canvacord.Rank()
                    .setAvatar(pfp)
                    .setCurrentXP(xp)
                    .setRequiredXP(reqxp)
                    .setLevel(level)
                    .setRank(0, 0, display = false)
                    .setLevelColor('#FFFFFF', '#f6b92b')
                    .setStatus(status)
                    .setProgressBar("#f6b92b", "COLOR")
                    .setUsername(username)

                    .setDiscriminator(discriminator);

                rank.build()
                    .then(data => {
                        const attachment = new Discord.MessageAttachment(data, "RankCard.png");
                        message.channel.send(attachment);
                    });
            });
        }
    // }
};