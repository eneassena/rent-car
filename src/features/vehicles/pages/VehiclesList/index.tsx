import vehiclesData from '@/data/mocks/vehicles.json';
import { useNavigate } from 'react-router-dom';
import { useEffect, useMemo, useState } from 'react';
import { useData } from '@/contexts/dataContext';
import { Vehicle } from '../../types/vehicles';


import DataTable, {
    type Column,
} from "../../../../shared/components/DataTable";
import StatusBadge from '@/shared/components/StatusBadge';
import SearchInput from '@/shared/components/SearchInput';
import TablePagination from '@/shared/components/TablePagination';
import { Plus } from 'lucide-react';
import { ConfirmModal } from '@/shared/components/ConfirmModal';

const VehiclesList = () => {
    const navigate = useNavigate();

    const [vehicles, setVehicles] = useState<Vehicle[]>(vehiclesData as Vehicle[]);
    const [search, setSearch] = useState("");
    const [currentPage, setCurrentPage] = useState(1);
    const [loading, setLoading] = useState(true);
    const [isConfirmModalOpen, setIsConfirmModalOpen] = useState(false);
    const [vehicleToDelete, setVehicleToDelete] = useState<Vehicle | null>(null);
    const context = useData();
    const data = 'data' in context ? context.data : null;

    const pageSize = 10;

    // 1. Buscar clientes
    useEffect(() => {
        async function loadVehicles() {
            try {

                await data?.listVehicle().then((res) => setVehicles(res));
            } catch (error) {
                console.error("Erro ao carregar clientes:", error);
            } finally {
                setLoading(false);
            }
        }

        loadVehicles();
    }, [data]);

    // 2. Definir as colunas
    const columns: Column<Vehicle>[] = [
        {
            accessor: "modelo",
            header: "Modelo",
        },
        {
            accessor: "marca",
            header: "Marca",
        },
        {
            accessor: "ano",
            header: "Ano",
        },
        {
            accessor: "placa",
            header: "Placa",
        },
        {
            accessor: "categoria",
            header: "Categoria",
        },
        {
            accessor: "diaria",
            header: "Diaria",
        },
        {
            accessor: "status",
            header: "Status",
            render: (client) => (
                <StatusBadge
                    label={
                        client.status === "DISPONIVEL" ? "Ativo" : "Inativo"
                    }
                    variant={
                        client.status === "DISPONIVEL" ? "success" : "neutral"
                    }
                />
            ),
        },
    ];

    // 3. Filtrar clientes
    const filteredVehicles = useMemo(() => {
        const term = search.toLowerCase().trim();

        return vehicles.filter((client) =>
            [
                client.modelo,
                client.marca,
                client.ano,
                client.placa,
                client.categoria,
                client.diaria,
            ].some((value) => String(value).toLowerCase().includes(term))
        );
    }, [vehicles, search]);

    // 4. Paginação
    const totalPages = Math.max(
        1,
        Math.ceil(filteredVehicles.length / pageSize)
    );

    const paginatedVehicles = filteredVehicles.slice(
        (currentPage - 1) * pageSize,
        currentPage * pageSize
    );

    // 5. Ação: visualizar
    function handleView(vehicle: Vehicle) {
        navigate(`/veiculos/${vehicle.id}`);
    }

    // 6. Ação: editar
    function handleEdit(vehicle: Vehicle) {
        navigate(`/veiculos/${vehicle.id}/editar`);
    }

    // 7. Ação: excluir
    async function handleDelete(vehicle: Vehicle) {
        if (!vehicleToDelete) return;

        try {
            await data?.deleteVehicle(vehicle.id).catch((error) => {
                console.error("Erro ao excluir veículo:", error);
                throw error;
            });
            navigate('/veiculos');
            // Atualiza o estado após a exclusão
            setVehicles((current) =>
                current.filter((item) => item.id !== vehicle.id)
            );

            setCurrentPage(1);
        } catch (error) {
            console.error("Erro ao excluir veículo:", error);
            alert("Não foi possível excluir o veículo.");
        }
    }

    const handleOnDelete = (vehicle: Vehicle) => {
        setVehicleToDelete(vehicle);
        setIsConfirmModalOpen(true);
    };

    if (loading) {
        return <p className="p-6 text-slate-500">Carregando veículos...</p>;
    }


    return (
        <div className="flex flex-col">
            {/* Cabeçalho */}
            <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
                <div>
                    <h1 className="text-2xl font-semibold text-slate-800">
                        Veículos
                    </h1>
                    <p className="mt-1 text-sm text-slate-500">
                        Gerencie os veículos cadastrados no sistema.
                    </p>
                </div>

                <button
                    type="button"
                    onClick={() => navigate("/veiculos/novo")}
                    className="inline-flex items-center justify-center gap-2 rounded-lg bg-slate-900 px-4 py-2.5 text-sm font-medium text-white transition hover:bg-slate-700"
                >
                    <Plus size={18} />
                    Novo veículo
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
                message={`Deseja realmente excluir o veículo ${vehicleToDelete?.id}?`}
                confirmText="Excluir"
                cancelText="Cancelar"
                onConfirm={() => {
                    if (!vehicleToDelete) return;
                    handleDelete(vehicleToDelete);
                    setIsConfirmModalOpen(false);
                    setVehicleToDelete(null);
                }}
                onCancel={() => {
                    setIsConfirmModalOpen(false);
                    setVehicleToDelete(null);
                }}
            />

            {/* Tabela */}
            <DataTable
                columns={columns}
                data={paginatedVehicles}
                getRowId={(vehicle) => vehicle.id}
                onView={handleView}
                onEdit={handleEdit}
                onDelete={handleOnDelete}
            />

            {/* Paginação */}
            <TablePagination
                currentPage={currentPage}
                totalPages={totalPages}
                totalItems={filteredVehicles.length}
                pageSize={pageSize}
                onPageChange={setCurrentPage}
            />
        </div>
    );
};

export default VehiclesList;
