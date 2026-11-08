import type {
    Vehicle,
} from "@/features/vehicles/types/vehicles";
import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
    CarFront,
    Factory,
    CalendarDays,
    RectangleEllipsis,
    CircleCheck,
} from "lucide-react";
import StatusBadge from "@/shared/components/StatusBadge";
import HeaderPage from "../../components/HeaderPage";
import { VehicleImage } from "@/shared/components/VehicleImage";
import { useData } from "@/contexts/dataContext";
import { vehiclesServices } from "../../services/vehicles.service";

const VehiclesDetails = () => {
    const navigate = useNavigate();
    const { id } = useParams<{ id: string }>();
    const [vehicle, setVehicle] = useState<Vehicle | null>(null);
    const [loading, setLoading] = useState(true);


    async function loadVehicle() {
        try {
            if (!id) {
                setVehicle(null);
                return;
            }
            setLoading(true);
            const response = await vehiclesServices.getById(Number(id));
            if (response) {
                setVehicle(response);
                console.log(response.imagem_path);
            }
        } catch (error) {
            console.error("Erro ao buscar veículo:", error);
            setVehicle(null);
        } finally {

            setLoading(false);

        }
    }
    
    useEffect(() => {
        loadVehicle();
    }, []);

    const handleEdit = () => {
        if (vehicle) {
            navigate(`/veiculos/${vehicle.id}/editar`);
        }
    };

    const handleBack = () => {
        navigate("/veiculos");
    };

    if (loading) {
        return (
            <div className="flex min-h-64 items-center justify-center">
                <p className="text-sm text-slate-500">Carregando dados do veículo...</p>
            </div>
        );
    }

    if (!vehicle) {
        return (
            <div className="flex flex-col items-center justify-center rounded-xl border border-slate-200 bg-white px-6 py-16 shadow-sm">
                <CarFront size={40} className="mb-3 text-slate-300" />

                <h2 className="text-lg font-semibold text-slate-800">
                    Veículo não encontrado
                </h2>

                <p className="mt-1 text-sm text-slate-500">
                    Não foi possível localizar os dados deste veículo.
                </p>

                <button
                    type="button"
                    onClick={handleBack}
                    className="mt-5 rounded-lg bg-slate-900 px-4 py-2 text-sm font-medium text-white transition hover:bg-slate-700"
                >
                    Voltar para veículos
                </button>
            </div>
        );
    }

    const status =
        vehicle.status === "DISPONIVEL"
            ? { label: "Disponível", variant: "success" as const }
            : vehicle.status === "LOCADO"
                ? { label: "Locado", variant: "warning" as const }
                : vehicle.status === "MANUTENCAO"
                    ? { label: "Manutenção", variant: "danger" as const }
                    : { label: "Inativo", variant: "neutral" as const };

    return (
        <div className="space-y-6">
            {/* Cabeçalho */}
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <HeaderPage
                    handleBack={handleBack}
                    textVoltar="Voltar para veículos"
                    textDetalhes="Detalhes do veículo"
                    textPreencha="Preencha os detalhes do veículo"
                    handleEdit={handleEdit}
                    textEditar="Editar veículo"
                />
            </div>

            {/* Identificação */}
            <div className="rounded-xl border p-6 border-slate-200 bg-white shadow-sm">
                <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
                    <div className="flex h-40 w-64 flex-none items-center justify-center overflow-hidden rounded-xl bg-slate-100">
                        <VehicleImage
                            src={vehicle.imagem_path}
                            alt={`${vehicle.marca} ${vehicle.modelo}`}
                        />
                    </div>

                    <div className="flex-1">
                        <h2 className="text-lg font-semibold text-slate-800">
                            {vehicle.modelo}
                        </h2>

                        <p className="mt-1 text-sm text-slate-500">
                            Veículo #{vehicle.id}
                        </p>
                    </div>

                    <StatusBadge label={status.label} variant={status.variant} />
                </div>
            </div>

            {/* Informações do veículo */}
            <div className="rounded-xl border border-slate-200 bg-white shadow-sm">
                <div className="border-b border-slate-100 px-6 py-4">
                    <h3 className="font-semibold text-slate-800">
                        Informações do veículo
                    </h3>

                    <p className="mt-1 text-sm text-slate-500">
                        Dados de identificação e características do veículo.
                    </p>
                </div>

                <div className="grid grid-cols-1 gap-6 p-6 sm:grid-cols-2">
                    <div className="flex items-start gap-3">
                        <Factory size={19} className="mt-0.5 text-slate-400" />

                        <div>
                            <p className="text-xs font-medium uppercase text-slate-400">
                                Marca
                            </p>
                            <p className="mt-1 text-sm font-medium text-slate-700">
                                {vehicle.marca}
                            </p>
                        </div>
                    </div>

                    <div className="flex items-start gap-3">
                        <CalendarDays size={19} className="mt-0.5 text-slate-400" />

                        <div>
                            <p className="text-xs font-medium uppercase text-slate-400">
                                Ano
                            </p>
                            <p className="mt-1 text-sm font-medium text-slate-700">
                                {vehicle.ano}
                            </p>
                        </div>
                    </div>

                    <div className="flex items-start gap-3">
                        <RectangleEllipsis size={19} className="mt-0.5 text-slate-400" />

                        <div>
                            <p className="text-xs font-medium uppercase text-slate-400">
                                Placa
                            </p>
                            <p className="mt-1 text-sm font-medium text-slate-700">
                                {vehicle.placa}
                            </p>
                        </div>
                    </div>

                    {/* <div className="flex items-start gap-3">
                        <Truck size={19} className="mt-0.5 text-slate-400" />

                        <div>
                            <p className="text-xs font-medium uppercase text-slate-400">
                                Categoria
                            </p>
                            <p className="mt-1 text-sm font-medium text-slate-700">
                                {vehicle.categoria}
                            </p>
                        </div>
                    </div> */}

                    <div className="flex items-start gap-3">
                        <CircleCheck size={19} className="mt-0.5 text-slate-400" />

                        <div>
                            <p className="text-xs font-medium uppercase text-slate-400">
                                Status
                            </p>
                            <p className="mt-1 text-sm font-medium text-slate-700">
                                {vehicle.status}
                            </p>
                        </div>
                    </div>
                </div>
            </div>

        </div>
    );
};

export default VehiclesDetails;
