module.exports = {
    name: 'pay',
    aliases: ['give', 'trade', 'donate'],
    description: 'Pay/Trade/Donate eggs to other users',
    usage: '[command | alias] <amount> @user',
    category: 'eggs',
    run: async (client, message, args, egg, Discord) => {

        // Payer - Receiver - amount
        const payer = message.author.id;
        const payee = message.mentions.users.first()
        const amount = Number(Math.floor(args[0]));

        if (!amount) {
            return message.reply(`please include a valid amount.`)
        }
        
        if(amount <= 0) {
            return message.reply(`please choose a valid amount`)
        }

        if (!payee) {
            return message.reply(`please mention the person you want to pay.`)
        }

        if(payee === message.author) {
            return message.reply(`why would you pay yourself?`)
        }

        // Discord server
        const guildid = message.guild.id;

        // SQL Queries
        const payerCheck = `SELECT * FROM UsersEggs WHERE guild = ${guildid} AND userid = ${payer}`;
        const payeeCheck = `SELECT * FROM UsersEggs WHERE guild = ${guildid} AND userid = ${payee.id}`;
        const payeeInsert = `INSERT INTO UsersEggs (userid, eggs, guild) VALUES (${payee.id}, ${amount}, '${guildid}')`;
        const pay = `UPDATE UsersEggs SET eggs = eggs - ${amount} WHERE userid = ${payer} AND guild = ${guildid}`;
        const receive = `UPDATE UsersEggs SET eggs = eggs + ${amount} WHERE userid = ${payee.id} AND guild = ${guildid}`;

        egg.query(payerCheck, (err, rows) => {
            if (err) return errorMessage(err)
            if (rows.length === 0) {
                message.reply("you don't have any eggs. Use e!egg to get some")
            }
            if (rows[0].eggs < amount) {
                return message.reply(`you don't have enough eggs! You need ${amount - rows[0].eggs} more`)
            } else {
                egg.query(payeeCheck, async (err, rows) => {
                    if (err) return errorMessage(err)
                    if (rows.length === 0) {
                        await egg.query(pay)
                        egg.query(payeeInsert, (err, rows) => {
                            if (err) return errorMessage(err)
                            message.channel.send(`Successfully paid \`${amount}\` 🥚 from \`${message.author.username}\` to \`${payee.username}\``)
                        });
                    } else {
                        await egg.query(pay)
                        egg.query(receive, (err, rows) => {
                            if (err) return errorMessage(err)
                            message.channel.send(`Successfully paid \`${amount}\` 🥚 from \`${message.author.username}\` to \`${payee.username}\``)
                        });
                    }
                });
            }

        });


        function errorMessage(err) {
            message.reply(`⚠ - Code: ${err.code} - Please message the developer with the code`);
        }


    }
};
