//  UsersEggs (userid int, eggs int);

module.exports = {
    name: 'rm',
    aliases: ['remove', 'delete'],
    category: 'egg',
    owner: true,
    run: async (client, message, args, egg, Discord) => {
        const userid = args[0];
        const guildid = message.guild.id;

        if(!userid) return message.channel.send(':x: provide a user!')
        
        egg.query(`SELECT * FROM UsersEggs WHERE guild = ${guildid} AND userid = ?`, `${userid}`, (err, result) => {
            if (err) return message.channel.send(`⚠ - Code: ${err.code} - Please message the developer with the code`)
            if (result.length !== 0) {
                egg.query(`DELETE FROM UsersEggs WHERE guild = ${guildid} AND userid = ?`, `${userid}`, (err, result) => {
                    if (err) {
                        return message.channel.send(`⚠ - Code: ${err.code} - Please message the developer with the code`)
                    } else {
                        message.channel.send(`✅ REMOVED`)
                    }
                });
            } else {
                message.channel.send(`:x: User with the ID \`${userid}\` not found.`)
            }
        });

    }
};