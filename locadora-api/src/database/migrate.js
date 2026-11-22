require("dotenv").config();

const fs = require("fs");
const path = require("path");
const db = require("../config/database.mysql");

async function runMigrations() {
  // Criar tabela de controle de migrations
  await db.execute(`
    CREATE TABLE IF NOT EXISTS migrations (
      id INT AUTO_INCREMENT PRIMARY KEY,
      filename VARCHAR(255) NOT NULL UNIQUE,
      executed_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
    )
  `);

  // Ler arquivos da pasta migrations
  const dir = path.join(__dirname, "migrations");

  const migrations = fs
    .readdirSync(dir)
    .filter((file) => file.endsWith(".sql"))
    .sort();

  // Executar migrations pendentes
  for (const filename of migrations) {
    const [rows] = await db.execute(
      "SELECT id FROM migrations WHERE filename = ?",
      [filename]
    );

    if (rows.length > 0) {
      console.log(`Migration já executada: ${filename}`);
      continue;
    }

    const sql = fs.readFileSync(
      path.join(dir, filename),
      "utf8"
    );

    await db.query(sql);

    await db.execute(
      "INSERT INTO migrations (filename) VALUES (?)",
      [filename]
    );

    console.log(`Migration executada: ${filename}`);
  }

  console.log("Migrations finalizadas.");
}

module.exports = runMigrations;

if (require.main === module) {
  runMigrations()
    .catch((error) => {
      console.error("Erro ao executar migrations:", error);
      process.exitCode = 1;
    })
    .finally(() => db.end());
}
