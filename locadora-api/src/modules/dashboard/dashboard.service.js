
const db = require("../../config/database");


function getOverview() {
  const totals = db.prepare(`
    SELECT
      (SELECT COUNT(*) FROM clientes) AS total_clientes,
      (SELECT COUNT(*) FROM veiculos) AS total_veiculos,
      (
        SELECT COUNT(*)
        FROM veiculos
        WHERE status = 'DISPONIVEL'
      ) AS veiculos_disponiveis,
      (SELECT COUNT(*) FROM locacoes) AS total_locacoes,
      (
        SELECT COUNT(*)
        FROM locacoes
        WHERE status = 'ATIVA'
      ) AS locacoes_ativas,
      (
        SELECT COUNT(*)
        FROM locacoes
        WHERE status = 'ATIVA'
          AND date(data_retirada) = date('now', 'localtime')
      ) AS locacoes_previstas_hoje
  `).get();

  // Receita mensal: soma das locações com retirada no mês atual
  const revenue = db.prepare(`
    SELECT
      COALESCE(SUM(valor_total), 0) AS receita_mensal
    FROM locacoes
    WHERE strftime('%Y-%m', data_retirada) =
          strftime('%Y-%m', 'now', 'localtime')
      AND status <> 'CANCELADA'
  `).get();

  const recentRentals = db.prepare(`
    SELECT
      l.id,
      c.nome AS client,
      TRIM(v.marca || ' ' || v.modelo) AS vehicle,
      l.data_retirada AS date,
      l.status
    FROM locacoes l
    INNER JOIN clientes c ON c.id = l.cliente_id
    INNER JOIN veiculos v ON v.id = l.veiculo_id
    ORDER BY l.id DESC
    LIMIT 5
  `).all();

  return {
    cards: {
      totalVeiculos: totals.total_veiculos,
      totalLocacoes: totals.total_locacoes,
      totalClientes: totals.total_clientes,
      receitaMensal: revenue.receita_mensal
    },

    stats: {
      totalClientes: totals.total_clientes,
      totalVeiculos: totals.total_veiculos,
      veiculosDisponiveis: totals.veiculos_disponiveis,
      locacoesAtivas: totals.locacoes_ativas,
      locacoesPrevistasHoje: totals.locacoes_previstas_hoje,
      receitaMensal: revenue.receita_mensal,
      variacaoReceitaMensal: null
    },

    recentRentals
  };
}


function getMetrics() {
  const totals = db.prepare(`
    SELECT
      (SELECT COUNT(*) FROM clientes) AS total_clientes,
      (SELECT COUNT(*) FROM veiculos) AS total_veiculos,
      (
        SELECT COUNT(*)
        FROM veiculos
        WHERE status = 'DISPONIVEL'
      ) AS veiculos_disponiveis,
      (
        SELECT COUNT(DISTINCT veiculo_id)
        FROM locacoes
        WHERE status = 'ATIVA'
      ) AS veiculos_alugados,
      (SELECT COUNT(*) FROM locacoes) AS total_locacoes,
      (
        SELECT COUNT(*)
        FROM locacoes
        WHERE status = 'ATIVA'
      ) AS locacoes_ativas
  `).get();

  // Agrupa as locações por status.
  const statusRows = db.prepare(`
    SELECT
      UPPER(status) AS status,
      COUNT(*) AS total,
      COALESCE(SUM(valor_total), 0) AS faturamento
    FROM locacoes
    GROUP BY UPPER(status)
  `).all();

  const statusMap = Object.fromEntries(
    statusRows.map(row => [row.status, row])
  );

  // Ajuste estes nomes conforme os valores reais do seu banco.
  const finalizadas = statusMap.FINALIZADA?.total ?? 0;
  const canceladas = statusMap.CANCELADA?.total ?? 0;

  const faturamentoTotal =
    Number(statusMap.FINALIZADA?.faturamento ?? 0);

  return {
    totalClientes: totals.total_clientes,
    totalVeiculos: totals.total_veiculos,
    veiculosDisponiveis: totals.veiculos_disponiveis,
    veiculosAlugados: totals.veiculos_alugados,
    totalLocacoes: totals.total_locacoes,
    locacoesAtivas: totals.locacoes_ativas,
    locacoesFinalizadas: finalizadas,
    locacoesCanceladas: canceladas,
    faturamentoTotal,
    ticketMedio: finalizadas > 0
      ? Number((faturamentoTotal / finalizadas).toFixed(2))
      : 0
  };
}

module.exports = { getMetrics, getOverview };
