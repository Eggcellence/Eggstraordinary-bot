
const reqEv = (ev) => require(`../events/${ev}.js`);

module.exports = (client) => {
    client.on('ready', () => reqEv('ready')(client));
    client.on('message', (message) => reqEv('message')(client, message));
}
