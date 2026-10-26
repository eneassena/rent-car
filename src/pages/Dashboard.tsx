const cards = [
  { label: 'Veículos', value: '24', color: 'bg-blue-500' },
  { label: 'Locações', value: '12', color: 'bg-emerald-500' },
  { label: 'Clientes', value: '89', color: 'bg-amber-500' },
  { label: 'Receita/Mês', value: 'R$ 18.4k', color: 'bg-violet-500' },
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

      <div className="bg-white rounded-xl p-6 shadow-card border border-slate-100">
        <h2 className="text-lg font-semibold text-slate-800 mb-2">Conteúdo</h2>
        <p className="text-slate-500 text-sm">
          Aqui vão gráficos, últimas locações, alertas, etc.
        </p>
      </div>
    </div>
  );
}