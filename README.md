# Egg bot, very eggsellent 🥚

Still in development, not recommended for production!

## Hosting the bot

Put your MySQL credentials into [db.js](db.js) and run the follow command **once**:

- `CREATE TABLE UsersEggs (id int NOT NULL AUTO_INCREMENT PRIMARY KEY, userid VARCHAR(255), eggs int, username VARCHAR(255), timer bigint, guild VARCHAR(255));`
- `CREATE TABLE leveling (id int NOT NULL AUTO_INCREMENT PRIMARY KEY, userid VARCHAR(255), username VARCHAR(255), xp int, level int, guild VARCHAR(255);`

Add your bot token into [.env](.env) and then run your bot with `node .`.
(it's recommended to use [nodemon](https://nodemon.io/) for development)
