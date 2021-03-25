# Egg bot, very eggsellent 🥚

90% stable. 

# Hosting the bot locally

Put your MySQL credentials into [db.js](db.js) and run the following commands **once**:

- `CREATE TABLE UsersEggs (id int NOT NULL AUTO_INCREMENT PRIMARY KEY, userid VARCHAR(255), eggs int, timer bigint, guild VARCHAR(255));`
- `CREATE TABLE leveling (id int NOT NULL AUTO_INCREMENT PRIMARY KEY, userid VARCHAR(255), xp int, level int, guild VARCHAR(255), timer bigint);`
- `CREATE TABLE prefix (guild VARCHAR(255), prefix VARCHAR(255));`
---
- Add your bot token into [.env](.env) and then run your bot with `node .`
(it's recommended to use [nodemon](https://nodemon.io/) for development)
---

# Host the bot on a server

- Clone the repository and cd into the dir
- Run `npm i`; you need Node.JS v12+! (`node -v` to check version)
- Follow the same database steps as locally.
- Install pm2 if you haven't already; `npm i -g pm2`
- Run `pm2 start index.js`

MySQL version used in development: 8.0.23 (v5+ should work fine)
