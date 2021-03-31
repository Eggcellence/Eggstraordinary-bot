 module.exports = {
    name: 'inventory',
    aliases: ['inven', 'bag'],
    category: 'x',
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
                
                /* Uncomment this line below and comment line 21 to 32 if you want to disable embed */
                // message.reply(`you have \`${rows[0].Chicken}\` 🐔, \`${rows[0].Farm}\` 👩‍🌾, \`${rows[0].Duck}\` 🦆 and \`${rows[0].Frog}\` 🐸!`)
                const embed = new Discord.MessageEmbed()
                    .setTitle(`${message.author.username}'s Inventory`)
                    .setAuthor('Eggcellence!', client.user.avatarURL())
                    .addFields(
                        { name: '🐔', value: rows[0].Chicken, inline: true },
                        { name: '👩‍🌾', value: rows[0].Farm, inline: true },
                        { name: '🦆', value: rows[0].Duck, inline: true },
                        { name: '🐸', value: rows[0].Frog, inline: true }
                    )
                    .setColor('YELLOW')
                    .setThumbnail(message.guild.iconURL())
                    message.channel.send(embed)
            }
            
        });

    }
};