import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Vehicle } from "../../types/vehicles";
import { vehiclesServices } from "../../services/vehicles.service";
import {
    CarFront,
    Factory,
    CalendarDays,
    RectangleEllipsis,
    Truck,
    CircleCheck,
    ArrowLeft,
    Pencil,
} from "lucide-react";
import StatusBadge from "@/shared/components/StatusBadge";
import HeaderPage from "../../components/HeaderPage";

const VehiclesDetails = () => {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();

    const [vehicle, setVehicle] = useState<Vehicle | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        let active = true;

        async function loadVehicle() {
            try {
                if (!id) {
                    setVehicle(null);
                    return;
                }

                const vehicleData = await vehiclesServices.getById(id);

                if (active) {
                    setVehicle(vehicleData ?? null);
                }
            } catch (error) {
                console.error("Erro ao buscar veículo:", error);

                if (active) {
                    setVehicle(null);
                }
            } finally {
                if (active) {
                    setLoading(false);
                }
            }
        }

        setLoading(true);
        loadVehicle();

        return () => {
            active = false;
        };
    }, [id]);

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

    // Available
    // Unavailable
    const status =
        vehicle.status === "ACTIVE"
            ? { label: "Ativo", variant: "success" as const }
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
                    <div className="flex h-14 w-14 items-center justify-center rounded-full bg-blue-50 text-blue-600">
                        {/* <CarFront size={28} /> */}
                        <div className="w-full bg-gray-100 rounded-xl overflow-hidden">

                            <img
                                src={vehicle.image}
                                alt={vehicle.modelo}
                                onError={(event) => {
                                    event.currentTarget.src = "/images/placeholder.png";
                                }}
                                className="h-full w-full object-contain"
                            />
                        </div>
                        {/* <img
                            src={vehicle.image}
                            alt={vehicle.modelo}
                            className="h-150 w-100 rounded-full object-cover"
                        /> */}
                        {/* <div>
                            <img
                                src={vehicle.image}
                                alt={vehicle.modelo}
                                className="w-full h-full object-cover"
                            />
                        </div> */}
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

                    <div className="flex items-start gap-3">
                        <Truck size={19} className="mt-0.5 text-slate-400" />

                        <div>
                            <p className="text-xs font-medium uppercase text-slate-400">
                                Categoria
                            </p>
                            <p className="mt-1 text-sm font-medium text-slate-700">
                                {vehicle.categoria}
                            </p>
                        </div>
                    </div>

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
