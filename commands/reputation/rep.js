module.exports = {
    name: 'rep',
    category: 'reputation',
    owner: false,
    run: async (client, message, args, egg, Discord) => {

        // Table: rep
        // Content: userid VARCHAR(255), rep int, guild VARCHAR(255)

        // User/Guild
        const userid = message.author.id;
        const mention = message.mentions.users.first();
        const guild = message.guild.id;

        // SQL queries - soon

        if (args[0] === 'add') {
            if (!mention) return message.reply('mention a user to rep!')
            egg.query(`SELECT * FROM rep WHERE userid = ${mention.id} AND guild = ${guild}`, (err, rows) => {
                if (rows.length === 0) {
                    egg.query(`INSERT INTO rep (userid, rep, guild) VALUES (${mention.id}, 1, ${guild})`, (err, rows) => {
                        if (err) throw err;
                        console.log(rows)
                    });
                } else {
                    egg.query(`UPDATE rep SET rep = rep + 1 WHERE userid = ${mention.id} AND guild = ${guild}`)
                }
            });
        } else {
            egg.query(`SELECT * FROM rep WHERE userid = ${userid} AND guild = ${guild}`, (err, rows) => {
                if (rows.length === 0) {
                    message.reply(`you have no reputation points`)
                } else {
                    message.reply(`you have ${rows[0].rep} reps`)
                }
            });
        }


    }
};
// UNFINISHED CMD. DO NOT TOUCH