const db = require("../../config/database");
const AppError = require("../../utils/AppError");

function list({ search, page = 1, limit = 20 }) {
  const offset = (page - 1) * limit;
  const term = `%${search || ""}%`;
  const where = search ? "WHERE nome LIKE ? OR cpf LIKE ? OR telefone LIKE ?" : "";
  const params = search ? [term, term, term] : [];
  const total = db.prepare(`SELECT COUNT(*) AS total FROM clientes ${where}`).get(...params).total;
  const rows = db.prepare(`
    SELECT * FROM clientes ${where}
    ORDER BY id DESC LIMIT ? OFFSET ?
  `).all(...params, limit, offset);
  return { items: rows, pagination: { page, limit, total, pages: Math.ceil(total / limit) } };
}
function get(id) {
  const row = db.prepare("SELECT * FROM clientes WHERE id = ?").get(id);
  if (!row) throw new AppError("Cliente não encontrado.", 404);
  return row;
}
function create(data, imagePath) {
  const result = db.prepare(`
    INSERT INTO clientes (nome, cpf, telefone, email, endereco, observacoes, imagem_path)
    VALUES (@nome, @cpf, @telefone, @email, @endereco, @observacoes, @imagem_path)
  `).run({ ...data, imagem_path: imagePath || null });
  return get(result.lastInsertRowid);
}
function update(id, data, imagePath) {
  get(id);
  const old = get(id);
  const nextImage = imagePath || old.imagem_path;
  db.prepare(`
    UPDATE clientes SET nome=@nome, cpf=@cpf, telefone=@telefone, email=@email,
      endereco=@endereco, observacoes=@observacoes, imagem_path=@imagem_path,
      updated_at=CURRENT_TIMESTAMP WHERE id=@id
  `).run({ ...data, imagem_path: nextImage, id });
  return { item: get(id), oldImage: imagePath ? old.imagem_path : null };
}
function remove(id) {
  const row = get(id);
  db.prepare("DELETE FROM clientes WHERE id = ?").run(id);
  return row;
}
module.exports = { list, get, create, update, remove };
