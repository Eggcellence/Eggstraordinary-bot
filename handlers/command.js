const fs = require('fs');

module.exports = (client) => {
	fs.readdirSync('./commands/').forEach((dir) => {
		const commands = fs.readdirSync(`./commands/${dir}/`).filter((file) => file.endsWith('.js'));

		for (let file of commands) {
			let get = require(`../commands/${dir}/${file}`);

			if (get.name) {
				client.commands.set(get.name, get);
			} else {
				console.log(`Missing parameters in ${file} - please check on it or else it might not run`)
				continue;
			}

			if (get.aliases && Array.isArray(get.aliases))
				get.aliases.forEach((alias) => client.aliases.set(alias, get.name));
		}
	});
};