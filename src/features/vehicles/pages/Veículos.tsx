import Views from '@/shared/components/Tables/Views';
import veiculosData from '@/data/mocks/veiculos.json';

 
const veiculosColumns = [
    { header: 'ID', accessor: 'id' },
    { header: 'Modelo', accessor: 'modelo' },
    { header: 'Marca', accessor: 'marca' },
    { header: 'Ano', accessor: 'ano' },
    { header: 'Preço', accessor: 'preco' },
    { header: 'Editar', accessor: 'editar' }
];


export default function Veículos() {
    return (
        <div className="flex flex-col">
            Veículos Page

            <Views data={veiculosData} columns={veiculosColumns} />
        </div>
    );
}