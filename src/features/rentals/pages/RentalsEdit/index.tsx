import FormEditOrCreate from "@/shared/components/Forms/FormEditOrCreate";
import { useState, useEffect, type SubmitEvent } from "react";
import { useNavigate, useParams } from "react-router-dom";
import HeaderClient from "@/features/clients/components/HeaderClient";
import { Car, Mail } from "lucide-react";
import { RentalModalidade, UpdateRentalDTO } from "@/features/rentals/types/types";
import rentalsServices from '@/features/rentals/services/rentals.service';



const RentalsEdit = () => {
    const [locacoes, setLocacoes] = useState<UpdateRentalDTO>({} as UpdateRentalDTO);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    // const listStatus: RentalStatus[] = ["ATIVA", "FINALIZADA", "CANCELADA"];
    const listModalidade: RentalModalidade[] = ["DIARIA", "PERIODO"];

    const fetchClient = async () => {
        // Adicione aqui a lógica para buscar os dados do cliente pelo ID
        if (id) {
            const rentalsData = await rentalsServices.byId(Number(id));
            console.log(rentalsData);
            if (!rentalsData) {
                setError("Locação não encontrada.");
                return;
            }
            setLocacoes(rentalsData);
        }
    };

    useEffect(() => {
        fetchClient();
    }, [id]);

    const handleSubmit = async (e: SubmitEvent<HTMLFormElement>) => {
        e.preventDefault();
        // Adicione aqui a lógica para enviar os dados do formulário
        try {
            setLoading(true);
            await rentalsServices.update(Number(id), locacoes);
            navigate("/locacoes", { replace: true });
        } catch (error) {
            console.error(error);
            setError("Ocorreu um erro ao atualizar o rental.");
        } finally {
            setLoading(false);
            setLocacoes({} as UpdateRentalDTO);
        }
    };

    return (
        <div className="space-y-6">
            <FormEditOrCreate handleSubmit={handleSubmit} error={error}>
                <HeaderClient
                    handleBack={() => navigate("/locacoes")}
                    textVoltar="Voltar para locações"
                    textDetalhes="Detalhes da locação"
                    textPreencha="preencha os dados da locação."
                />

                {/* Veiculo */}
                <div className="flex flex-col gap-1.5">
                    <label htmlFor="veiculoId" className="block text-sm font-medium text-slate-700">
                        ID do Veiculo
                    </label>
                    <div className="relative">
                        <Car className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                        <input
                            id="veiculoId"
                            type="number"
                            value={locacoes.veiculo_id}
                            onChange={(e) => setLocacoes({ ...locacoes, veiculo_id: Number(e.target.value) })}
                            placeholder="ID do veiculo"
                            className="w-full pl-10 pr-3 py-2.5 text-sm text-slate-900 placeholder:text-slate-400 bg-white border border-slate-300 rounded-lg outline-none focus:border-brand-500 focus:ring-2 focus:ring-brand-500/20 transition"
                            required
                            disabled={loading}
                        />
                    </div>
                </div>

                {/* Cliente */}
                <div className="flex flex-col gap-1.5">
                    <label htmlFor="clienteId" className="block text-sm font-medium text-slate-700">
                        ID do Cliente
                    </label>
                    <div className="relative">
                        <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                        <input
                            id="clienteId"
                            type="number"
                            value={locacoes.cliente_id}
                            onChange={(e) => setLocacoes({ ...locacoes, cliente_id: Number(e.target.value) })}
                            placeholder="ID do cliente"
                            className="w-full pl-10 pr-3 py-2.5 text-sm text-slate-900 placeholder:text-slate-400 bg-white border border-slate-300 rounded-lg outline-none focus:border-brand-500 focus:ring-2 focus:ring-brand-500/20 transition"
                            required
                            disabled={loading}
                        />
                    </div>
                </div>

                {/* Data de Retirada  */}
                <div className="flex flex-col gap-1.5">
                    <label htmlFor="dataInicio" className="block text-sm font-medium text-slate-700">
                        Data de Retirada
                    </label>
                    <div className="relative">
                        <input
                            id="dataInicio"
                            type="date"
                            value={locacoes.data_retirada}
                            onChange={(e) => setLocacoes({ ...locacoes, data_retirada: e.target.value })}
                            placeholder="Data de Retirada"
                            className="w-full pl-3 pr-3 py-2.5 text-sm text-slate-900 placeholder:text-slate-400 bg-white border border-slate-300 rounded-lg outline-none focus:border-brand-500 focus:ring-2 focus:ring-brand-500/20 transition"
                            required
                            disabled={loading}
                        />
                    </div>
                </div>

                {/* Data de Devolução */}
                <div className="flex flex-col gap-1.5">
                    <label htmlFor="dataFim" className="block text-sm font-medium text-slate-700">
                        Data de Devolução
                    </label>
                    <div className="relative">
                        <input
                            id="dataFim"
                            type="date"
                            value={locacoes.data_devolucao}
                            onChange={(e) => setLocacoes({ ...locacoes, data_devolucao: e.target.value })}
                            placeholder="Data de Devolução"
                            className="w-full pl-3 pr-3 py-2.5 text-sm text-slate-900 placeholder:text-slate-400 bg-white border border-slate-300 rounded-lg outline-none focus:border-brand-500 focus:ring-2 focus:ring-brand-500/20 transition"
                            required
                            disabled={loading}
                        />
                    </div>
                </div>


                {/* valor da diaria do carro*/}
                <div className="flex flex-col gap-1.5">
                    <label htmlFor="valor" className="block text-sm font-medium text-slate-700">
                        Valor da Diária
                    </label>
                    <div className="relative">
                        <input
                            id="valor"
                            type="number"
                            value={locacoes.valor_diaria}
                            onChange={(e) => setLocacoes({ ...locacoes, valor_diaria: Number(e.target.value) })}
                            placeholder="Valor"
                            className="w-full pl-3 pr-3 py-2.5 text-sm text-slate-900 placeholder:text-slate-400 bg-white border border-slate-300 rounded-lg outline-none focus:border-brand-500 focus:ring-2 focus:ring-brand-500/20 transition"
                            required
                            disabled={loading}
                        />
                    </div>
                </div>

                {/* Valor Fechado*/}
                <div className="flex flex-col gap-1.5">
                    <label htmlFor="valor_fechado" className="block text-sm font-medium text-slate-700">
                        Valor Fechado
                    </label>
                    <div className="relative">
                        <input
                            id="valor_fechado"
                            type="number"
                            value={locacoes.valor_fechado}
                            onChange={(e) => setLocacoes({ ...locacoes, valor_fechado: Number(e.target.value) })}
                            placeholder="Valor"
                            className="w-full pl-3 pr-3 py-2.5 text-sm text-slate-900 placeholder:text-slate-400 bg-white border border-slate-300 rounded-lg outline-none focus:border-brand-500 focus:ring-2 focus:ring-brand-500/20 transition"
                            required
                            disabled={loading}
                        />
                    </div>
                </div>

                {/* Valor Total*/}
                <div className="flex flex-col gap-1.5">
                    <label htmlFor="valor_total" className="block text-sm font-medium text-slate-700">
                        Valor Total
                    </label>
                    <div className="relative">
                        <input
                            id="valor_total"
                            type="number"
                            value={locacoes.valor_total}
                            onChange={(e) => setLocacoes({ ...locacoes, valor_total: Number(e.target.value) })}
                            placeholder="Valor Total"
                            className="w-full pl-3 pr-3 py-2.5 text-sm text-slate-900 placeholder:text-slate-400 bg-white border border-slate-300 rounded-lg outline-none focus:border-brand-500 focus:ring-2 focus:ring-brand-500/20 transition"
                            required
                            disabled={loading}
                        />
                    </div>
                </div>

                {/* modalidade */}
                <div className="flex flex-col gap-1.5">
                    <label htmlFor="modalidade" className="block text-sm font-medium text-slate-700">
                        Modalidade
                    </label>
                    <div className="relative">
                        <select
                            id="modalidade"
                            value={locacoes.modalidade}
                            onChange={(e) => setLocacoes({ ...locacoes, modalidade: e.target.value })}
                            className="w-full pl-3 pr-3 py-2.5 text-sm text-slate-900 placeholder:text-slate-400 bg-white border border-slate-300 rounded-lg outline-none focus:border-brand-500 focus:ring-2 focus:ring-brand-500/20 transition"
                            required
                            disabled={loading}
                        >
                            {listModalidade.map((modalidade) => (
                                <option key={modalidade} value={modalidade}>
                                    {modalidade.charAt(0).toUpperCase() + modalidade.slice(1)}
                                </option>
                            ))}
                        </select>
                    </div>
                </div>

                {/* Botão */}
                <button
                    type="submit"
                    disabled={loading}
                    className="w-full inline-flex items-center justify-center gap-2 py-2.5 px-4 bg-blue-500 text-dark text-sm font-medium rounded-lg hover:bg-brand-700 focus:ring-2 focus:ring-brand-500/40 transition-colors disabled:opacity-60 disabled:cursor-not-allowed cursor-pointer"
                >
                    {loading ? 'Carregando...' : 'Editar Locação'}
                </button>
            </FormEditOrCreate>
        </div>
    )
};

export default RentalsEdit;
