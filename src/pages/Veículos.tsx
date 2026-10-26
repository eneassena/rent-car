import TableVeiculos from '@/components/Table/table';
import veiculosData from '@/data/mocks/veiculos.json';

 
const veiculosColumns = [
    { header: 'ID', accessor: 'id' },
    { header: 'Modelo', accessor: 'modelo' },
    { header: 'Marca', accessor: 'marca' },
    { header: 'Ano', accessor: 'ano' },
    { header: 'Preço', accessor: 'preco' }
];


export default function Veículos() {
    return (
        <div className="flex flex-col">
            Veículos Page

            <TableVeiculos data={veiculosData} columns={veiculosColumns} />
        </div>
    );
}