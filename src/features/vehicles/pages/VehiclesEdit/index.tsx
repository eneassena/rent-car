import { useEffect, useState, type SubmitEvent } from "react";
import { useNavigate } from "react-router-dom";
import { Car } from "lucide-react";
import { FormEditOrCreate } from "@/shared/components/Forms/FormEditOrCreate";
import { useParams } from "react-router-dom";
import { vehiclesServices } from "@/features/vehicles/services/vehicles.service";
import HeaderPage from "@/features/vehicles/components/HeaderPage";
import { UpdateVehicleDTO } from "@/features/vehicles/types/vehicles";


export const listCores = [
    "preto",
    "branco",
    "prata",
    "azul",
    "vermelho",
    "verde",
    "amarelo",
    "laranja",
    "rosa",
    "roxo",
    "marrom",
    "cinza",
];

const VehiclesEdit = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [vehicle, setVehicle] = useState<UpdateVehicleDTO | null>(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    useEffect(() => {
        fetchVeiculo();
    }, [id]);

    const fetchVeiculo = async () => {
        // Adicione aqui a lógica para buscar os dados do veículo pelo ID
        if (id) {
            const response = await vehiclesServices.getById(Number(id));
            if (!response) {
                setError("Veículo não encontrado.");
                return;
            }
            setVehicle(response);
        }
    };

    const handleSubmit = async (e: SubmitEvent<HTMLFormElement>) => {
        e.preventDefault();
        setLoading(true);
        try {
            if (!id) {
                throw new Error("Veículo não fornecido.");
            }
            const veiculoId = Number(id);
            await vehiclesServices.update(veiculoId, vehicle!);
            navigate("/veiculos", { replace: true });
        } catch (error) {
            console.error(error);
            setError("Ocorreu um erro ao enviar o formulário.");
        } finally {
            setLoading(false);
        }
    };

    const handleBack = () => {
        navigate("/veiculos", { replace: true });
    };

    return (
        <>
            <FormEditOrCreate handleSubmit={handleSubmit} error={error}>
                <HeaderPage
                    handleBack={handleBack}
                    textVoltar="Voltar para veículos"
                    textDetalhes="Detalhes do veículo"
                    textPreencha="Preencha os detalhes do veículo"
                />
                {/* Marca */}
                <div className="flex flex-col gap-1.5">
                    <label
                        htmlFor="marca"
                        className="block text-sm font-medium text-slate-700"
                    >
                        Marca
                    </label>
                    <div className="relative">
                        <Car className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                        <input
                            id="marca"
                            type="text"
                            value={vehicle?.marca ?? ""}
                            onChange={(e) =>
                                vehicle && setVehicle({ ...vehicle, marca: e.target.value })
                            }
                            placeholder="Marca do carro"
                            className="w-full pl-10 pr-3 py-2.5 text-sm text-slate-900 placeholder:text-slate-400 bg-white border border-slate-300 rounded-lg outline-none focus:border-brand-500 focus:ring-2 focus:ring-brand-500/20 transition"
                            required
                            disabled={loading}
                        />
                    </div>
                </div>

                {/* Modelo */}
                <div className="flex flex-col gap-1.5">
                    <label
                        htmlFor="modelo"
                        className="block text-sm font-medium text-slate-700"
                    >
                        Modelo
                    </label>
                    <div className="relative">
                        <Car className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                        <input
                            id="modelo"
                            type="text"
                            value={vehicle?.modelo ?? ""}
                            onChange={(e) =>
                                vehicle && setVehicle({ ...vehicle, modelo: e.target.value })
                            }
                            placeholder="Modelo do carro"
                            className="w-full pl-10 pr-3 py-2.5 text-sm text-slate-900 placeholder:text-slate-400 bg-white border border-slate-300 rounded-lg outline-none focus:border-brand-500 focus:ring-2 focus:ring-brand-500/20 transition"
                            required
                            disabled={loading}
                        />
                    </div>
                </div>

                {/* Valor  Diaria */}
                <div className="flex flex-col gap-1.5">
                    <label
                        htmlFor="diaria"
                        className="block text-sm font-medium text-slate-700"
                    >
                        Diária
                    </label>
                    <div className="relative">
                        <input
                            id="diaria"
                            type="number"
                            value={vehicle?.valor_diaria ?? ""}
                            onChange={(e) =>
                                vehicle &&
                                setVehicle({ ...vehicle, valor_diaria: Number(e.target.value) })
                            }
                            placeholder="Valor da diária"
                            className="w-full pl-3 pr-3 py-2.5 text-sm text-slate-900 placeholder:text-slate-400 bg-white border border-slate-300 rounded-lg outline-none focus:border-brand-500 focus:ring-2 focus:ring-brand-500/20 transition"
                            required
                            disabled={loading}
                        />
                    </div>
                </div>

                {/* Placa */}
                <div className="flex flex-col gap-1.5">
                    <label
                        htmlFor="placa"
                        className="block text-sm font-medium text-slate-700"
                    >
                        Placa
                    </label>
                    <div className="relative">
                        <input
                            id="placa"
                            type="text"
                            value={vehicle?.placa ?? ""}
                            onChange={(e) =>
                                vehicle && setVehicle({ ...vehicle, placa: e.target.value })
                            }
                            placeholder="Placa do carro"
                            className="w-full pl-3 pr-3 py-2.5 text-sm text-slate-900 placeholder:text-slate-400 bg-white border border-slate-300 rounded-lg outline-none focus:border-brand-500 focus:ring-2 focus:ring-brand-500/20 transition"
                            required
                            disabled={loading}
                        />
                    </div>
                </div>

                {/* Cor sera um select */}
                <div className="flex flex-col gap-1.5">
                    <label
                        htmlFor="cor"
                        className="block text-sm font-medium text-slate-700"
                    >
                        Cor
                    </label>
                    <div className="relative">
                        <select
                            id="cor"
                            value={vehicle?.cor ?? ""}
                            onChange={(e) =>
                                vehicle && setVehicle({ ...vehicle, cor: e.target.value })
                            }
                            className="w-full pl-3 pr-3 py-2.5 text-sm text-slate-900 placeholder:text-slate-400 bg-white border border-slate-300 rounded-lg outline-none focus:border-brand-500 focus:ring-2 focus:ring-brand-500/20 transition"
                            required
                            disabled={loading}
                        >
                            {listCores.map((cor) => (
                                <option key={cor} value={cor}>
                                    {cor.charAt(0).toUpperCase() + cor.slice(1)}
                                </option>
                            ))}
                        </select>
                    </div>
                </div>

                {/* Ano */}
                <div className="flex flex-col gap-1.5">
                    <label
                        htmlFor="ano"
                        className="block text-sm font-medium text-slate-700"
                    >
                        Ano
                    </label>
                    <div className="relative">
                        <input
                            id="ano"
                            type="number"
                            value={vehicle?.ano ?? ""}
                            onChange={(e) =>
                                vehicle &&
                                setVehicle({ ...vehicle, ano: Number(e.target.value) })
                            }
                            placeholder="Ano do carro"
                            className="w-full pl-3 pr-3 py-2.5 text-sm text-slate-900 placeholder:text-slate-400 bg-white border border-slate-300 rounded-lg outline-none focus:border-brand-500 focus:ring-2 focus:ring-brand-500/20 transition"
                            required
                            disabled={loading}
                        />
                    </div>
                </div>

                {/* Status */}
                {/* <div className="flex flex-col gap-1.5">
                    <label htmlFor="status" className="block text-sm font-medium text-slate-700">
                        Status
                    </label>
                    <div className="relative">
                        <select
                            id="status"
                            value={status}
                            onChange={(e) => setStatus(e.target.value)}
                            className="w-full pl-3 pr-3 py-2.5 text-sm text-slate-900 placeholder:text-slate-400 bg-white border border-slate-300 rounded-lg outline-none focus:border-brand-500 focus:ring-2 focus:ring-brand-500/20 transition"
                            required
                            disabled={loading}
                        >
                            <option value="">Selecione o status</option>
                            <option value="disponivel">Disponível</option>
                            <option value="indisponivel">Indisponível</option>
                        </select>
                    </div>
                </div> */}

                {/* Botão */}
                <button
                    type="submit"
                    disabled={loading}
                    className="w-full inline-flex items-center justify-center gap-2 py-2.5 px-4 bg-blue-500 text-dark text-sm font-medium rounded-lg hover:bg-brand-700 focus:ring-2 focus:ring-brand-500/40 transition-colors disabled:opacity-60 disabled:cursor-not-allowed cursor-pointer"
                >
                    <span className="capitalize">
                        {loading ? "Salvando..." : "Salvar"}
                    </span>
                </button>
            </FormEditOrCreate>
        </>
    );
};

export default VehiclesEdit;
