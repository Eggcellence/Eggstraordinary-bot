const prettyMs = require('pretty-ms');
//  UsersEggs (userid int, eggs int, username VARCHAR(255), timer bigint, guild varchar(255));

module.exports = {
    name: 'egg',
    category: 'egg',
    aliases: ['eg'],
    owner: false,
    run: async (client, message, args, egg) => {
        
        // Eggs
        const eggs = ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9', '10', '11', '12', '13', '14', '15'];
        const randomEggs = Math.floor(Math.random() * eggs.length);

        // User/Guild
        const userid = message.author.id;
        const username = message.author.username;
        const guildid = message.guild.id;

        // Current date
        const date = new Date().getTime() + (1000 * 60 * 60 * 24);

        // SQL queries
        const mainSQL = `SELECT * FROM UsersEggs WHERE guild = ${guildid} AND userid = ${userid}`;
        const timerSQL = `UPDATE UsersEggs SET timer = ('${date}') WHERE guild = ${guildid} AND userid = ${userid}`;
        const eggsSQL = `UPDATE UsersEggs SET eggs = eggs + ${eggs[randomEggs]} WHERE guild = ${guildid} AND userid = '${userid}'`;
        const setupSQL = `INSERT INTO UsersEggs (userid, eggs, username, guild) VALUES (${userid}, ${eggs[randomEggs]}, '${username}', '${guildid}')`;

        egg.query(mainSQL, (err, result) => {
            let rest = Number(result[0].timer - new Date().getTime());
            if (err) return errorMessage(err);
            if (result.length < 1) {
                egg.query(setupSQL, (err, result) => {
                    if (err) return errorMessage(err);

                    eggs[randomEggs] == 0 ? message.channel.send(`Oh dear, no 🥚 left for you!`) : message.channel.send(`You got ${eggs[randomEggs]} 🥚`);
                    egg.query(timerSQL);
                });
            } else {
                if (result[0].timer == null) {
                    egg.query(eggsSQL, (err, result) => {
                        if (err) return errorMessage(err);

                        eggs[randomEggs] == 0 ? message.channel.send(`Oh dear, no 🥚 left for you!`) : message.channel.send(`You got \`${eggs[randomEggs]}\` 🥚`);
                        egg.query(timerSQL);
                    });
                } else {
                    message.reply(`You already claimed your 🥚 for today, come back after \`${prettyMs(rest, {secondsDecimalDigits: 0})}\`!`); 
                }
            }
        });

        /**
         * Functions
         */

        function errorMessage(err) {
            message.channel.send(`⚠ - Code: ${err.code} - Please message the developer with the code`);
        }
    }
};