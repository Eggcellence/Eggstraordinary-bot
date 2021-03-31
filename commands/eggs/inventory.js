 module.exports = {
    name: 'inventory',
    aliases: ['inven', 'bag'],
    description: "View your inventory, shows list of items you purchased from the shop",
    category: 'eggs',
    owner: false,
    run: async (client, message, args, egg, Discord) => {

        // Table: inventory
        // Content:  userid VARCHAR(255), guild VARCHAR(255), timer bigint, chicken bit, farm bit, frog bit, duck bit

        const guild = message.guild.id;
        const userid = message.author.id;
        egg.query(`SELECT * FROM inventory WHERE guild = ${guild} AND userid = ${userid}`, (err, rows) => {
            if(err) throw err;
            if(rows.length === 0) {
                message.reply(`you have nothing in your inventory!`)
            } else {

                if(!rows[0].Chicken && !rows[0].Farm && !rows[0].Duck && !rows[0].Frog) return message.reply(`you have nothing in your inventory!`)

                let embed = new Discord.MessageEmbed()
                    .setTitle(`${message.author.username}'s Inventory`)
                    .addFields(
                        !rows[0].Chicken ? [] : {name: '🐔', value: `**${rows[0].Chicken}**`, inline: true},
                        !rows[0].Farm ? [] : { name: '👩‍🌾', value: rows[0].Farm, inline: true },
                        !rows[0].Duck ? [] : { name: '🦆', value: rows[0].Duck, inline: true },
                        !rows[0].Frog ? [] : { name: '🐸', value: rows[0].Frog, inline: true }
                    )
                    .setColor('YELLOW')
                    .setThumbnail(message.guild.iconURL())
                    message.channel.send(embed)
            }
            
        });

    }
};