require("dotenv").config();
const fs = require("fs");
const path = require("path");
const db = require("../config/database");

db.exec(`
  CREATE TABLE IF NOT EXISTS migrations (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    filename TEXT NOT NULL UNIQUE,
    executed_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
  )
`);

const dir = path.join(__dirname, "migrations");
const migrations = fs.readdirSync(dir).filter(f => f.endsWith(".sql")).sort();

for (const filename of migrations) {
  const done = db.prepare("SELECT id FROM migrations WHERE filename = ?").get(filename);
  if (done) continue;

  const sql = fs.readFileSync(path.join(dir, filename), "utf8");
  db.transaction(() => {
    db.exec(sql);
    db.prepare("INSERT INTO migrations(filename) VALUES (?)").run(filename);
  })();
  console.log(`Migration executada: ${filename}`);
}
console.log("Migrations finalizadas.");
