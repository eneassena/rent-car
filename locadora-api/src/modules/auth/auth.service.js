const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const db = require("../../config/database");
const AppError = require("../../utils/AppError");

async function login(email, password) {
  const user = db.prepare(`
    SELECT id, nome, email, senha_hash, role, ativo, imagem_path
    FROM usuarios WHERE email = ?
  `).get(email.toLowerCase().trim());

  if (!user || !user.ativo) throw new AppError("Email ou senha inválidos.", 401);
  const valid = await bcrypt.compare(password, user.senha_hash);
  if (!valid) throw new AppError("Email ou senha inválidos.", 401);

  if (!process.env.JWT_SECRET || process.env.JWT_SECRET.length < 32) {
    throw new Error("Configure JWT_SECRET com pelo menos 32 caracteres.");
  }

  const token = jwt.sign(
    { sub: String(user.id), role: user.role },
    process.env.JWT_SECRET,
    { expiresIn: process.env.JWT_EXPIRES_IN || "8h" }
  );
  delete user.senha_hash;
  return { token, user };
}
function me(id) {
  const user = db.prepare(
    "SELECT id, nome, email, role, ativo, imagem_path, created_at FROM usuarios WHERE id = ?"
  ).get(id);
  if (!user) throw new AppError("Usuário não encontrado.", 404);
  return user;
}
module.exports = { login, me };
