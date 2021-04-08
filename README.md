# Egg bot, very eggsellent 🥚

So what is Eggstraordinary? An incomplete yet stable egg bot. Please if you have any issues/questions regarding this don't hesitate to join our [support server](https://discord.gg/6rF4XxXdt6)
But what if I told you it's actually a bot that I use to learn new things? For example in this bot I got better at classes and using MySQL by creating eggconomy and leveling. Pretty cool huh.

# Hosting the bot locally

Put your MySQL credentials into [db.js](db.js) and run the following commands **once**:

- `CREATE TABLE UsersEggs (id int NOT NULL AUTO_INCREMENT PRIMARY KEY, userid VARCHAR(255), eggs int, timer bigint, guild VARCHAR(255));`
- `CREATE TABLE leveling (id int NOT NULL AUTO_INCREMENT PRIMARY KEY, userid VARCHAR(255), xp int, level int, guild VARCHAR(255), timer bigint);`
- `CREATE TABLE prefix (guild VARCHAR(255), prefix VARCHAR(255));`
- `CREATE TABLE disabledcmd (guild VARCHAR(255), cmd VARCHAR(255));`
- `CREATE TABLE inventory (id int NOT NULL AUTO_INCREMENT PRIMARY KEY, userid VARCHAR(255), guild VARCHAR(255), timer bigint, Chicken int NOT NULL DEFAULT 0, Farm int NOT NULL DEFAULT 0, Frog int NOT NULL DEFAULT 0, Duck int NOT NULL DEFAULT 0);`
- `CREATE TABLE disablemsg (guild VARCHAR(255), msg int);`
- `CREATE TABLE robtimer (id int NOT NULL AUTO_INCREMENT PRIMARY KEY, guild VARCHAR(255), userid VARCHAR(255), timer bigint);`

- Add your bot token into (create it) [.env](.env) and then run your bot with `node .`
(it's recommended to use [nodemon](https://nodemon.io/) for development)
---

# Host the bot on a server

- Clone the repository and cd into the directory
- Run `npm i`; you need Node.JS v12+! (`node -v` to check version)
- Follow the same database steps as locally.
- Install pm2 if you haven't already; `npm i -g pm2`
- Run `pm2 start index.js`

MySQL version used in development: 8.0.23 (v5+ should work fine)