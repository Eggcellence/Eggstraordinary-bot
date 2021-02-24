const Discord = require("discord.js");
const mysql = require("mysql");

let egg = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "abdseyada2",
    database: "egg"
});
let EggsClaimed = new Set();

//  UsersEggs (userid int, eggs int);

module.exports = {
    name: 'egg',
    category: 'egg',
    owner: true,
    run: async (client, message, args) => {

        const eggs = ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9', '10'];
        const randomEggs = Math.floor(Math.random() * eggs.length);
        const userid = message.author.id
        const username = message.author.username


        if (EggsClaimed.has(userid)) {
            message.channel.send("You already claimed your chance for today, come back tomorrow!")
        } else {
            egg.query(`SELECT * FROM UsersEggs WHERE userid = ${userid}`, (err, result) => {
                if (err) message.channel.send(`Error occured, code: ${err.code} - Please contact the developer`)
                if (result.length === 0) {
                    egg.query(`INSERT INTO UsersEggs (userid, eggs) VALUES (${userid}, ${eggs[randomEggs]})`, (err, result) => {
                        if (err) message.channel.send(`Error occured, code: ${err.code} - Please contact the developer`)
                        if (eggs[randomEggs] === '0') {
                            message.channel.send('Oh dear, no eggs left for you! Good luck tomorrow.')
                        } else {
                            message.channel.send(`You got ${eggs[randomEggs]}. Come back tomorrow for some more!`)
                        }

                    })
                } else {
                    egg.query(`UPDATE UsersEggs SET eggs = eggs + ${eggs[randomEggs]} WHERE userid = '${userid}'`, (err, result) => {
                        if (err) message.channel.send(`Error occured, code: ${err.code} - Please contact the developer`)
                        if (eggs[randomEggs] === '0') {
                            message.channel.send('Oh dear, no eggs left for you! Good luck tomorrow.')
                        } else {
                            message.channel.send(`You got ${eggs[randomEggs]}. Come back tomorrow for some more!`)
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
};