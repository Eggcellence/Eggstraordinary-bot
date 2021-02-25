const Discord = require('discord.js');
const mysql = require("mysql");
const prefix = 'e!';
const dbConfig = require("../db");
const db = dbConfig.database

module.exports = async (client, message) => {

	if (message.author.bot) return;
	if (!message.guild) return;

	if (!message.content.startsWith(prefix)) return;

	if (!message.member) message.member = await message.guild.fetchMember(message);

	const args = message.content.slice(prefix.length).split(/ +/g);
	const cmd = args.shift().toLowerCase();
	let egg = mysql.createPool({
		host: db.host,
		user: db.user,
		password: db.password,
		database: db.database
	});

	if (cmd.length === 0) return;

	try {
		let command = client.commands.get(cmd);
		if (command.owner) {
			const devs = ['554762539586682880', '196099091871170560', '716738742336880681']
			if (!devs.includes(message.author.id)) {
				return message.channel.send(':x: - Unauthorized');
			}
		}

		if (!command) {
			command = client.commands.get(client.aliases.get(cmd));
			command.run(client, message, args, egg, Discord)
		} else if (command) {
			command.run(client, message, args, egg, Discord);
		}

	} finally {

	}
};