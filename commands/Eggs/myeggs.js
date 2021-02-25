//  UsersEggs (userid int, eggs int);

module.exports = {
	name: 'myeggs',
    category: 'egg',
    owner: true,
	run: async (client, message, args, egg) => {

        const userid = message.author.id;

        egg.query(`SELECT * FROM UsersEggs WHERE userid = ${userid}`, (err, result) => {
            if(result.length === 0) {
                message.reply('you have 0 eggs, use e!egg to get some!')
            } else {
                message.reply(`you have **${result[0].eggs}** eggs! Eggsellent :wink:`)
            }
        });


	}
};