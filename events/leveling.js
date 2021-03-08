const cooldown = new Set();
module.exports = (message, egg) => {

    // Table: leveling
    // content: userid VARCHAR(255), username VARCHAR(255), xp int, level int, guild VARCHAR(255), timer bigint


    // XP
    const xp = Math.floor(Math.random() * 10) + 15;

    // Cooldown (30s)
    const timer = new Date().getTime() + 30000;

    // User/Guild
    const userid = message.author.id;
    const username = message.author.username;
    const guildid = message.guild.id;

    // SQL queries
    const mainSQL = `SELECT * FROM leveling WHERE guild = ${guildid} AND userid = ${userid}`;
    const setupSQL = `INSERT INTO leveling (userid, username, xp, level, guild) VALUES ('${userid}', '${username}', ${xp}, 0, '${guildid}')`;
    const updateXPSQL = `UPDATE leveling SET xp = xp + ${xp} WHERE guild = ${guildid} AND userid = '${userid}'`;
    const updateLvlSQL = `UPDATE leveling SET xp = 0, level = level + 1 WHERE guild = ${guildid} AND userid = '${userid}'`;
    const timerSQL = `UPDATE leveling SET timer = ${timer} WHERE guild = ${guildid} AND userid = '${userid}'`;


    egg.query(mainSQL, (err, rows) => {
        if (err) return errorMessage(err)
        if (rows.length < 1) {
            egg.query(setupSQL, (err, rows) => {
                if (err) return errorMessage(err)
                egg.query(timerSQL, (err, rows) => {
                    if (err) return errorMessage(err)
                });
            });
        } else {
            egg.query(mainSQL, (err, rows) => {
                if (err) return errorMessage(err)
                if (rows[0].timer !== null) {
                    return;
                } else {
                    egg.query(updateXPSQL, (err, rows) => {
                        if (err) return errorMessage(err)
                        egg.query(timerSQL);
                        egg.query(mainSQL, (err, rows) => {
                            const formula = 5 * (rows[0].level ** 2) + 50 * rows[0].level + 100;

                            if (rows[0].xp > formula) {
                                egg.query(updateLvlSQL, (err, rows) => {
                                    if (err) return errorMessage(err)
                                    egg.query(mainSQL, (err, rows) => {
                                        message.reply(`you've reached level \`${rows[0].level}\``);
                                    });
                                });
                            }
                        });
                    });
                }

            });
        }
    });

    /**
     * Functions
     */

    function errorMessage(err) {
        message.channel.send(`⚠ - Code: ${err.code} - Please message the developer with the code`);
    }

}