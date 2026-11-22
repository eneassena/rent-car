
const db = require("../../config/database.mysql");
const AppError = require("../../utils/AppError");

// Lista veículos com filtros e paginação
async function list({ search, status, page = 1, limit = 20 }) {
  page = Number(page);
  limit = Number(limit);

  const clauses = [];
  const params = [];

  if (search) {
    clauses.push("(placa LIKE ? OR marca LIKE ? OR modelo LIKE ?)");
    const t = `%${search}%`;
    params.push(t, t, t);
  }

  if (status) {
    clauses.push("status = ?");
    params.push(status);
  }

  const where = clauses.length
    ? `WHERE ${clauses.join(" AND ")}`
    : "";

  // Total de registros
  const [countRows] = await db.execute(
    `SELECT COUNT(*) AS total FROM veiculos ${where}`,
    params
  );

  const total = Number(countRows[0].total);

  // Dados paginados
  const offset = (page - 1) * limit;

  const [items] = await db.execute(
    `SELECT * FROM veiculos
     ${where}
     ORDER BY id DESC
     LIMIT ? OFFSET ?`,
    [...params, limit, offset]
  );

  return {
    items,
    pagination: {
      page,
      limit,
      total,
      pages: Math.ceil(total / limit),
    },
  };
}

// Busca veículo por ID
async function get(id) {
  const [rows] = await db.execute(
    "SELECT * FROM veiculos WHERE id = ?",
    [id]
  );

  if (!rows.length) {
    throw new AppError("Veículo não encontrado.", 404);
  }

  return rows[0];
}

// Cria veículo
async function create(d, img) {
  const placa = d.placa
    .replace(/[^a-zA-Z0-9]/g, "")
    .toUpperCase();

  const [result] = await db.execute(
    `INSERT INTO veiculos (
      placa,
      marca,
      modelo,
      ano,
      cor,
      valor_diaria,
      status,
      observacoes,
      imagem_path
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
    [
      placa,
      d.marca,
      d.modelo,
      d.ano ?? null,
      d.cor ?? null,
      d.valor_diaria,
      d.status || "DISPONIVEL",
      d.observacoes ?? null,
      img || null,
    ]
  );

  return get(result.insertId);
}

// Atualiza veículo
async function update(id, d, img) {
  const old = await get(id);

  const placa = d.placa
    .replace(/[^a-zA-Z0-9]/g, "")
    .toUpperCase();

  await db.execute(
    `UPDATE veiculos SET
      placa = ?,
      marca = ?,
      modelo = ?,
      ano = ?,
      cor = ?,
      valor_diaria = ?,
      status = ?,
      observacoes = ?,
      imagem_path = ?,
      updated_at = CURRENT_TIMESTAMP
    WHERE id = ?`,
    [
      placa,
      d.marca,
      d.modelo,
      d.ano ?? null,
      d.cor ?? null,
      d.valor_diaria,
      d.status,
      d.observacoes ?? null,
      img || old.imagem_path,
      id,
    ]
  );

  return {
    item: await get(id),
    oldImage: img ? old.imagem_path : null,
  };
}

// Remove veículo
async function remove(id) {
  const v = await get(id);

  await db.execute(
    "DELETE FROM veiculos WHERE id = ?",
    [id]
  );

  return v;
}

// Consulta veículos disponíveis para determinado período
async function availability(start, end) {
  if (!isDate(start) || !isDate(end) || end <= start) {
    throw new AppError(
      "Informe datas válidas; devolução deve ser posterior à retirada."
    );
  }

  const [rows] = await db.execute(
    `
    SELECT v.*
    FROM veiculos v
    WHERE v.status = 'DISPONIVEL'
      AND NOT EXISTS (
        SELECT 1
        FROM locacoes l
        WHERE l.veiculo_id = v.id
          AND l.status = 'ATIVA'
          AND l.data_retirada < ?
          AND l.data_devolucao > ?
      )
    ORDER BY v.id DESC
    `,
    [end, start]
  );

  return rows;
}

// Valida data no formato YYYY-MM-DD
function isDate(s) {
  if (typeof s !== "string" || !/^\d{4}-\d{2}-\d{2}$/.test(s)) {
    return false;
  }

  const d = new Date(`${s}T00:00:00Z`);

  return (
    !Number.isNaN(d.getTime()) &&
    d.toISOString().slice(0, 10) === s
  );
}

module.exports = {
  list,
  get,
  create,
  update,
  remove,
  availability,
};
