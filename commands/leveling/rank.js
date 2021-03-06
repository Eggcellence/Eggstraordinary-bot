const canvacord = require("canvacord")

module.exports = {
    name: 'rank',
    category: 'leveling',
    owner: false,
    run: async (client, message, args, egg, Discord) => {

        const userid = message.author.id;
        const username = message.author.username;
        const pfp = message.author.displayAvatarURL({format:'png', dynamic: true});
        const status = message.author.presence.status;
        const discriminator = message.author.discriminator;
        const guildid = message.guild.id;

        egg.query(`SELECT * FROM leveling WHERE guild = ${guildid} AND userid = '${userid}'`, (err, rows) => {
            // message.reply(`Your level is ${rows[0].level}\n you need ${10 - rows[0].xp} XP to reach level ${rows[0].level + 1}`)
            let xp = rows[0].xp
            let formula = 5 * (rows[0].level**2) + 50 * rows[0].level + 100
            let reqxp = formula
            let level = rows[0].level

            
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