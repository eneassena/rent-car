import FormEditOrCreate from "@/shared/components/Forms/FormEditOrCreate";
import { useState, useEffect, type SubmitEvent } from "react";
import { useNavigate, useParams } from "react-router-dom";
import rentalsService from '../../services/rentalsService';
import { HeaderClient } from "@/features/clients/pages/ClientCreate";
import { Car, Mail } from "lucide-react";
import Rental from "../../types/types";







const RentalsEdit = () => {
    const [veiculo, setVeiculo] = useState('');
    const [cliente, setCliente] = useState('');
    const [dataInicio, setDataInicio] = useState('');
    const [dataFim, setDataFim] = useState('');
    const [valor, setValor] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();

    const fetchClient = async () => {
        // Adicione aqui a lógica para buscar os dados do cliente pelo ID
        if (id) {
            const rentalsData = await rentalsService.getRentalById(id);
            console.log(rentalsData);
            setVeiculo(rentalsData?.veiculo ?? '');
            setCliente(rentalsData?.cliente ?? '');
            setDataInicio(rentalsData?.data_inicio ?? '');
            setDataFim(rentalsData?.data_fim ?? '');
            setValor(rentalsData?.valor ?? '');
        }
    };

    useEffect(() => {
        fetchClient();
    }, [id]);

    const handleSubmit = async (e: SubmitEvent<HTMLFormElement>) => {
        e.preventDefault();
        // Adicione aqui a lógica para enviar os dados do formulário
        setLoading(true);
        try {
            let userIdNumber = String(id);
            let parteData: Omit<Rental, "id"> = { veiculo, cliente, data_inicio: dataInicio, data_fim: dataFim, valor };
            await rentalsService.updateRental(userIdNumber, parteData);
            navigate("/locacoes");
        } catch (error) {
            console.error(error);
            setError("Ocorreu um erro ao atualizar o rental.");
        } finally {
            setLoading(false);
            setVeiculo('');
            setCliente('');
            setDataInicio('');
            setDataFim('');
            setValor('');
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
                    <label htmlFor="veiculo" className="block text-sm font-medium text-slate-700">
                        Veiculo
                    </label>
                    <div className="relative">
                        <Car className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                        <input
                            id="veiculo"
                            type="text"
                            value={veiculo}
                            onChange={(e) => setVeiculo(e.target.value)}
                            placeholder="Nome do veiculo"
                            className="w-full pl-10 pr-3 py-2.5 text-sm text-slate-900 placeholder:text-slate-400 bg-white border border-slate-300 rounded-lg outline-none focus:border-brand-500 focus:ring-2 focus:ring-brand-500/20 transition"
                            required
                            disabled={loading}
                        />
                    </div>
                </div>

                {/* Cliente */}
                <div className="flex flex-col gap-1.5">
                    <label htmlFor="cliente" className="block text-sm font-medium text-slate-700">
                        Cliente
                    </label>
                    <div className="relative">
                        <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                        <input
                            id="cliente"
                            type="text"
                            value={cliente}
                            onChange={(e) => setCliente(e.target.value)}
                            placeholder="Nome do cliente"
                            className="w-full pl-10 pr-3 py-2.5 text-sm text-slate-900 placeholder:text-slate-400 bg-white border border-slate-300 rounded-lg outline-none focus:border-brand-500 focus:ring-2 focus:ring-brand-500/20 transition"
                            required
                            disabled={loading}
                        />
                    </div>
                </div>

                {/* Data de inicio  */}
                <div className="flex flex-col gap-1.5">
                    <label htmlFor="dataInicio" className="block text-sm font-medium text-slate-700">
                        Data de inicio
                    </label>
                    <div className="relative">
                        <input
                            id="dataInicio"
                            type="date"
                            value={dataInicio}
                            onChange={(e) => setDataInicio(e.target.value)}
                            placeholder="Data de inicio"
                            className="w-full pl-3 pr-3 py-2.5 text-sm text-slate-900 placeholder:text-slate-400 bg-white border border-slate-300 rounded-lg outline-none focus:border-brand-500 focus:ring-2 focus:ring-brand-500/20 transition"
                            required
                            disabled={loading}
                        />
                    </div>
                </div>

                {/* Data de fim */}
                <div className="flex flex-col gap-1.5">
                    <label htmlFor="dataFim" className="block text-sm font-medium text-slate-700">
                        Data de fim
                    </label>
                    <div className="relative">
                        <input
                            id="dataFim"
                            type="date"
                            value={dataFim}
                            onChange={(e) => setDataFim(e.target.value)}
                            placeholder="Data de fim"
                            className="w-full pl-3 pr-3 py-2.5 text-sm text-slate-900 placeholder:text-slate-400 bg-white border border-slate-300 rounded-lg outline-none focus:border-brand-500 focus:ring-2 focus:ring-brand-500/20 transition"
                            required
                            disabled={loading}
                        />
                    </div>
                </div>


                {/* valor da diaria do carro*/}
                <div className="flex flex-col gap-1.5">
                    <label htmlFor="valor" className="block text-sm font-medium text-slate-700">
                        Diária
                    </label>
                    <div className="relative">
                        <input
                            id="valor"
                            type="text"
                            value={valor}
                            onChange={(e) => setValor(e.target.value)}
                            placeholder="Valor"
                            className="w-full pl-3 pr-3 py-2.5 text-sm text-slate-900 placeholder:text-slate-400 bg-white border border-slate-300 rounded-lg outline-none focus:border-brand-500 focus:ring-2 focus:ring-brand-500/20 transition"
                            required
                            disabled={loading}
                        />
                    </div>
                </div>

                {/* Botão */}
                <button
                    type="submit"
                    disabled={loading}
                    className="w-full inline-flex items-center justify-center gap-2 py-2.5 px-4 bg-blue-500 text-dark text-sm font-medium rounded-lg hover:bg-brand-700 focus:ring-2 focus:ring-brand-500/40 transition-colors disabled:opacity-60 disabled:cursor-not-allowed cursor-pointer"
                >
                    Editar Locação
                </button>
            </FormEditOrCreate>
        </div>
    )
};

export default RentalsEdit;
