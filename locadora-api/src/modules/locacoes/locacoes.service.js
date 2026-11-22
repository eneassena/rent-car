
const db = require("../../config/database.mysql");
const AppError = require("../../utils/AppError");

const select = `
  SELECT
    l.*,
    c.nome AS cliente_nome,
    c.cpf AS cliente_cpf,
    v.placa AS veiculo_placa,
    v.marca AS veiculo_marca,
    v.modelo AS veiculo_modelo
  FROM locacoes l
  JOIN clientes c ON c.id = l.cliente_id
  JOIN veiculos v ON v.id = l.veiculo_id
`;

function dateValid(s) {
  if (typeof s !== "string" || !/^\d{4}-\d{2}-\d{2}$/.test(s)) {
    return false;
  }

  const d = new Date(`${s}T00:00:00Z`);

  return (
    !Number.isNaN(d.getTime()) &&
    d.toISOString().slice(0, 10) === s
  );
}

function daysBetween(a, b) {
  return Math.round(
    (Date.parse(`${b}T00:00:00Z`) -
      Date.parse(`${a}T00:00:00Z`)) / 86400000
  );
}

// Busca uma locação
async function get(id) {
  const [rows] = await db.execute(`${select} WHERE l.id = ?`, [id]);

  if (!rows.length) {
    throw new AppError("Locação não encontrada.", 404);
  }

  return rows[0];
}

// Lista locações com filtros e paginação
async function list({
  status,
  cliente_id,
  veiculo_id,
  search,
  page = 1,
  limit = 20,
}) {
  page = Number(page);
  limit = Number(limit);

  const w = [];
  const p = [];

  if (status) {
    w.push("l.status = ?");
    p.push(status);
  }

  if (cliente_id) {
    w.push("l.cliente_id = ?");
    p.push(cliente_id);
  }

  if (veiculo_id) {
    w.push("l.veiculo_id = ?");
    p.push(veiculo_id);
  }
  if (search) {
    w.push("(c.nome LIKE ? OR v.placa LIKE ? OR v.marca LIKE ? OR v.modelo LIKE ?)");
    const term = `%${search}%`;
    p.push(term, term, term, term);
  }

  const where = w.length ? `WHERE ${w.join(" AND ")}` : "";

  const [countRows] = await db.execute(
    `SELECT COUNT(*) AS total FROM locacoes l
     JOIN clientes c ON c.id = l.cliente_id
     JOIN veiculos v ON v.id = l.veiculo_id ${where}`,
    p
  );

  const total = Number(countRows[0].total);

  const offset = (page - 1) * limit;

  const [items] = await db.execute(
    `${select}
     ${where}
     ORDER BY l.id DESC
     LIMIT ? OFFSET ?`,
    [...p, limit, offset]
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

// Valida cliente, veículo, datas e valores
async function validateRelations(connection, d) {
  const [clientes] = await connection.execute(
    "SELECT id FROM clientes WHERE id = ?",
    [d.cliente_id]
  );

  if (!clientes.length) {
    throw new AppError("Cliente não encontrado.", 404);
  }

  // Bloqueia o veículo para evitar locações concorrentes
  const [veiculos] = await connection.execute(
    "SELECT * FROM veiculos WHERE id = ? FOR UPDATE",
    [d.veiculo_id]
  );

  const v = veiculos[0];

  if (!v) {
    throw new AppError("Veículo não encontrado.", 404);
  }

  if (v.status !== "DISPONIVEL") {
    throw new AppError(
      "Veículo não está disponível para locação.",
      409
    );
  }

  if (
    !dateValid(d.data_retirada) ||
    !dateValid(d.data_devolucao) ||
    d.data_devolucao <= d.data_retirada
  ) {
    throw new AppError(
      "Informe datas válidas; devolução deve ser posterior à retirada."
    );
  }

  const days = daysBetween(
    d.data_retirada,
    d.data_devolucao
  );

  if (d.modalidade === "DIARIA") {
    const rate = Number(d.valor_diaria ?? v.valor_diaria);

    if (!Number.isFinite(rate) || rate < 0) {
      throw new AppError("Valor da diária inválido.");
    }

    return {
      valor_diaria: rate,
      valor_fechado: null,
      valor_total: Math.round(rate * days * 100) / 100,
    };
  }

  if (d.modalidade === "PERIODO") {
    const closedValue = Number(d.valor_fechado);

    if (
      d.valor_fechado == null ||
      !Number.isFinite(closedValue) ||
      closedValue < 0
    ) {
      throw new AppError(
        "Informe o valor fechado da locação."
      );
    }

    return {
      valor_diaria: null,
      valor_fechado: closedValue,
      valor_total: Math.round(closedValue * 100) / 100,
    };
  }

  throw new AppError("Modalidade de locação inválida.");
}

// Verifica conflito de datas
async function assertNoConflict(
  connection,
  veiculoId,
  start,
  end,
  ignoreId
) {
  let sql = `
    SELECT id
    FROM locacoes
    WHERE veiculo_id = ?
      AND status = 'ATIVA'
      AND data_retirada < ?
      AND data_devolucao > ?
  `;

  const args = [veiculoId, end, start];

  if (ignoreId) {
    sql += " AND id <> ?";
    args.push(ignoreId);
  }

  sql += " LIMIT 1 FOR UPDATE";

  const [rows] = await connection.execute(sql, args);

  if (rows.length) {
    throw new AppError(
      "Este veículo já possui uma locação ativa nesse intervalo.",
      409
    );
  }
}

// Cria locação
async function create(d, img) {
  const connection = await db.getConnection();
  let insertedId;

  try {
    await connection.beginTransaction();

    const values = await validateRelations(connection, d);

    await assertNoConflict(
      connection,
      d.veiculo_id,
      d.data_retirada,
      d.data_devolucao
    );

    const [result] = await connection.execute(
      `INSERT INTO locacoes (
        cliente_id,
        veiculo_id,
        modalidade,
        data_retirada,
        data_devolucao,
        valor_diaria,
        valor_fechado,
        valor_total,
        observacoes,
        imagem_path
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        d.cliente_id,
        d.veiculo_id,
        d.modalidade,
        d.data_retirada,
        d.data_devolucao,
        values.valor_diaria,
        values.valor_fechado,
        values.valor_total,
        d.observacoes || null,
        img || null,
      ]
    );

    await connection.commit();
    insertedId = result.insertId;
  } catch (error) {
    await connection.rollback();
    throw error;
  } finally {
    connection.release();
  }
  return get(insertedId);
}

// Atualiza locação
async function update(id, d, img) {
  const connection = await db.getConnection();

  let old;

  try {
    await connection.beginTransaction();

    // Busca e bloqueia a locação durante a alteração
    const [rows] = await connection.execute(
      "SELECT * FROM locacoes WHERE id = ? FOR UPDATE",
      [id]
    );

    old = rows[0];

    if (!old) {
      throw new AppError("Locação não encontrada.", 404);
    }

    if (old.status !== "ATIVA") {
      throw new AppError(
        "Somente locações ativas podem ser alteradas.",
        409
      );
    }

    const values = await validateRelations(connection, d);

    await assertNoConflict(
      connection,
      d.veiculo_id,
      d.data_retirada,
      d.data_devolucao,
      id
    );

    await connection.execute(
      `UPDATE locacoes SET
        cliente_id = ?,
        veiculo_id = ?,
        modalidade = ?,
        data_retirada = ?,
        data_devolucao = ?,
        valor_diaria = ?,
        valor_fechado = ?,
        valor_total = ?,
        observacoes = ?,
        imagem_path = ?,
        updated_at = CURRENT_TIMESTAMP
      WHERE id = ?`,
      [
        d.cliente_id,
        d.veiculo_id,
        d.modalidade,
        d.data_retirada,
        d.data_devolucao,
        values.valor_diaria,
        values.valor_fechado,
        values.valor_total,
        d.observacoes || null,
        img || old.imagem_path,
        id,
      ]
    );

    await connection.commit();
  } catch (error) {
    await connection.rollback();
    throw error;
  } finally {
    connection.release();
  }

  return {
    item: await get(id),
    oldImage: img ? old.imagem_path : null,
  };
}

// Altera status
async function changeStatus(id, status) {
  const allowed = ["FINALIZADA", "CANCELADA"];

  if (!allowed.includes(status)) {
    throw new AppError("Status de locação inválido.");
  }

  const connection = await db.getConnection();

  try {
    await connection.beginTransaction();

    const [rows] = await connection.execute(
      "SELECT * FROM locacoes WHERE id = ? FOR UPDATE",
      [id]
    );

    const row = rows[0];

    if (!row) {
      throw new AppError("Locação não encontrada.", 404);
    }

    if (row.status !== "ATIVA") {
      throw new AppError(
        "Esta locação já foi encerrada.",
        409
      );
    }

    await connection.execute(
      `UPDATE locacoes
       SET status = ?, updated_at = CURRENT_TIMESTAMP
       WHERE id = ?`,
      [status, id]
    );

    await connection.commit();
  } catch (error) {
    await connection.rollback();
    throw error;
  } finally {
    connection.release();
  }

  return get(id);
}

// Exclui locação
async function remove(id) {
  const connection = await db.getConnection();

  try {
    await connection.beginTransaction();

    const [rows] = await connection.execute(
      "SELECT * FROM locacoes WHERE id = ? FOR UPDATE",
      [id]
    );

    const row = rows[0];

    if (!row) {
      throw new AppError("Locação não encontrada.", 404);
    }

    if (row.status === "ATIVA") {
      throw new AppError(
        "Cancele ou finalize a locação antes de excluí-la.",
        409
      );
    }

    await connection.execute(
      "DELETE FROM locacoes WHERE id = ?",
      [id]
    );

    await connection.commit();

    return row;
  } catch (error) {
    await connection.rollback();
    throw error;
  } finally {
    connection.release();
  }
}

module.exports = {
  list,
  get,
  create,
  update,
  changeStatus,
  remove,
};
