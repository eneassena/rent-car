import { ArrowLeft } from "lucide-react";
import { HTMLAttributes, useState, type SubmitEvent } from "react";
import { ToastContainer, ToastContentProps, toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import { CreateRentalDTO } from "@/features/rentals/types/types";
import rentalsService from '@/features/rentals/services/rentals.service';
import FormEditOrCreate from "@/shared/components/Forms/FormEditOrCreate";
import { RentalModalidade } from "@/features/rentals/types/types";

// const notify = (msg: string) => toast(msg);
const notify = (msg: string) => {
    // toast(WithCustomProgressBar, {
    //     autoClose: 8000,
    //     customProgressBar: true,
    //     closeButton: false,
    //     data: {
    //         message: msg,
    //     },
    // });

    const id = toast(WithCustomProgressBar, {
        progress: 0,
        customProgressBar: true,
        closeButton: false,
        data: {
            message: msg,
        },
    });

    // update the controlled progress bar
    setTimeout(() => {
        toast.update(id, {
            progress: 0.5,
        });

        // one more time to close the toast
        setTimeout(() => {
            toast.done(id);
        }, 5000);
    }, 1000);
};

const WithCustomProgressBar = ({
    closeToast,
    isPaused,
    toastProps,
    data,
}: ToastContentProps<{ message: string }>) => {
    const strokeDash = 565.48;
    const attributes: HTMLAttributes<SVGCircleElement> = {};

    // handle controlled progress bar
    // controlled progress bar uses a transition
    if (typeof toastProps.progress === 'number') {
        attributes.style = {
            transition: 'all .1s linear',
            strokeDashoffset: `${strokeDash - strokeDash * toastProps.progress}px`,
        };

        if (toastProps.progress >= 1) {
            attributes.onTransitionEnd = () => {
                closeToast();
            };
        }
    } else {
        // normal autoclose uses an animation
        // animation inside index.css
        attributes.className = 'animate';
        attributes.style = {
            animationDuration: `${toastProps.autoClose}ms`,
            animationPlayState: isPaused ? 'paused' : 'running',
        };

        attributes.onAnimationEnd = () => {
            closeToast();
        };
    }

    return (
        <div className="flex justify-between items-center w-full">
            <p>{data.message}</p>
            <svg
                width="40"
                height="40"
                viewBox="-25 -25 250 250"
                version="1.1"
                xmlns="http://www.w3.org/2000/svg"
                className="-rotate-90"
            >
                <circle
                    r="90"
                    cx="100"
                    cy="100"
                    fill="transparent"
                    stroke="#e0e0e0"
                    stroke-width="6"
                    stroke-dasharray={`${strokeDash}px`}
                    stroke-dashoffset="0"
                />
                <circle
                    r="90"
                    cx="100"
                    cy="100"
                    stroke="#76e5b1"
                    stroke-width="16px"
                    stroke-linecap="round"
                    fill="transparent"
                    stroke-dasharray={`${strokeDash}px`}
                    {...attributes}
                />
            </svg>
        </div>
    );
}

const RentalsCreate = () => {
    const navigate = useNavigate();
    const [veiculoId, setVeiculoId] = useState(0);
    const [clienteId, setClienteId] = useState(0);
    const [dataRetirada, setDataRetirada] = useState("");
    const [dataDevolucao, setDataDevolucao] = useState("");
    const [valorDiaria, setValorDiaria] = useState<number | null>(null);
    const [valorFechado, setValorFechado] = useState<number | null>(null);
    const [observacoes, setObservacoes] = useState("");
    const listModalidade: RentalModalidade[] = ["DIARIA", "PERIODO"];
    const [modalidade, setModalidade] = useState<string>("DIARIA");

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const handleSubmit = async (e: SubmitEvent<HTMLFormElement>) => {
        e.preventDefault();
        setLoading(true);
        try {
            const rentalData: CreateRentalDTO = {
                veiculo_id: veiculoId,
                cliente_id: clienteId,
                data_retirada: dataRetirada,
                data_devolucao: dataDevolucao,
                valor_diaria: valorDiaria,
                valor_fechado: valorFechado,
                observacoes: observacoes,
                modalidade: modalidade,
                imagem: null
            };
            await rentalsService.create(rentalData);
            navigate("/locacoes", { replace: true });
        } catch (error) {
            console.error(error);
            setError("Ocorreu um erro ao criar a locação.");
            notify(error instanceof Error ? error.message : "Ocorreu um erro ao criar a locação.");
        } finally {
            setLoading(false);
        }
    };

    const handleBack = () => {
        navigate("/locacoes");
    };

    return (
        <div className="space-y-6">
            <FormEditOrCreate handleSubmit={handleSubmit} error={error}>
                <ToastContainer />
                <HeaderClient
                    handleBack={handleBack}
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
                        <input
                            id="veiculoId"
                            type="number"
                            value={veiculoId}
                            onChange={(e) => setVeiculoId(Number(e.target.value))}
                            placeholder="Veiculo"
                            className="w-full pl-3 pr-3 py-2.5 text-sm text-slate-900 placeholder:text-slate-400 bg-white border border-slate-300 rounded-lg outline-none focus:border-brand-500 focus:ring-2 focus:ring-brand-500/20 transition"
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
                        <input
                            id="clienteId"
                            type="number"
                            value={clienteId}
                            onChange={(e) => setClienteId(Number(e.target.value))}
                            placeholder="Cliente"
                            className="w-full pl-3 pr-3 py-2.5 text-sm text-slate-900 placeholder:text-slate-400 bg-white border border-slate-300 rounded-lg outline-none focus:border-brand-500 focus:ring-2 focus:ring-brand-500/20 transition"
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
                            value={dataRetirada}
                            onChange={(e) => setDataRetirada(e.target.value)}
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
                            value={dataDevolucao}
                            onChange={(e) => setDataDevolucao(e.target.value)}
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
                            value={valorDiaria ?? ""}
                            onChange={(e) => setValorDiaria(e.target.value === "" ? null : Number(e.target.value))}
                            placeholder="Usar diária do veículo"
                            className="w-full pl-3 pr-3 py-2.5 text-sm text-slate-900 placeholder:text-slate-400 bg-white border border-slate-300 rounded-lg outline-none focus:border-brand-500 focus:ring-2 focus:ring-brand-500/20 transition"
                            min="0"
                            step="0.01"
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
                            value={valorFechado ?? ""}
                            onChange={(e) => setValorFechado(e.target.value === "" ? null : Number(e.target.value))}
                            placeholder="Valor"
                            className="w-full pl-3 pr-3 py-2.5 text-sm text-slate-900 placeholder:text-slate-400 bg-white border border-slate-300 rounded-lg outline-none focus:border-brand-500 focus:ring-2 focus:ring-brand-500/20 transition"
                            required={modalidade === "PERIODO"}
                            min="0"
                            step="0.01"
                            disabled={loading}
                        />
                    </div>
                </div>

                <p className="text-sm text-slate-500">O valor total será calculado pela API.</p>

                {/* modalidade */}
                <div className="flex flex-col gap-1.5">
                    <label htmlFor="modalidade" className="block text-sm font-medium text-slate-700">
                        Modalidade
                    </label>
                    <div className="relative">
                        <select
                            id="modalidade"
                            value={modalidade}
                            onChange={(e) => setModalidade(e.target.value)}
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

                {/* Observacao */}
                <div className="flex flex-col gap-1.5">
                    <label htmlFor="observacao" className="block text-sm font-medium text-slate-700">
                        Observação
                    </label>
                    <div className="relative">
                        <textarea
                            id="observacao"
                            value={observacoes}
                            onChange={(e) => setObservacoes(e.target.value)}
                            placeholder="Observação (opcional)"
                            className="w-full pl-3 pr-3 py-2.5 text-sm text-slate-900 placeholder:text-slate-400 bg-white border border-slate-300 rounded-lg outline-none focus:border-brand-500 focus:ring-2 focus:ring-brand-500/20 transition"
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
                    {loading ? 'Carregando...' : 'Criar Locação'}
                </button>
            </FormEditOrCreate>
        </div>
    );
}

export type HeaderClientType = {
    handleBack?: () => void;
    textVoltar: string;
    textDetalhes: string;
    textPreencha?: string;
};

export const HeaderClient = ({ handleBack, textVoltar, textDetalhes, textPreencha }: HeaderClientType) => {
    return (
        <div>
            {handleBack && (
                <button
                    type="button"
                    onClick={handleBack}
                    className="mb-3 flex items-center gap-2 text-sm text-slate-500 transition hover:text-slate-800"
                >
                    <ArrowLeft size={17} />
                    {textVoltar}
                </button>
            )}

            {!handleBack && textVoltar && (
                <p className="mb-3 text-sm text-slate-500">
                    {textVoltar}
                </p>
            )}

            <h1 className="text-2xl font-semibold text-slate-800">
                {textDetalhes}
            </h1>

            {textPreencha && (
                <p className="mt-1 text-sm text-slate-500">
                    {textPreencha}
                </p>
            )}

        </div>
    );
};

export default RentalsCreate;
