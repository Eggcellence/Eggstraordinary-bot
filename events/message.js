const Discord = require('discord.js');
const mysql = require("mysql");
let prefix = 'e!'
const db = require("../db").database;
const devs = ['554762539586682880', '196099091871170560', '633993042755452932']

// Database connection
let egg = mysql.createPool({
	host: db.host,
	user: db.user,
	password: db.password,
	database: db.database
});

module.exports = async (client, message) => {

	const guild = message.guild.id;

	// Make sure user is not a bot, and commands are not run in DMs
	if (message.author.bot) return;
	if (!message.guild) return;

	// Eggcellence server
	if (message.guild.id === '816947288643469314') return;

	// Prefix?

	egg.query(`SELECT * FROM prefix WHERE guild = ${guild}`, async (err, rows) => {
		if (err) throw err;
		if (rows.length === 0) return prefix = 'e!'
		prefix = rows[0].prefix;
		if (!message.content.startsWith(prefix)) {
			// Leveling
			require('./leveling')(message, egg)
		} else {

			if (!message.member) message.member = await message.guild.fetchMember(message);

			const args = message.content.slice(prefix.length).split(/ +/g);
			const cmd = args.shift().toLowerCase();

			if (cmd.length === 0) return;

			try {
				let command = client.commands.get(cmd);

				if (!command) {
					command = client.commands.get(client.aliases.get(cmd));
					if (!command) {
						message.reply(':x: Command does not exist')
					} else {
						if (command.owner) {
							if (!devs.includes(message.author.id)) {
								return message.channel.send(':x: - Unauthorized');
							}
						}
						command.run(client, message, args, egg, Discord);
					}
				} else
				if (command) {
					if (command.owner) {
						if (!devs.includes(message.author.id)) {
							return message.channel.send(':x: - Unauthorized');
						}
					}
					command.run(client, message, args, egg, Discord);
				}
			} catch (err) {
				console.log(err)
			}
		}
	});
};