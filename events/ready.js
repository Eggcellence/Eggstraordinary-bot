const mysql = require("mysql");
module.exports = (client, message) => {
    console.log(`${client.user.username}!`)
    client.user.setActivity(`🥚`)

    let con = mysql.createPool({
        host: "localhost",
        user: "root",
        password: "abdseyada2",
        database: "egg"
    });

    setInterval(() => {
        let d = new Date();
        con.query(`SELECT timer FROM UsersEggs WHERE timer IS NOT NULL`, (err, rows) => {
            if(err) throw err
            rows.forEach(e => {
                if (rows.length >= 1) {
                    let time = e.timer
                    if (d > time) {
                        con.query(`UPDATE UsersEggs SET timer = NULL WHERE timer = ${time}`, (err, rows) => {
                            if(err) throw err;
                            console.log("timer finished")
                        });
                    }
                }
            });

        });
    }, 1000);
}