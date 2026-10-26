import TableVeiculos from '@/components/Table/table';
import clientesData from '@/data/mocks/clientes.json';

const clientesColumns = [
    { header: 'ID', accessor: 'id' },
    { header: 'Nome', accessor: 'nome' },
    { header: 'Email', accessor: 'email' },
    { header: 'Telefone', accessor: 'telefone' }
];



export default function Clientes() {
    return (
        <div>
            <h1>Clientes Page</h1>

            <TableVeiculos data={clientesData} columns={clientesColumns} />
        </div>
    );
}