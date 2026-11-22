import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
    CalendarDays,
    CarFront,
    Factory,
    Truck
} from "lucide-react";
import Rental from "@/features/rentals/types/types";
import rentalsService from "@/features/rentals/services/rentals.service";
import HeaderPage from "@/features/vehicles/components/HeaderPage";


const RentalsDetails = () => {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();

    const [rental, setRental] = useState<Rental | null>(null);
    const [loading, setLoading] = useState(true);
    const [changingStatus, setChangingStatus] = useState(false);
    const [statusError, setStatusError] = useState<string | null>(null);

    useEffect(() => {
        let active = true;

        async function loadRental() {
            try {
                if (!id) {
                    setRental(null);
                    return;
                }
                setLoading(true);
                const rentalData = await rentalsService.byId(Number(id));
                if (active) {
                    setRental(rentalData ?? null);
                }
            } catch (error) {
                console.error("Erro ao buscar locação:", error);

                if (active) {
                    setRental(null);
                }
            } finally {
                if (active) {
                    setLoading(false);
                }
            }
        }
        loadRental();

        return () => {
            active = false;
        };
    }, [id]);

    const handleEdit = () => {
        if (rental) {
            navigate(`/locacoes/${rental.id}/editar`);
        }
    };

    const handleBack = () => {
        navigate("/locacoes");
    };

    const changeStatus = async (action: 'finalizar' | 'cancelar') => {
        if (!rental || !window.confirm(`Deseja ${action} esta locação?`)) return;
        setChangingStatus(true);
        setStatusError(null);
        try {
            setRental(await rentalsService.changeStatus(rental.id, action));
        } catch (error) {
            console.error("Erro ao alterar locação:", error);
            setStatusError("Não foi possível alterar o status da locação.");
        } finally {
            setChangingStatus(false);
        }
    };

    if (loading) {
        return (
            <div className="flex min-h-64 items-center justify-center">
                <p className="text-sm text-slate-500">Carregando dados da locação...</p>
            </div>
        );
    }

    if (!rental) {
        return (
            <div className="flex flex-col items-center justify-center rounded-xl border border-slate-200 bg-white px-6 py-16 shadow-sm">
                <CarFront size={40} className="mb-3 text-slate-300" />

                <h2 className="text-lg font-semibold text-slate-800">
                    Locação não encontrada
                </h2>

                <p className="mt-1 text-sm text-slate-500">
                    Não foi possível localizar os dados desta locação.
                </p>

                <button
                    type="button"
                    onClick={handleBack}
                    className="mt-5 rounded-lg bg-slate-900 px-4 py-2 text-sm font-medium text-white transition hover:bg-slate-700"
                >
                    Voltar para locações
                </button>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            {/* Cabeçalho */}
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <HeaderPage
                    handleBack={handleBack}
                    textVoltar="Voltar para locações"
                    textDetalhes="Detalhes da locação"
                    textPreencha="Preencha os detalhes da locação"
                    handleEdit={rental.status === "ATIVA" ? handleEdit : undefined}
                    textEditar="Editar locação"
                />
            </div>
            {rental.status === "ATIVA" && (
                <div className="flex gap-3">
                    <button type="button" disabled={changingStatus} onClick={() => changeStatus("finalizar")} className="rounded-lg bg-blue-600 px-4 py-2 text-white disabled:opacity-60">Finalizar locação</button>
                    <button type="button" disabled={changingStatus} onClick={() => changeStatus("cancelar")} className="rounded-lg bg-red-600 px-4 py-2 text-white disabled:opacity-60">Cancelar locação</button>
                </div>
            )}
            {statusError && <p className="text-red-500">{statusError}</p>}

            {/* Identificação */}
            <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
                <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
                    <div className="flex-1">
                        <h2 className="text-lg font-semibold text-slate-800">
                            {rental.veiculo_id}
                        </h2>

                        <p className="mt-1 text-sm text-slate-500">
                            Veículo #{rental.veiculo_id}
                        </p>
                    </div>

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
                                Cliente
                            </p>
                            <p className="mt-1 text-sm font-medium text-slate-700">
                                {rental.cliente_id}
                            </p>
                        </div>
                    </div>

                    <div className="flex items-start gap-3">
                        <Truck size={19} className="mt-0.5 text-slate-400" />

                        <div>
                            <p className="text-xs font-medium uppercase text-slate-400">
                                Modalidade
                            </p>
                            <p className="mt-1 text-sm font-medium text-slate-700">
                                {rental.modalidade}
                            </p>
                        </div>
                    </div>

                    <div className="flex items-start gap-3">
                        <CalendarDays size={19} className="mt-0.5 text-slate-400" />

                        <div>
                            <p className="text-xs font-medium uppercase text-slate-400">
                                Data de Retirada
                            </p>
                            <p className="mt-1 text-sm font-medium text-slate-700">
                                {rental.data_retirada}
                            </p>
                        </div>
                    </div>

                    <div className="flex items-start gap-3">
                        <CalendarDays size={19} className="mt-0.5 text-slate-400" />

                        <div>
                            <p className="text-xs font-medium uppercase text-slate-400">
                                Data de Devolução
                            </p>
                            <p className="mt-1 text-sm font-medium text-slate-700">
                                {rental.data_devolucao}
                            </p>
                        </div>
                    </div>

                    <div className="flex items-start gap-3">
                        <Truck size={19} className="mt-0.5 text-slate-400" />

                        <div>
                            <p className="text-xs font-medium uppercase text-slate-400">
                                Valor Diária
                            </p>
                            <p className="mt-1 text-sm font-medium text-slate-700">
                                {rental.valor_diaria}
                            </p>
                        </div>
                    </div>

                    <div className="flex items-start gap-3">
                        <Truck size={19} className="mt-0.5 text-slate-400" />

                        <div>
                            <p className="text-xs font-medium uppercase text-slate-400">
                                Valor Fechado
                            </p>
                            <p className="mt-1 text-sm font-medium text-slate-700">
                                {rental.valor_fechado}
                            </p>
                        </div>
                    </div>

                    <div className="flex items-start gap-3">
                        <Truck size={19} className="mt-0.5 text-slate-400" />

                        <div>
                            <p className="text-xs font-medium uppercase text-slate-400">
                                Valor Total
                            </p>
                            <p className="mt-1 text-sm font-medium text-slate-700">
                                {rental.valor_total}
                            </p>
                        </div>
                    </div>

                    <div className="flex items-start gap-3">
                        <Truck size={19} className="mt-0.5 text-slate-400" />

                        <div>
                            <p className="text-xs font-medium uppercase text-slate-400">
                                Status
                            </p>
                            <p className="mt-1 text-sm font-medium text-slate-700">
                                {rental.status}
                            </p>
                        </div>
                    </div>
                    <div className="flex items-start gap-3">
                        <Truck size={19} className="mt-0.5 text-slate-400" />

                        <div>
                            <p className="text-xs font-medium uppercase text-slate-400">
                                Observações
                            </p>
                            <p className="mt-1 text-sm font-medium text-slate-700">
                                {rental.observacoes}
                            </p>
                        </div>
                    </div>

                </div>
            </div>

        </div>
    );
};

export default RentalsDetails;