
export interface DashboardMetrics {
  totalClientes: number;
  totalVeiculos: number;
  veiculosDisponiveis: number;
  veiculosAlugados: number;
  totalLocacoes: number;
  locacoesAtivas: number;
  locacoesFinalizadas: number;
  locacoesCanceladas: number;
  faturamentoTotal: number;
  ticketMedio: number;
}
export interface DashboardOverview {
  cards: {
    totalVeiculos: number;
    totalLocacoes: number;
    totalClientes: number;
    receitaMensal: number | null;
  };
  stats: {
    totalClientes: number;
    totalVeiculos: number;
    veiculosDisponiveis: number;
    locacoesAtivas: number;
    locacoesPrevistasHoje: number;
    receitaMensal: number | null;
    variacaoReceitaMensal: number | null;
  };
  recentRentals: {
    id: number;
    client: string;
    vehicle: string;
    date: string;
    status: string;
  }[];
}