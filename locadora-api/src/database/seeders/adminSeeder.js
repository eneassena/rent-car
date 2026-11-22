const bcrypt = require("bcrypt");
const db = require("../../config/database.mysql");

async function createAdmin() {
  const { ADMIN_NAME, ADMIN_EMAIL, ADMIN_PASSWORD } = process.env;
  if (!ADMIN_NAME || !ADMIN_EMAIL || !ADMIN_PASSWORD) {
    throw new Error("Configure ADMIN_NAME, ADMIN_EMAIL e ADMIN_PASSWORD no .env.");
  }
  if (ADMIN_PASSWORD.length < 12) {
    throw new Error("ADMIN_PASSWORD deve ter pelo menos 12 caracteres.");
  }

  const existing = (await db.execute("SELECT id FROM usuarios LIMIT 1"))[0];
  if (existing.length > 0) {
    console.log("Administrador já cadastrado.");
    return;
  }

  const hash = await bcrypt.hash(ADMIN_PASSWORD, 12);
  await db.execute(
    `INSERT INTO usuarios (nome, email, senha_hash, role)
    VALUES (?, ?, ?, 'ADMIN')`,
    [ADMIN_NAME, ADMIN_EMAIL.toLowerCase().trim(), hash]
  );
  console.log("Administrador criado com sucesso.");
}

module.exports = createAdmin;
