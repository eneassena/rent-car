const db = require("../../config/database");
const AppError = require("../../utils/AppError");
function list({ search, status, page = 1, limit = 20 }) {
  const clauses = [],
    params = [];
  if (search) {
    clauses.push("(placa LIKE ? OR marca LIKE ? OR modelo LIKE ?)");
    const t = `%${search}%`;
    params.push(t, t, t);
  }
  if (status) {
    clauses.push("status = ?");
    params.push(status);
  }
  const where = clauses.length ? `WHERE ${clauses.join(" AND ")}` : "";
  const total = db
    .prepare(`SELECT COUNT(*) total FROM veiculos ${where}`)
    .get(...params).total;
  const items = db
    .prepare(
      `SELECT * FROM veiculos ${where} ORDER BY id DESC LIMIT ? OFFSET ?`,
    )
    .all(...params, limit, (page - 1) * limit);
  return {
    items,
    pagination: { page, limit, total, pages: Math.ceil(total / limit) },
  };
}
function get(id) {
  const v = db.prepare("SELECT * FROM veiculos WHERE id=?").get(id);
  if (!v) throw new AppError("Veículo não encontrado.", 404);
  return v;
}
function create(d, img) {
  const r = db
    .prepare(
      `INSERT INTO veiculos(placa,marca,modelo,ano,cor,valor_diaria,status,observacoes,imagem_path)
 VALUES(@placa,@marca,@modelo,@ano,@cor,@valor_diaria,@status,@observacoes,@imagem_path)`,
    )
    .run({
      ...d,
      placa: d.placa.replace(/[^a-zA-Z0-9]/g, "").toUpperCase(),
      imagem_path: img || null,
    });
  return get(r.lastInsertRowid);
}
function update(id, d, img) {
  const old = get(id);
  db.prepare(
    `UPDATE veiculos SET placa=@placa,marca=@marca,modelo=@modelo,ano=@ano,cor=@cor,
 valor_diaria=@valor_diaria,status=@status,observacoes=@observacoes,imagem_path=@imagem_path,
 updated_at=CURRENT_TIMESTAMP WHERE id=@id`,
  ).run({
    ...d,
    placa: d.placa.replace(/[^a-zA-Z0-9]/g, "").toUpperCase(),
    imagem_path: img || old.imagem_path,
    id,
  });
  return { item: get(id), oldImage: img ? old.imagem_path : null };
}
function remove(id) {
  const v = get(id);
  db.prepare("DELETE FROM veiculos WHERE id=?").run(id);
  return v;
}
function availability(start, end) {
  if (!isDate(start) || !isDate(end) || end <= start)
    throw new AppError(
      "Informe datas válidas; devolução deve ser posterior à retirada.",
    );
  return db
    .prepare(
      `
 SELECT v.* FROM veiculos v
 WHERE v.status='DISPONIVEL'
 AND NOT EXISTS (
   SELECT 1 FROM locacoes l WHERE l.veiculo_id=v.id AND l.status='ATIVA'
   AND l.data_retirada < ? AND l.data_devolucao > ?
 )
 ORDER BY v.id DESC
 `,
    )
    .all(end, start);
}
function isDate(s) {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(s)) return false;
  const d = new Date(`${s}T00:00:00Z`);
  return !Number.isNaN(d.getTime()) && d.toISOString().slice(0, 10) === s;
}
module.exports = { list, get, create, update, remove, availability };
