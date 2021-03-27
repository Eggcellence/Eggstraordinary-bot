const fs = require('fs');

module.exports = (client) => {
	fs.readdirSync('./src/commands/').forEach((dir) => {
		const commands = fs.readdirSync(`./src/commands/${dir}/`).filter((file) => file.endsWith('.js'));

		for (let file of commands) {
			let get = require(`../commands/${dir}/${file}`);

			if (get.name) {
				client.commands.set(get.name, get);
			} else {
				console.log(file, `hey, this file doesn't seem to be healthy`)
				continue;
			}

			if (get.aliases && Array.isArray(get.aliases))
				get.aliases.forEach((alias) => client.aliases.set(alias, get.name));
		}
	});
};