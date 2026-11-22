
const db = require("../../config/database");


async function getOverview() {
  const [totalRows] = await db.execute(`
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
          AND data_retirada = CURDATE()
      ) AS locacoes_previstas_hoje
  `);
  const totals = totalRows[0];

  // Receita mensal: soma das locações com retirada no mês atual
  const [revenueRows] = await db.execute(`
    SELECT
      COALESCE(SUM(valor_total), 0) AS receita_mensal
    FROM locacoes
    WHERE data_retirada >= DATE_FORMAT(CURDATE(), '%Y-%m-01')
      AND data_retirada < DATE_FORMAT(CURDATE() + INTERVAL 1 MONTH, '%Y-%m-01')
      AND status <> 'CANCELADA'
  `);
  const revenue = revenueRows[0];

  const [recentRentals] = await db.execute(`
    SELECT
      l.id,
      c.nome AS client,
      TRIM(CONCAT(v.marca, ' ', v.modelo)) AS vehicle,
      l.data_retirada AS date,
      l.status
    FROM locacoes l
    INNER JOIN clientes c ON c.id = l.cliente_id
    INNER JOIN veiculos v ON v.id = l.veiculo_id
    ORDER BY l.id DESC
    LIMIT 5
  `);

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


async function getMetrics() {
  const [totalRows] = await db.execute(`
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
  `);
  const totals = totalRows[0];

  // Agrupa as locações por status.
  const [statusRows] = await db.execute(`
    SELECT
      UPPER(status) AS status,
      COUNT(*) AS total,
      COALESCE(SUM(valor_total), 0) AS faturamento
    FROM locacoes
    GROUP BY UPPER(status)
  `);

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
