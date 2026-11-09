const Database = require("better-sqlite3");
const path = require("path");
const fs = require("fs");
require("dotenv").config();

const databasePath = path.resolve(process.env.DATABASE_PATH || "./data/database.sqlite");
 

fs.mkdirSync(path.dirname(databasePath), { recursive: true });

const db = new Database(databasePath, {
    timeout: 10000,
});
db.pragma("foreign_keys = ON");
db.pragma("journal_mode = WAL");
db.pragma("busy_timeout = 1000");

console.log("Banco SQLite utilizado:", databasePath);
console.log("Journal mode:", db.pragma("journal_mode"));
console.log("Busy timeout:", db.pragma("busy_timeout"));

module.exports = db;
