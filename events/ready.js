const mysql = require("mysql");
const db = require("../db").database;

// Database connection
let con = mysql.createPool({
    host: db.host,
    user: db.user,
    password: db.password,
    database: db.database
});
module.exports = (client, message) => {

    // Main SQL queries
    const mainEggSQL = `SELECT timer FROM UsersEggs WHERE timer IS NOT NULL`;
    const mainLvlSQL = `SELECT timer FROM leveling WHERE timer IS NOT NULL`;
    const mainRobSQL = `SELECT timer FROM robtimer WHERE timer IS NOT NULL`;

    // Discord client
    console.log(`${client.user.username}!`);
    client.user.setActivity(`Ping me! 🥚`);

    setInterval(() => {
        // Current date
        let date = new Date();

        // Check the egg timer
        con.query(mainEggSQL, (err, rows) => {
            if (err) return errorMessage(err)
            rows.forEach(e => {
                if (rows.length >= 1) {
                    let time = e.timer
                    if (date > time) {
                        con.query(`UPDATE UsersEggs SET timer = NULL WHERE timer = ${time}`, (err, rows) => {
                            if (err) return errorMessage(err)
                        });
                    }
                }
            });
        });

        // Check rob timer
        // con.query(mainRobSQL, (err, rows) => {
        //     if (err) return errorMessage(err)
        //     rows.forEach(e => {
        //         if (rows.length >= 1) {
        //             let time = e.timer
        //             if (date > time) {
        //                 con.query(`DELETE FROM robtimer WHERE timer = ${time}`, (err, rows) => {
        //                     if (err) return errorMessage(err)
        //                 });
        //             }
        //         }
        //     });
        // });
        
        // Check the leveling timer
        con.query(mainLvlSQL, (err, rows) => {
            if (err) throw err;
            rows.forEach(e => {
                if (rows.length >= 1) {
                    let time = e.timer
                    if (date > time) {
                        con.query(`UPDATE leveling SET timer = NULL WHERE timer = ${time}`, (err, rows) => {
                            if (err) throw err;
                        });
                    }
                }
            });
        });
    }, 1000);

    function errorMessage(err) {
        return message.channel.send(`⚠ - Code: ${err.code} - Please message the developer with the code`);
    }
}