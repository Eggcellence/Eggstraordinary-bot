const Discord = require("discord.js");

let EggsClaimed = new Set();

//  UsersEggs (userid int, eggs int);

module.exports = {
    name: 'egg',
    category: 'egg',
    owner: true,
    run: async (client, message, args, egg) => {

        const eggs = ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9', '10'];
        const randomEggs = Math.floor(Math.random() * eggs.length);
        const userid = message.author.id
        const username = message.author.username

        if(args[0] === 'add') {
            const addU = args[1]
            const amount = args[2]

            egg.query(`SELECT * FROM UsersEggs WHERE userid = ?`, `${addU}`, (err, result) => {
                if (err) return message.channel.send(`⚠ - Code: ${err.code} - Please message the developer with the code`)
                if(result.length !== 0) {
                    egg.query(`UPDATE UsersEggs SET eggs = eggs + ? WHERE userid = ${addU}`, amount, (err, result) => {
                        if (err) return message.channel.send(`⚠ - Code: ${err.code} - Please message the developer with the code`)
                        message.channel.send(`Successfully added **${amount}** 🥚 to ID **${addU}**`)
                    })
                } else {
                    message.channel.send(`User with the ID **${addU}** not found`)
                }
            })
        } else 
{
        if (EggsClaimed.has(userid)) {
            message.channel.send("You already claimed your chance for today, come back tomorrow!")
        } else {
            egg.query(`SELECT * FROM UsersEggs WHERE userid = ${userid}`, (err, result) => {
                if (err) return message.channel.send(`⚠ - Code: ${err.code} - Please message the developer with the code`)
                if (result.length === 0) {
                    egg.query(`INSERT INTO UsersEggs (userid, eggs, username) VALUES (${userid}, ${eggs[randomEggs]}, '${username}')`, (err, result) => {
                        if (err) return message.channel.send(`⚠ - Code: ${err.code} - Please message the developer with the code`)
                        if (eggs[randomEggs] === '0') {
                            message.channel.send('Oh dear, no 🥚 left for you! Good luck tomorrow.')
                        } else {
                            message.channel.send(`You got ${eggs[randomEggs]} 🥚. Come back tomorrow for some more!`)
                        }

                    })
                } else {
                    egg.query(`UPDATE UsersEggs SET eggs = eggs + ${eggs[randomEggs]} WHERE userid = '${userid}'`, (err, result) => {
                        if (err) return message.channel.send(`⚠ - Code: ${err.code} - Please message the developer with the code`)
                        if (eggs[randomEggs] === '0') {
                            message.channel.send('Oh dear, no 🥚 left for you! Good luck tomorrow.')
                        } else {
                            message.channel.send(`You got ${eggs[randomEggs]} 🥚. Come back tomorrow for some more!`)
                        }

                    })
                }
            })

            EggsClaimed.add(userid)
            setTimeout(() => {
                EggsClaimed.delete(userid)
            }, 10000)
        }
}


    }
};