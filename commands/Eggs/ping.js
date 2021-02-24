module.exports = {
    name: 'ping',
    category: 'egg',
    owner: true,
    run: async (client, message, args) => {
        const m = await message.channel.send(`Calculating my ping...`);
        m.edit(
            `:egg: ${Math.floor(
				m.createdTimestamp - message.createdTimestamp
			)}ms`
        );
    }
};