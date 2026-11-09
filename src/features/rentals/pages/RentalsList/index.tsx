
import { useNavigate } from 'react-router-dom';
import { useEffect, useMemo, useState } from 'react';
import Rental from '../../types/types';

import DataTable, {
    type Column,
} from "../../../../shared/components/DataTable";
import SearchInput from '@/shared/components/SearchInput';
import TablePagination from '@/shared/components/TablePagination';
import { Plus } from 'lucide-react';
import { ConfirmModal } from '@/shared/components/ConfirmModal';
import rentalsServices, { RentalParams } from '@/features/rentals/services/rentals.service';
import { Pagination } from '@/types/globals';

const RentalsList = () => {
    const navigate = useNavigate();
    const [rentals, setRentals] = useState<Rental[]>([]);
    const [search, setSearch] = useState("");
    const [loading, setLoading] = useState(true);

    const [isConfirmModalOpen, setIsConfirmModalOpen] = useState(false);
    const [rentalToDelete, setRentalToDelete] = useState<Rental | null>(null);
    const [pagination, setPagination] = useState<Pagination>({
        page: 1,
        limit: 10,
        total: 0,
        pages: 0,
    });

    async function loadRentals() {
        try {
            const param: RentalParams = {
                page: pagination.page,
                limit: pagination.limit,
            };
            const response = await rentalsServices.list(param);
            console.log(`Response from rentalsServices.list:`, response.items);
            setRentals(response.items);
            setPagination(response.pagination);
            // const response = await rentalsServices.list(param);
            // console.log(`Response from rentalsServices.list:`, response.items);
            // setRentals(response.items);
            // setPagination(response.pagination);
        } catch (error) {
            console.error("Erro ao carregar clientes:", error);
        } finally {
            setLoading(false);
        }
    }

    // 1. Buscar clientes
    useEffect(() => {
        loadRentals();
    }, []);

    // 2. Definir as colunas
    const columns: Column<Rental>[] = [
        {
            accessor: "cliente_nome",
            header: "Cliente",
        },
        {
            accessor: "veiculo_placa",
            header: "Veiculo",
        },
        {
            accessor: "data_retirada",
            header: "Data Início",
        },
        {
            accessor: "data_devolucao",
            header: "Data Fim",
        },
        {
            accessor: "valor_diaria",
            header: "Valor Diária",
        },
        {
            accessor: "valor_fechado",
            header: "Valor Fechado",
        },
        {
            accessor: "valor_total",
            header: "Valor Total",
        },
        {
            accessor: "modalidade",
            header: "Modalidade",
        },
        {
            accessor: "status",
            header: "Status",
        },
    ];



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
            await rentalsServices.delete(Number(rental.id));
            navigate('/locacoes');
            // Atualiza o estado após a exclusão
            setRentals((current) =>
                current.filter((item) => item.id !== rental.id)
            );

            setPagination((current) => ({ ...current, page: 1 }));
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
                        setPagination((current) => ({ ...current, page: 1 }));
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
                data={rentals}
                getRowId={(rental) => rental.id}
                onView={handleView}
                onEdit={handleEdit}
                onDelete={handleOnDelete}
            />

            {/* Paginação */}
            <TablePagination
                currentPage={pagination.page}
                totalPages={pagination.pages}
                totalItems={pagination.total}
                pageSize={pagination.limit}
                onPageChange={(page) => setPagination((current) => ({ ...current, page }))}
            />

        </div>
    );
};

export default RentalsList;
