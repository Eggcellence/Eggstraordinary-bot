
//  UsersEggs (userid int, eggs int);

module.exports = {
    name: 'rm',
    aliases: ['remove', 'delete'],
    category: 'egg',
    owner: true,
    run: async (client, message, args, egg, Discord) => {
        const userid = args[0]

        egg.query(`SELECT * FROM UsersEggs WHERE userid = ?`, `${userid}`, (err, result) => {
            if (err) return message.channel.send(`⚠ - Code: ${err.code} - Please message the developer with the code`)
            if(result.length !== 0) {
                egg.query(`DELETE FROM UsersEggs WHERE userid = ?`, `${userid}`, (err, result) => {
                    if (err) {
                        return message.channel.send(`⚠ - Code: ${err.code} - Please message the developer with the code`)
                    } else {
                        message.channel.send(`Removed`)
                    }
                });
            } else {
                message.channel.send(`:x: User with the ID \`${userid}\` not found.`)
            }
        });

    }
};