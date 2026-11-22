require('dotenv').config();

const bcrypt = require('bcrypt');
const db = require('../config/database.mysql');
const readline = require('readline');

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

rl.question('Digite a nova senha do administrador: ', async (password) => {
  try {
    if (!password || password.length < 12) {
      throw new Error('A senha deve ter pelo menos 12 caracteres.');
    }

    const passwordHash = await bcrypt.hash(password, 12);

    const [admins] = await db.execute(`
      SELECT id, email
      FROM usuarios
      LIMIT 1
    `);
    const admin = admins[0];

    if (!admin) {
      throw new Error('Administrador não encontrado.');
    }

    console.log(`Atualizando senha para: ${admin.email}`);

    await db.execute(`
      UPDATE usuarios
      SET senha_hash = ?
      WHERE id = ?
    `, [passwordHash, admin.id]);

    console.log(`Senha atualizada para: ${admin.email}`);
  } catch (error) {
    console.error('Erro:', error.message);
    process.exitCode = 1;
  } finally {
    rl.close();
    await db.end();
  }
});