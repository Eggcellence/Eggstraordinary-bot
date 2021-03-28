module.exports = {
    name: 'shop',
    category: 'eggs',
    owner: false,
    run: async (client, message, args, egg, Discord) => {

        // User/Guild
        const userid = message.author.id;
        const guild = message.guild.id;

        // Shop
        let shop = {
            1: {
                item: "Cat",
                value: 10
            },
            2: {
                item: "Chicken",
                value: 20
            },
            3: {
                item: "Cow",
                value: 40
            },
            4: {
                item: "Milk",
                value: 15
            },
            5: {
                item: "Seed",
                value: 5
            }
        };

        // SQL 
        const mainSQL = `SELECT * FROM UsersEggs WHERE userid = ${userid} AND guild = ${guild}`;

        // Loop shop for display
        let item = ``;
        for (let key in shop) {
            item += `[\`${key}\`] **${shop[key].item}** - \`${shop[key].value}\`\n`;
        }

        // Create embed and display
        const embed = new Discord.MessageEmbed()
            .setTitle(`Egg shop`)
            .setDescription(item)
            .setColor("YELLOW")
        message.channel.send("\npick an item in the list or write a number:", embed).then(firstMessageEdit => {

            // Message collector
            const filter = (msg) => msg.author.id == message.author.id;
            const collector = message.channel.createMessageCollector(filter, {
                time: 15000
            });

            collector.on('collect', msg => {

                let args = msg.content.split(' ');

                for (let key in shop) {
                    if (args[0] == key || args[0].toLowerCase() == shop[key].item.toLowerCase()) {
                        egg.query(mainSQL, (err, rows) => {
                            if (err) errorMessage(err)
                            let price = shop[key].value;
                            if (rows[0].eggs < price) {
                                return message.reply(`you don't have enough eggs to buy this item`)
                            } else {
                                egg.query(`UPDATE UsersEggs SET eggs = eggs - ${price} WHERE userid = ${userid} AND guild = ${guild}`, (err, rows) => {
                                    if (err) errorMessage(err)
                                    firstMessageEdit.delete()
                                    message.channel.send(`${message.author}, you have picked successfully the ${shop[key].item} item of value ${shop[key].value}`);
                                });
                            }
                        });
                    }
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