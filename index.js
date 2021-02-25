const Discord = require('discord.js');
const client = new Discord.Client();
const {
	config
} = require('dotenv');
const fs = require('fs');

client.commands = new Map();
client.aliases = new Map();

client.categories = fs.readdirSync('./commands/');

config({
	path: __dirname + '/.env'
});

['command', 'events'].forEach((handler) => {
	require(`./handlers/${handler}`)(client);
});

client.login(process.env.TOKEN);