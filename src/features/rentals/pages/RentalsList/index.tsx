
import { useNavigate } from 'react-router-dom';
import { useEffect, useMemo, useState } from 'react';
import Rental from '../../types/types';

import DataTable, {
    type Column,
} from "../../../../shared/components/DataTable";
import SearchInput from '@/shared/components/SearchInput';
import TablePagination from '@/shared/components/TablePagination';
import { Plus } from 'lucide-react';
import { useData } from '@/contexts/dataContext';
import { ConfirmModal } from '@/shared/components/ConfirmModal';

const RentalsList = () => {
    const context = useData();
    const data = 'data' in context ? context.data : undefined;

    const navigate = useNavigate();
    const [rentals, setRentals] = useState<Rental[]>([]);
    const [search, setSearch] = useState("");
    const [currentPage, setCurrentPage] = useState(1);
    const [loading, setLoading] = useState(true);

    const [isConfirmModalOpen, setIsConfirmModalOpen] = useState(false);
    const [rentalToDelete, setRentalToDelete] = useState<Rental | null>(null);

    const pageSize = 10;

    // 1. Buscar clientes
    useEffect(() => {
        async function loadVehicles() {
            try {
                if (data?.rentals) {
                    data.rentals.then(rentals => rentals && setRentals(rentals));
                }
            } catch (error) {
                console.error("Erro ao carregar clientes:", error);
            } finally {
                setLoading(false);
            }
        }

        loadVehicles();
    }, [data]);

    // 2. Definir as colunas
    const columns: Column<Rental>[] = [
        {
            accessor: "veiculo",
            header: "Veiculo",
        },
        {
            accessor: "cliente",
            header: "Cliente",
        },
        {
            accessor: "data_inicio",
            header: "Data Início",
        },
        {
            accessor: "data_fim",
            header: "Data Fim",
        },
        {
            accessor: "valor",
            header: "Valor",
        },
    ];

    // 3. Filtrar clientes
    const filteredRentals = useMemo(() => {
        const term = search.toLowerCase().trim();

        return rentals.filter((rental) =>
            [
                rental.veiculo,
                rental.cliente,
                rental.data_inicio,
                rental.data_fim,
                rental.valor,
            ].some((value) => value.toString().toLowerCase().includes(term))
        );
    }, [rentals, search]);

    // 4. Paginação
    const totalPages = Math.max(
        1,
        Math.ceil(filteredRentals.length / pageSize)
    );

    const paginatedRentals = filteredRentals.slice(
        (currentPage - 1) * pageSize,
        currentPage * pageSize
    );

    // 5. Ação: visualizar
    function handleView(rental: Rental) {
        navigate(`/locacoes/${rental.id}`);
    }

    // 6. Ação: editar
    function handleEdit(rental: Rental) {
        navigate(`/locacoes/${rental.id}/editar`);
    }

    // 7. Ação: excluir
    async function handleDelete(rental: Rental) {
        if (!rentalToDelete) return;

        try {
            await data?.deleteRental(rental.id).catch((error) => {
                console.error("Erro ao excluir locação:", error);
                throw error;
            });
            navigate('/locacoes');
            // Atualiza o estado após a exclusão
            setRentals((current) =>
                current.filter((item) => item.id !== rental.id)
            );

            setCurrentPage(1);
        } catch (error) {
            console.error("Erro ao excluir locação:", error);
            alert("Não foi possível excluir a locação.");
        }
    }

    const handleOnDelete = (rental: Rental) => {
        setRentalToDelete(rental);
        setIsConfirmModalOpen(true);
    };

    if (loading) {
        return <p className="p-6 text-slate-500">Carregando locações...</p>;
    }


    return (
        <div className="flex flex-col">
            {/* Cabeçalho */}
            <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
                <div>
                    <h1 className="text-2xl font-semibold text-slate-800">
                        Locações
                    </h1>
                    <p className="mt-1 text-sm text-slate-500">
                        Gerencie as locações cadastradas no sistema.
                    </p>
                </div>

                <button
                    type="button"
                    onClick={() => navigate("/locacoes/novo")}
                    className="inline-flex items-center justify-center gap-2 rounded-lg bg-slate-900 px-4 py-2.5 text-sm font-medium text-white transition hover:bg-slate-700"
                >
                    <Plus size={18} />
                    Nova locação
                </button>
            </div>

            {/* Pesquisa */}
            <div className="max-w-md">
                <SearchInput
                    value={search}
                    onChange={(value) => {
                        setSearch(value);
                        setCurrentPage(1);
                    }}
                    placeholder="Buscar por modelo, placa ou ano..."
                />
            </div>

            <ConfirmModal
                isOpen={isConfirmModalOpen}
                title="Confirmar exclusão"
                message={`Deseja realmente excluir a locação ${rentalToDelete?.id}?`}
                confirmText="Excluir"
                cancelText="Cancelar"
                onConfirm={() => {
                    if (!rentalToDelete) return;
                    handleDelete(rentalToDelete);
                    setIsConfirmModalOpen(false);
                    setRentalToDelete(null);
                }}
                onCancel={() => {
                    setIsConfirmModalOpen(false);
                    setRentalToDelete(null);
                }}
            />

            {/* Tabela */}
            <DataTable
                columns={columns}
                data={paginatedRentals}
                getRowId={(rental) => rental.id}
                onView={handleView}
                onEdit={handleEdit}
                onDelete={handleOnDelete}
            />

            {/* Paginação */}
            <TablePagination
                currentPage={currentPage}
                totalPages={totalPages}
                totalItems={filteredRentals.length}
                pageSize={pageSize}
                onPageChange={setCurrentPage}
            />
        </div>
    );
};

export default RentalsList;
