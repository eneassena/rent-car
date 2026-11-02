
import locacoesData from '@/data/mocks/locacoes.json';
import { useData } from '@/contexts/dataContext';
import Views from '@/shared/components/Tables/Views';


const locacoesColumns = [
    { header: 'Veículo', accessor: 'veiculo' },
    { header: 'Cliente', accessor: 'cliente' },
    { header: 'Data Início', accessor: 'data_inicio' },
    { header: 'Data Fim', accessor: 'data_fim' },
    { header: 'Valor', accessor: 'valor' }
];

export default function Locacoes() {
    const context = useData();
    const data = 'data' in context ? context.data : undefined;

    return (
        <div>
            <h1>Locações Page</h1>
            <p>Data from context: {JSON.stringify(data)}</p>

            <Views data={locacoesData} columns={locacoesColumns} />
        </div>
    );
}