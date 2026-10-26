import TableVeiculos from '@/components/Table/table';
import locacoesData from '@/data/mocks/locacoes.json';


const locacoesColumns = [
    { header: 'Veículo', accessor: 'veiculo' },
    { header: 'Cliente', accessor: 'cliente' },
    { header: 'Data Início', accessor: 'data_inicio' },
    { header: 'Data Fim', accessor: 'data_fim' },
    { header: 'Valor', accessor: 'valor' }
];

export default function Locacoes() {
    return (
        <div>
            <h1>Locações Page</h1>

            <TableVeiculos data={locacoesData} columns={locacoesColumns} />
        </div>
    );
}