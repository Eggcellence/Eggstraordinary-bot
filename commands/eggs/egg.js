const prettyMs = require('pretty-ms');
//  UsersEggs (userid int, eggs int, timer bigint, guild varchar(255));

module.exports = {
    name: 'egg',
    category: 'egg',
    aliases: ['eg'],
    owner: false,
    run: async (client, message, args, egg) => {

        // Eggs
        let newegg = Math.floor(Math.random() * 20);

        // User/Guild
        const userid = message.author.id;
        const guildid = message.guild.id;

        // Current date
        const date = new Date().getTime() + (1000 * 60 * 60 * 24);

        // SQL queries
        const mainSQL = `SELECT * FROM UsersEggs WHERE guild = ${guildid} AND userid = ${userid}`;
        const timerSQL = `UPDATE UsersEggs SET timer = ('${date}') WHERE guild = ${guildid} AND userid = ${userid}`;
        const eggsSQL = `UPDATE UsersEggs SET eggs = eggs + ${newegg} WHERE guild = ${guildid} AND userid = '${userid}'`;
        const setupSQL = `INSERT INTO UsersEggs (userid, eggs, guild) VALUES (${userid}, ${newegg}, '${guildid}')`;
        const inventorySQL = `SELECT * FROM inventory WHERE guild = ${guildid} AND userid = ${userid}`;

        egg.query(mainSQL, (err, result) => {
            if (err) return errorMessage(err);
            if (result.length < 1) {
                egg.query(setupSQL, (err) => {
                    if (err) return errorMessage(err);
                    
                    newegg === 0 ? message.channel.send(`Oh dear, no 🥚 left for you!`) : message.channel.send(`You got ${newegg} 🥚`);
                    egg.query(timerSQL);
                });
            } else {
                if (result[0].timer == null) {
                    egg.query(inventorySQL, (err, rows) => {
                        if(rows.length === 0) {
                            egg.query(eggsSQL, (err) => {
                                if (err) return errorMessage(err);
                                newegg === 0 ? message.channel.send(`Oh dear, no 🥚 left for you!`) : message.channel.send(`You got \`${newegg}\` 🥚`);
                                egg.query(timerSQL);
                            });
                        } else {
                            if(rows[0].Chicken > 0) newegg = newegg + rows[0].Chicken * 10;
                            if(rows[0].Farm > 0) newegg = newegg + rows[0].Farm * 30;
                            if(rows[0].Frog > 0) newegg = newegg + rows[0].Frog * 5;
                            if(rows[0].Duck > 0) newegg = newegg + rows[0].Duck * 20;
    
                            egg.query(eggsSQL, (err) => {
                                if (err) return errorMessage(err);
                                newegg === 0 ? message.channel.send(`Oh dear, no 🥚 left for you!`) : message.channel.send(`You got \`${newegg}\` 🥚`);
                                egg.query(timerSQL);
                            });
                        }

                    });
                } else {
                    egg.query(mainSQL, (err, rows) => {
                        if (err) errorMessage(err)
                        let rest = Number(result[0].timer - new Date().getTime());
                        message.reply(`you have \`${rows[0].eggs}\` 🥚 - you can claim more after \`${prettyMs(rest, {secondsDecimalDigits: 0})}\``)
                    });
                }
            }
        });

        /**
         * Functions
         */

        function errorMessage(err) {
            message.reply(`⚠ - Code: ${err.code} - Please message the developer with the code`);
        }
    }
};
