const prettyMs = require('pretty-ms');
//  UsersEggs (userid int, eggs int, timer bigint, guild varchar(255));

module.exports = {
    name: 'egg',
    category: 'eggs',
    aliases: ['bal', 'balance'],
    description: 'Claim eggs daily and check how many eggs you have!',
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

        if (args[0]) {
            let user = message.mentions.users.first() || message.guild.members.cache.find(u => u.user.username === args[0]).user;
            if (!user) return;
            egg.query(`SELECT * FROM UsersEggs WHERE guild = ${guildid} AND userid = ${user.id || user.user.id}`, (err, rows) => {
                if (err) errorMessage(err)
                if (rows.length < 1) return message.reply(`${user.username || user.user.username} has no eggs! That's quite unfortunate.`)

                if (user.username == message.author.username) { 
                    egg.query(mainSQL, (err, rows) => {
                        if (err) errorMessage(err)
                        let rest = Number(rows[0].timer - new Date().getTime());
                        message.reply(`you have \`${rows[0].eggs}\` 🥚 - you can claim more after \`${prettyMs(rest, {secondsDecimalDigits: 0})}\``)
                    });
                } else {
                    message.channel.send(`**${user.username}** has in total \`${rows[0].eggs}\` 🥚`)
                }
            });
        } else

            egg.query(mainSQL, (err, result) => {
                if (err) return errorMessage(err);
                if (result.length < 1) {
                    egg.query(setupSQL, (err) => {
                        if (err) return errorMessage(err);

                        newegg === 0 ? message.channel.send(`<:sad:833073292679184385> Oh dear, no 🥚 left for you!`) : message.channel.send(`<:nice:833072698502545508> You've received your daily eggs: \`${newegg}\` - come back tomorrow for more!`);
                        egg.query(timerSQL);
                    });
                } else {
                    if (result[0].timer == null) {
                        egg.query(inventorySQL, (err, rows) => {
                            if (rows.length === 0) {
                                egg.query(eggsSQL, (err) => {
                                    if (err) return errorMessage(err);
                                    newegg === 0 ? message.channel.send(`<:sad:833073292679184385> Oh dear, no 🥚 left for you!`) : message.channel.send(`<:nice:833072698502545508> You've received your daily eggs: \`${newegg}\` - come back tomorrow for more!`);
                                    egg.query(timerSQL);
                                });
                            } else {
                                let extraeggs = 0;
                                let item = []
                                if (rows[0].Chicken > 0) {
                                    extraeggs = extraeggs + rows[0].Chicken * 10;
                                    item.push('🐔');
                                }
                                if (rows[0].Farm > 0) {
                                    extraeggs = extraeggs + rows[0].Farm * 30;
                                    item.push('👩‍🌾');
                                }
                                if (rows[0].Frog > 0) {
                                    extraeggs = extraeggs + rows[0].Frog * 5;
                                    item.push('🐸');
                                }
                                if (rows[0].Duck > 0) {
                                    extraeggs = extraeggs + rows[0].Duck * 20;
                                    item.push('🦆');
                                }
                                if(newegg === 0) return message.channel.send(`<:sad:833073292679184385> Oh dear, no eggs left for you!`);
                                
                                egg.query(`UPDATE UsersEggs SET eggs = eggs + ${newegg + extraeggs} WHERE guild = ${guildid} AND userid = '${userid}'`, (err, rows) => {
                                    if (err) return errorMessage(err);
                                    message.channel.send(`<:nice:833072698502545508> You've received your daily eggs: \`${newegg}\` + \`${extraeggs}\` extra eggs from ${item.join('+ ')} - come back tomorrow for more!`);
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