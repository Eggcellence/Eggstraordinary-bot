module.exports = {
    name: 'shop',
    aliases: ['buy'],
    description: 'Buy yourself some items and save them to your inventory to get extra eggs on each claim!',
    usage: '[command | alias]',
    category: 'eggs',
    run: async (client, message, args, egg, Discord) => {

        // User/Guild
        const userid = message.author.id;
        const guild = message.guild.id;

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
        message.channel.send("\npick an item in the list or write a number:", embed).then(firstMessageEdit => {

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
                            if (err) errorMessage(err)
                            let price = shop[key].value;
                            let item = shop[key].item;
                            if (rows[0].eggs < price) {
                                return message.reply(`you don't have enough 🥚 to buy this item`).then(m => m.delete({timeout: 5000}))
                            } else {
                                egg.query(`UPDATE UsersEggs SET eggs = eggs - ${price} WHERE userid = ${userid} AND guild = ${guild}`, (err, rows) => {
                                    if (err) errorMessage(err)
                                    firstMessageEdit.delete()
                                    egg.query(inventorySQL, (err, rows) => {
                                        if (err) errorMessage(err)
                                        if(rows.length === 0) {
                                            egg.query(`INSERT INTO inventory (userid, guild, ${item}) VALUES (${userid}, ${guild}, 1)`, (err, rows) => {
                                                if (err) errorMessage(err)
                                                message.channel.send(`${message.author}, ${item} has been added to your inventory!`)
                                            });
                                        } else {
                                            egg.query(`UPDATE inventory SET ${item} = ${item} + 1 WHERE userid = ${userid} AND guild = ${guild}`, (err, rows) => {
                                                if (err) errorMessage(err)
                                                message.channel.send(`${message.author}, ${item} has been added to your inventory!`)
                                            });
                                        }
                                    });
                                });
                            }
                        });
                    }
                }

                if(msg.content === 'cancel') {
                    await collector.stop()
                    msg.react('✅')
                }
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