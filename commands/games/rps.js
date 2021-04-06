module.exports = {
    name: 'rps',
    description: 'Play rock paper scissors against the bot. Need 5 eggs to enter. Receive 15 eggs when you win',
    aliases: ['prs', 'srp', 'spr'],
    category: 'games',
    run: async (client, message, args, egg, Discord) => {
        let options = ['rock', 'paper', 'scissors'];

        class RPS {
            constructor(user_, channel_, guild_) {
                this.user = user_;
                this.channel = channel_;
                this.guild = guild_;
                this.AI = null;
                this.collector = null;
                this.filter = (msg) => msg.author.id === this.user.id;
                this.pick = null;
                this.winner = null;

                this.randomValue();
            }

            randomValue() {
                this.AI = options[Math.floor(Math.random() * options.length)];
            }

            CollectorInit() {
                this.collector = this.channel.createMessageCollector(this.filter, { time: 15000 });
                this.collector.on('collect', msg => this.onCollect(msg));
            }

            onCollect(msg) {
                if (!this.checkInput(msg)) return;
                this.compare();
                this.collector.stop();
                this.Embed()
                this.reward()
            }

            checkInput(input_) {
                let input = input_.content.split(' ')[0].toLowerCase();
                let choice = options.some(a => input === a);
                this.pick = input;
                return choice;
            }

            compare() {

                if (this.pick === 'rock' && this.AI === 'scissors') this.winner = this.user;
                if (this.pick === 'paper' && this.AI === 'rock') this.winner = this.user;
                if (this.pick === 'scissors' && this.AI === 'paper') this.winner = this.user;

                if (this.AI === 'rock' && this.pick === 'scissors') this.winner = "Eggstraordinary";
                if (this.AI === 'paper' && this.pick === 'rock') this.winner = "Eggstraordinary";
                if (this.AI === 'scissors' && this.pick === 'paper') this.winner = "Eggstraordinary";

                if (this.pick === this.AI) this.winner = 'Tie';
            }

            Embed() {
                const embed = new Discord.MessageEmbed()
                    .setTitle(this.winner === 'Tie' ? `It's a tie!` : `🎉 Winner is ${this.winner.username || this.winner}`)
                    .setDescription(`Your choice: **${this.pick}**\n AI choice: **${this.AI}**`)
                    .setColor(this.winner === this.user ? 'GREEN' : 'RED')
                this.channel.send(embed)
            }

            reward() {
                if(this.winner === this.user) {
                    egg.query(`UPDATE UsersEggs SET eggs = eggs + 15 WHERE guild = ${this.guild} AND userid = ${this.user.id}`);
                }
            }
        }

        message.channel.send(`This game costs \`5\` 🥚 to enter. If you win you'll receive \`10\` 🥚 if you win. \nAre you sure you would like to continue? **(Y/N)**`).then(async (m)=> {
            const filter = (msg) => msg.author.id === message.author.id;
            const collector = message.channel.createMessageCollector(filter);

            collector.on('collect', async (msg) => {
                let args = msg.content.split(' ')[0].toUpperCase()
                if (args === 'Y') {
                    egg.query(`SELECT * FROM UsersEggs WHERE guild = ${message.guild.id} AND userid = ${message.author.id}`, async (err, rows) => {
                        if(rows.length === 0) {
                            message.reply(':x: you have no eggs!').then(m => m.delete( {timeout: 5000} ))
                            await m.delete( {timeout: 1000} )
                            collector.stop()
                        }
                        if(rows[0].eggs < 5) {
                            message.reply(`:x: you don't have enough eggs!`).then(m => m.delete( {timeout: 5000} ))
                            await m.delete( {timeout: 1000} )
                            collector.stop()
                        }
                        else {
                            m.delete({ timeout: 5000 })
                            message.channel.send('Rock, paper or scissors').then(() => {
                                collector.stop()
                                egg.query(`UPDATE UsersEggs SET eggs = eggs - 5 WHERE guild = ${message.guild.id} AND userid = ${message.author.id}`, (err, rows) => {
                                    if(err) throw err;
                                    let rps = new RPS(message.author, message.channel, message.guild.id);
                                    rps.CollectorInit();
                                });
                            });
                        }
                    });

                }
                if (args === 'N') {
                    await m.delete()
                    collector.stop()
                }
            });
        });
    }
};