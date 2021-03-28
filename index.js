const Discord = require('discord.js');

const client = new Discord.Client({
	disableMentions: 'everyone',
	ws: {
		intents: [
			'GUILDS',
			'GUILD_BANS',
			'GUILD_EMOJIS',
			'GUILD_INTEGRATIONS',
			'GUILD_WEBHOOKS',
			'GUILD_INVITES',
			'GUILD_VOICE_STATES',
			'GUILD_MEMBERS',
			'GUILD_MESSAGES',
			'GUILD_MESSAGE_REACTIONS',
			'GUILD_MESSAGE_TYPING',
			'GUILD_PRESENCES',
			'DIRECT_MESSAGES',
			'DIRECT_MESSAGE_REACTIONS',
			'DIRECT_MESSAGE_TYPING'
		]
	}
});
// Webstorm test
const {
	config
} = require('dotenv');
const fs = require('fs');

client.commands = new Map();
client.aliases = new Map();

client.categories = fs.readdirSync(__dirname + '/commands');

config({
	path: __dirname + '/.env'
});

['command', 'events'].forEach((handler) => {
	require(`./handlers/${handler}`)(client);
});

client.login(process.env.TOKEN);