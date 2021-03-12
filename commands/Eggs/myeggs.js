//  UsersEggs (userid int, eggs int);

module.exports = {
    name: 'myeggs',
    category: 'egg',
    owner: false,
    run: async (client, message, args, egg) => {

        const userid = message.author.id;
        const guildid = message.guild.id;

        egg.query(`SELECT * FROM UsersEggs WHERE guild = ${guildid} AND userid = ${userid}`, (err, result) => {
            if (err) return message.channel.send(`⚠ - Code: ${err.code} - Please message the developer with the code`);
            if (result.length === 0) {
                message.reply('you have 0 eggs, use e!egg to get some!');
            } else {
                message.reply(`you have **${result[0].eggs}** 🥚! Eggsellent :wink:`);
            }
        });


    }
};