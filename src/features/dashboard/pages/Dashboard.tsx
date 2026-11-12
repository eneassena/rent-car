import { Users, CarFront, ClipboardList, DollarSign, TrendingUp } from "lucide-react";

const cards = [
  { label: "Veículos", value: "42", color: "bg-blue-500" },
  { label: "Locações", value: "18", color: "bg-emerald-500" },
  { label: "Clientes", value: "248", color: "bg-amber-500" },
  { label: "Receita/Mês", value: "R$ 28.5k", color: "bg-violet-500" },
];

// Estatísticas do dashboard
const stats = [
  {
    title: "Total de clientes",
    value: "248",
    description: "+12% este mês",
    icon: Users,
  },
  {
    title: "Veículos cadastrados",
    value: "42",
    description: "36 disponíveis",
    icon: CarFront,
  },
  {
    title: "Locações ativas",
    value: "18",
    description: "6 previstas para hoje",
    icon: ClipboardList,
  },
  {
    title: "Receita mensal",
    value: "R$ 28.450",
    description: "+8,5% este mês",
    icon: DollarSign,
  },
];

// Últimas locações recentes
const recentRentals = [
  {
    id: 1,
    client: "Carlos Oliveira",
    vehicle: "Toyota Corolla",
    date: "01/11/2026",
    status: "Ativa",
  },
  {
    id: 2,
    client: "Mariana Santos",
    vehicle: "Hyundai HB20",
    date: "31/10/2026",
    status: "Pendente",
  },
  {
    id: 3,
    client: "Pedro Almeida",
    vehicle: "Chevrolet Onix",
    date: "30/10/2026",
    status: "Concluída",
  },
];

export default function Dashboard() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-800">Dashboard</h1>
        <p className="text-slate-500 text-sm">Visão geral da sua locadora</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {cards.map((card) => (
          <div
            key={card.label}
            className="bg-white rounded-xl p-5 shadow-card border border-slate-100"
          >
            <div className={`w-10 h-10 rounded-lg ${card.color} mb-3`} />
            <p className="text-sm text-slate-500">{card.label}</p>
            <p className="text-2xl font-bold text-slate-800">{card.value}</p>
          </div>
        ))}
      </div>

      <ItemContentDashboard>
        <h2 className="text-lg font-semibold text-slate-800 mb-2">Métricas</h2>

        {stats.map(({ title, value, description, icon: Icon }) => (
          <div
            key={title}
            className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-slate-500">{title}</p>

                <h2 className="mt-2 text-2xl font-bold text-slate-800">
                  {value}
                </h2>
              </div>

              <div className="rounded-lg bg-blue-50 p-3 text-blue-600">
                <Icon size={24} />
              </div>
            </div>

            <p className="mt-4 text-xs text-slate-500">{description}</p>
          </div>
        ))}
      </ItemContentDashboard>

      <ItemContentDashboard>
        <section className="rounded-xl border border-slate-200 bg-white">
          <div className="flex items-center justify-between border-b border-slate-200 p-5">
            <div>
              <h2 className="font-semibold text-slate-800">
                Locações recentes
              </h2>

              <p className="mt-1 text-sm text-slate-500">
                Últimas movimentações do sistema
              </p>
            </div>

            <TrendingUp className="text-blue-600" size={22} />
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="bg-slate-50 text-slate-500">
                <tr>
                  <th className="px-5 py-4 font-medium">Cliente</th>
                  <th className="px-5 py-4 font-medium">Veículo</th>
                  <th className="px-5 py-4 font-medium">Data</th>
                  <th className="px-5 py-4 font-medium">Status</th>
                </tr>
              </thead>

              <tbody>
                {recentRentals.map((rental) => (
                  <tr key={rental.id} className="border-t border-slate-100">
                    <td className="px-5 py-4 font-medium text-slate-700">
                      {rental.client}
                    </td>

                    <td className="px-5 py-4 text-slate-600">
                      {rental.vehicle}
                    </td>

                    <td className="px-5 py-4 text-slate-600">{rental.date}</td>

                    <td className="px-5 py-4">
                      <span
                        className={`rounded-full px-3 py-1 text-xs font-medium ${
                          rental.status === "Ativa"
                            ? "bg-green-100 text-green-700"
                            : rental.status === "Pendente"
                              ? "bg-yellow-100 text-yellow-700"
                              : "bg-slate-100 text-slate-600"
                        }`}
                      >
                        {rental.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>
      </ItemContentDashboard>
    </div>
  );
}

const ItemContentDashboard = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="bg-white rounded-xl p-6 shadow-card border border-slate-100">
      {children}
    </div>
  );
};
