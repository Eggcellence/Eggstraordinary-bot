const snekfetch = require('snekfetch')
module.exports = {
    name: "eval",
    category: "util",
    owner: true,
    run: async (client, message, args, egg, Discord) => {

        function clean(text) {
            if (typeof (text) === 'string') {
                return text.replace(/`/g, '`' + String.fromCharCode(8203)).replace(/@/g, '@' + String.fromCharCode(8203));
            }
            return text;
        }
        function token(input) {
            if (typeof (input) === 'string') {
                return input.replace(message.client.token, 'Your TOKEN');
            } else if (typeof (input) === 'object') {
                if (Array.isArray(input)) {
                    function hasToken(value) {
                        if (typeof (value) !== 'string') {
                            return true;
                        }
                        return value !== message.client.token;
                    }
                    return input.filter(hasToken);
                }
                return input;
            }
            return input;
        }
        try {
            let code = args.join(' ');
            let evaled = eval(code);
            let func = token(clean(evaled));
            if (typeof func !== 'string') {
                func = require('util').inspect(func);
            }
            const output = '```js\n' + func + '\n```';
            const Input = '```js\n' + message.content.slice(6) + '\n```';
            let type = typeof (evaled);
            if (func.length < 1000) {
                const embed = new Discord.MessageEmbed()
                    .addField('EVAL', `**Type:** ${type}`)
                    .addField(':inbox_tray: Input', Input)
                    .addField(':outbox_tray: Output', output)
                    .setColor(0x80FF00)
                    .setTimestamp();
                message.channel.send({embed});
            } else {
                snekfetch.post('https://www.hastebin.com/documents').send(func)
                    .then(res => {
                        const embed = new Discord.MessageEmbed()
                            .addField('EVAL', `**Type:** ${type}`)
                            .addField(':inbox_tray: Input', Input)
                            .addField(':outbox_tray: Output', `Output was to long so it was uploaded to hastebin https://www.hastebin.com/${res.body.key}.js `, true)
                            .setColor(0x80FF00);
                        message.channel.send({embed});
                    })
                    .catch(err => {
                        client.logger.error(err);
                        const embed = new Discord.MessageEmbed()
                            .addField('EVAL', `**Type:** ${type}`)
                            .addField(':inbox_tray: Input', Input)
                            .addField(':x: ERROR', `Output was to long and could not upload to hastebin`, true)
                            .setColor(0x80FF00);
                        message.channel.send({embed});
                    });
            }
        } catch (err) {
            let errIns = require('util').inspect(err);
            const error = '```js\n' + errIns + '\n```';
            const Input = '```js\n' + message.content.slice(6) + '\n```';
            if (errIns.length < 1000) {
                const embed = new Discord.MessageEmbed()
                    .addField('EVAL', `**Type:** Error`)
                    .addField(':inbox_tray: Input', Input)
                    .addField(':x: ERROR', error, true)
                    .setColor(0x80FF00);
                message.channel.send({embed});
            } else {
                snekfetch.post('https://www.hastebin.com/documents').send(errIns)
                    .then(res => {
                        const embed = new Discord.MessageEmbed()
                            .setTitle('Eval Error')
                            .addField('EVAL', `**Type:** Error`)
                            .addField(':inbox_tray: Input', Input)
                            .addField(':x: ERROR', '```' + err.name + ': ' + err.message + '```', true)
                            .setURL(`https://www.hastebin.com/${res.body.key}.js`)
                            .setColor(0x80FF00);
                        message.channel.send({embed});
                    })
                    .catch(err => {
                        const embed = new Discord.MessageEmbed()
                            .addField('Eval', `**Type:** Error`)
                            .addField(':inbox_tray: Input', Input)
                            .addField(':x: ERROR', `The output was too long`, true)
                            .setColor(0x80FF00);
                        message.channel.send({embed});
                    });
                }
            }
        }
    }