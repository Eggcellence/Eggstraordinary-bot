module.exports = {
    name: 'rps',
    aliases: ['rock paper scissors'],
    category: 'games',
    run: async (client, message, args, egg, Discord) => {
        let options = ['rock', 'paper', 'scissors'];
        class RPS {
            constructor(user_, channel_) {
                this.user = user_;
                this.channel = channel_;
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
                this.collector = this.channel.createMessageCollector(this.filter);
                
                this.collector.on('collect', msg => this.onCollect(msg));
                this.collector.on('end', collected => this.onEnd(collected));
            }

             onCollect(msg) {
                if(!this.checkInput(msg)) return;
                this.compare();
                this.collector.stop();

                this.Embed()
            }

            onEnd(collected) {}

            checkInput(input_) { 
                let input = input_.content.split(' ')[0].toLowerCase();
                let choice = options.some(a => input === a);
                this.pick = input;
                return choice;
            }

            compare() {

                if(this.pick === 'rock' && this.AI === 'scissors') this.winner = "YOU";
                if(this.pick === 'paper' && this.AI === 'rock') this.winner = "YOU";
                if(this.pick === 'scissors' && this.AI === 'paper') this.winner = "YOU";

                if(this.AI === 'rock' && this.pick === 'scissors') this.winner = "Eggstraordinary";
                if(this.AI === 'paper' && this.pick === 'rock') this.winner = "Eggstraordinary";
                if(this.AI === 'scissors' && this.pick === 'paper') this.winner = "Eggstraordinary";

                if(this.pick === this.AI)  this.winner = 'Tie';
            }

            Embed() {
                const embed = new Discord.MessageEmbed()
                    .setTitle(`Winner is: ${this.winner}`)
                    .setDescription(`Your choice: **${this.pick}**\n AI choice: **${this.AI}**`)
                    .setColor(this.winner === 'YOU' ? 'GREEN' : 'RED')
                    this.channel.send(embed)
            }
        }

        message.channel.send('Rock, paper or scissors').then(() => {
            let rps = new RPS(message.author, message.channel);
            rps.CollectorInit();
        });
    }
};