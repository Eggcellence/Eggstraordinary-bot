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

        egg.query(`SELECT * FROM leveling WHERE guild = ${guildid} AND userid = '${userid}'`, (err, rows) => {
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
};