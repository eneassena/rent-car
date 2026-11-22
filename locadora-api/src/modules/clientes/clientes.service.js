const db = require("../../config/database");
const AppError = require("../../utils/AppError");

async function list({ search, page = 1, limit = 20 }) {
  const offset = (page - 1) * limit;
  const term = `%${search || ""}%`;
  const where = search ? "WHERE nome LIKE ? OR cpf LIKE ? OR telefone LIKE ? OR email LIKE ?" : "";
  const params = search ? [term, term, term, term] : [];
  const [counts] = await db.execute(`SELECT COUNT(*) AS total FROM clientes ${where}`, params);
  const [items] = await db.execute(
    `SELECT * FROM clientes ${where} ORDER BY id DESC LIMIT ? OFFSET ?`,
    [...params, limit, offset]
  );
  const total = Number(counts[0].total);
  return { items, pagination: { page, limit, total, pages: Math.ceil(total / limit) } };
}
async function get(id) {
  const [rows] = await db.execute("SELECT * FROM clientes WHERE id = ?", [id]);
  if (!rows.length) throw new AppError("Cliente não encontrado.", 404);
  return rows[0];
}
async function create(data, imagePath) {
  const [result] = await db.execute(
    `INSERT INTO clientes (nome, cpf, telefone, email, endereco, observacoes, imagem_path)
     VALUES (?, ?, ?, ?, ?, ?, ?)`,
    [data.nome, data.cpf, data.telefone, data.email, data.endereco, data.observacoes, imagePath || null]
  );
  return get(result.insertId);
}
async function update(id, data, imagePath) {
  const old = await get(id);
  await db.execute(
    `UPDATE clientes SET nome=?, cpf=?, telefone=?, email=?, endereco=?, observacoes=?,
     imagem_path=?, updated_at=CURRENT_TIMESTAMP WHERE id=?`,
    [data.nome, data.cpf, data.telefone, data.email, data.endereco, data.observacoes, imagePath || old.imagem_path, id]
  );
  return { item: await get(id), oldImage: imagePath ? old.imagem_path : null };
}
async function remove(id) {
  const row = await get(id);
  await db.execute("DELETE FROM clientes WHERE id = ?", [id]);
  return row;
}
module.exports = { list, get, create, update, remove };
