let ratelimit = new Set();

module.exports = {
    name: 'shop',
    aliases: ['buy', 'store', 'purchase'],
    description: 'Buy yourself some items and save them to your inventory to get extra eggs on each claim!',
    usage: '[command | alias]',
    category: 'eggs',
    run: async (client, message, args, egg, Discord) => {

        // User/Guild
        const userid = message.author.id;
        const guild = message.guild.id;
        if (ratelimit.has(message.author.id)) return;

        let shop = {
            1: {
                item: "Chicken",
                value: 60,
                description: 'Receive `10+` 🥚 when claiming'
            },
            2: {
                item: "Farm",
                value: 150,
                description: 'Receive `30+` 🥚 when claiming'
            },
            3: {
                item: "Duck",
                value: 80,
                description: 'Receive `20+` 🥚 when claiming'
            },
            4: {
                item: "Frog",
                value: 50,
                description: 'Receive `5+` 🥚 when claiming'
            }
        };

        // SQL 
        const mainSQL = `SELECT * FROM UsersEggs WHERE userid = ${userid} AND guild = ${guild}`;
        const inventorySQL = `SELECT * FROM inventory WHERE userid = ${userid} AND guild = ${guild}`;

        // Loop shop for display
        let item = ``;
        for (let key in shop) {
            item += `[\`${key}\`] **${shop[key].item}** - Price: \`${shop[key].value}\`\n${shop[key].description}\n\n`;
        }

        // Create embed and display
        const embed = new Discord.MessageEmbed()
            .setTitle(`Egg shop`)
            .setDescription(item)
            .setColor("YELLOW")
            .setFooter(`Choose by sending the name of the item or number. Respond with 'cancel' to stop the process`)
            .setThumbnail(client.user.avatarURL())
        message.channel.send("\nPick by sending the name of the item or number:", embed).then(firstMessageEdit => {

            ratelimit.add(message.author.id);

            // Message collector
            const filter = (msg) => msg.author.id == message.author.id;
            const collector = message.channel.createMessageCollector(filter, {
                time: 15000
            });

            collector.on('collect', async msg => {

                let args = msg.content.split(' ');

                for (let key in shop) {
                    if (args[0] == key || args[0].toLowerCase() == shop[key].item.toLowerCase()) {
                        egg.query(mainSQL, (err, rows) => {
                            if (err) errorMessage(err);
                            let price = shop[key].value;
                            let item = shop[key].item;
                            if (rows[0].eggs < price) {
                                return message.reply(`you don't have enough 🥚 to buy this item`).then(m => {
                                    m.delete({
                                        timeout: 5000
                                    });
                                    ratelimit.delete(msg.author.id);
                                    collector.stop();
                                });
                            } else {
                                egg.query(`SELECT ${item} FROM inventory WHERE userid = ${userid} AND guild = ${guild}`, (err, rows) => {
                                    let count;

                                    if(rows.length < 1) {
                                        count = 0
                                    } else {
                                        count = rows[0][item];
                                    }
                                    if (count >= 100) {
                                        message.reply(`sorry, but the max amount of ${item}s you can have is 100. `);
                                        ratelimit.delete(msg.author.id);
                                    } else {
                                        message.channel.send(`Alright, your choice is \`${item}\`. How many would you like? e.g. **max**, **1**, **2**, **10**, **25**, etc`).then((m) => {
                                            collector.stop()
                                            const collector2 = message.channel.createMessageCollector(filter);
                                            collector2.on('collect', async msg => {
                                                let args = msg.content.split(' ');

                                                if(args[0] === 'cancel') {
                                                    msg.react('✅');
                                                    collector.stop();
                                                    collector2.stop();
                                                    return;
                                                }

                                                if(args[0] === 'max') {
                                                    let maxItem = 100 - count;
                                                    let maxAmount = price * maxItem;
                                                    egg.query(mainSQL, (err, rows) => {
                                                        if(rows[0].eggs < maxAmount) return message.reply(`you don't have enough eggs to buy ${maxItem} ${item}s`);
                                                        ratelimit.delete(msg.author.id);
                                                        egg.query(`UPDATE UsersEggs SET eggs = eggs - ${maxAmount} WHERE userid = ${userid} AND guild = ${guild}`, (err, rows) => {
                                                            if (err) errorMessage(err);
                                                            firstMessageEdit.delete();
                                                            egg.query(inventorySQL, (err, rows) => {
                                                                if (err) errorMessage(err);
                                                                if (rows.length === 0) {
                                                                    egg.query(`INSERT INTO inventory (userid, guild, ${item}) VALUES (${userid}, ${guild}, ${maxItem})`, (err, rows) => {
                                                                        if (err) errorMessage(err);
                                                                        message.reply(`${maxItem} ${item}s have been added to your inventory!`);
                                                                        ratelimit.delete(msg.author.id);
                                                                        collector2.stop()
                                                                    });
                                                                } else {
                                                                    egg.query(`UPDATE inventory SET ${item} = ${item} + ${maxItem} WHERE userid = ${userid} AND guild = ${guild}`, (err, rows) => {
                                                                        if (err) errorMessage(err);
                                                                        message.reply(`${maxItem} ${item}s have been added to your inventory!`);
                                                                        ratelimit.delete(msg.author.id);
                                                                        collector2.stop()
                                                                    });
                                                                }
                                                            });
                                                        });
                                                    });

                                                } else {
                                                    let amount = Number(Math.floor(args[0]));
                                                    if (!amount) {
                                                        return message.reply(`please include a valid amount.`).then(m => m.delete({timeout: 5000}))
                                                    }                                                    
                                                    if(amount <= 0) {
                                                        return message.reply(`please choose a valid amount`).then(m => m.delete({timeout: 5000}))
                                                    }
                                                    let maxItem = 100 - count;
                                                    let totalPrice = price * amount;
                                                    egg.query(mainSQL, (err, rows) => {
                                                        if(rows[0].eggs < totalPrice) {
                                                            message.reply(`you don't have enough to buy ${amount} ${item}s, you need ${totalPrice - rows[0].eggs} more.`);
                                                            ratelimit.delete(msg.author.id);
                                                            collector2.stop()
                                                        } 
                                                        if(amount > maxItem) {
                                                            message.reply(`you can't buy more than ${maxItem} for ${item}!`);
                                                            ratelimit.delete(msg.author.id);
                                                            collector2.stop()
                                                        }
                                                        if(amount < maxItem && rows[0].eggs > totalPrice) {
                                                            egg.query(`UPDATE UsersEggs SET eggs = eggs - ${totalPrice} WHERE userid = ${userid} AND guild = ${guild}`, (err, rows) => {
                                                                if (err) errorMessage(err);
                                                                firstMessageEdit.delete();
                                                                egg.query(inventorySQL, (err, rows) => {
                                                                    if (err) errorMessage(err);
                                                                    if (rows.length === 0) {
                                                                        egg.query(`INSERT INTO inventory (userid, guild, ${item}) VALUES (${userid}, ${guild}, ${amount})`, (err, rows) => {
                                                                            if (err) errorMessage(err);
                                                                            message.reply(`${amount} ${item}s have been added to your inventory!`);
                                                                            ratelimit.delete(msg.author.id);
                                                                            collector2.stop()
                                                                        });
                                                                    } else {
                                                                        egg.query(`UPDATE inventory SET ${item} = ${item} + ${amount} WHERE userid = ${userid} AND guild = ${guild}`, (err, rows) => {
                                                                            if (err) errorMessage(err);
                                                                            message.reply(`${amount} ${item}s have been added to your inventory!`);
                                                                            ratelimit.delete(msg.author.id);
                                                                            collector2.stop()
                                                                        });
                                                                    }
                                                                });
                                                            });
                                                        }
                                                    });
                                                }
                                            });
                                        });
                                    }
                                })
                            }
                        });
                    }
                }

                if (msg.content === 'cancel') {
                    await collector.stop();
                    msg.react('✅')
                    ratelimit.delete(msg.author.id);
                }
            });

            collector.on('end', () => {
                ratelimit.delete(message.author.id);
            });
        });

        /**
         * Functions
         */

        function errorMessage(err) {
            message.reply(`⚠ - Code: ${err.code} - Please message the developer with the code`);
        }

    }
};