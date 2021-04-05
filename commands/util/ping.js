module.exports = {
    name: 'ping',
    description: 'Check the hearbeat of the bot.',
    category: 'util',
    run: async (client, message, args) => {
        const m = await message.channel.send(`Calculating my ping...`);
        m.edit(
            `:egg: ${Math.floor(
				m.createdTimestamp - message.createdTimestamp
			)}ms`
        );
    }
};