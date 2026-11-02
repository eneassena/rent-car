import { useState, type SubmitEvent } from 'react';
import { Car } from 'lucide-react'
import { FormEditOrCreate } from '@/shared/components/Forms/FormEditOrCreate';


interface VeiculoFormState {
    marca: string;
    modelo: string;
    ano: string;
    placa: string;
    categoria: string;
    diaria: string;
    status: string;
}

interface VeiculoType {
    veiculo: VeiculoFormState;
}





export const PageRegistreVeiculo = () => {
    const [veiculo, setVeiculo] = useState<VeiculoType | null>(null);

    const [marca, setMarca] = useState('');
    const [modelo, setModelo] = useState('');
    const [ano, setAno] = useState('');
    const [placa, setPlaca] = useState('');
    const [categoria, setCategoria] = useState('');
    const [diaria, setDiaria] = useState('');
    const [status, setStatus] = useState('');
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e: SubmitEvent<HTMLFormElement>) => {
        e.preventDefault();
        // Adicione aqui a lógica para enviar os dados do formulário
        setLoading(true);
        try {
            setVeiculo({ veiculo: { marca, modelo, ano, placa, categoria, diaria, status } });
            console.log(veiculo);
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div>
            <FormEditOrCreate handleSubmit={handleSubmit}>
                {/* Marca */}
                <div className="flex flex-col gap-1.5">
                    <label htmlFor="marca" className="block text-sm font-medium text-slate-700">
                        Marca
                    </label>
                    <div className="relative">
                        <Car className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                        <input
                            id="marca"
                            type="text"
                            value={marca}
                            onChange={(e) => setMarca(e.target.value)}
                            placeholder="Marca do carro"
                            className="w-full pl-10 pr-3 py-2.5 text-sm text-slate-900 placeholder:text-slate-400 bg-white border border-slate-300 rounded-lg outline-none focus:border-brand-500 focus:ring-2 focus:ring-brand-500/20 transition"
                            required
                            disabled={loading}
                        />
                    </div>
                </div>

                {/* Modelo */}
                <div className="flex flex-col gap-1.5">
                    <label htmlFor="modelo" className="block text-sm font-medium text-slate-700">
                        Modelo
                    </label>
                    <div className="relative">
                        <Car className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                        <input
                            id="modelo"
                            type="text"
                            value={modelo}
                            onChange={(e) => setModelo(e.target.value)}
                            placeholder="Modelo do carro"
                            className="w-full pl-10 pr-3 py-2.5 text-sm text-slate-900 placeholder:text-slate-400 bg-white border border-slate-300 rounded-lg outline-none focus:border-brand-500 focus:ring-2 focus:ring-brand-500/20 transition"
                            required
                            disabled={loading}
                        />
                    </div>
                </div>

                {/* Diaria */}
                <div className="flex flex-col gap-1.5">
                    <label htmlFor="diaria" className="block text-sm font-medium text-slate-700">
                        Diária
                    </label>
                    <div className="relative">
                        <input
                            id="diaria"
                            type="text"
                            value={diaria}
                            onChange={(e) => setDiaria(e.target.value)}
                            placeholder="Valor da diária"
                            className="w-full pl-3 pr-3 py-2.5 text-sm text-slate-900 placeholder:text-slate-400 bg-white border border-slate-300 rounded-lg outline-none focus:border-brand-500 focus:ring-2 focus:ring-brand-500/20 transition"
                            required
                            disabled={loading}
                        />
                    </div>
                </div>

                {/* Placa */}
                <div className="flex flex-col gap-1.5">
                    <label htmlFor="placa" className="block text-sm font-medium text-slate-700">
                        Placa
                    </label>
                    <div className="relative">
                        <input
                            id="placa"
                            type="text"
                            value={placa}
                            onChange={(e) => setPlaca(e.target.value)}
                            placeholder="Placa do carro"
                            className="w-full pl-3 pr-3 py-2.5 text-sm text-slate-900 placeholder:text-slate-400 bg-white border border-slate-300 rounded-lg outline-none focus:border-brand-500 focus:ring-2 focus:ring-brand-500/20 transition"
                            required
                            disabled={loading}
                        />
                    </div>
                </div>

                {/* Categoria sera um select */}
                <div className="flex flex-col gap-1.5">
                    <label htmlFor="categoria" className="block text-sm font-medium text-slate-700">
                        Categoria
                    </label>
                    <div className="relative">
                        <select
                            id="categoria"
                            value={categoria}
                            onChange={(e) => setCategoria(e.target.value)}
                            className="w-full pl-3 pr-3 py-2.5 text-sm text-slate-900 placeholder:text-slate-400 bg-white border border-slate-300 rounded-lg outline-none focus:border-brand-500 focus:ring-2 focus:ring-brand-500/20 transition"
                            required
                            disabled={loading}
                        >
                            <option value="">Selecione a categoria</option>
                            <option value="sedan">Sedan</option>
                            <option value="suv">SUV</option>
                            <option value="hatch">Hatch</option>
                        </select>
                    </div>
                </div>

                {/* Ano */}
                <div className="flex flex-col gap-1.5">
                    <label htmlFor="ano" className="block text-sm font-medium text-slate-700">
                        Ano
                    </label>
                    <div className="relative">
                        <input
                            id="ano"
                            type="number"
                            value={ano}
                            onChange={(e) => setAno(e.target.value)}
                            placeholder="Ano do carro"
                            className="w-full pl-3 pr-3 py-2.5 text-sm text-slate-900 placeholder:text-slate-400 bg-white border border-slate-300 rounded-lg outline-none focus:border-brand-500 focus:ring-2 focus:ring-brand-500/20 transition"
                            required
                            disabled={loading}
                        />
                    </div>
                </div>

                {/* Status */}
                <div className="flex flex-col gap-1.5">
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
                </div>

                {/* Botão */}
                <button
                    type="submit"
                    // disabled={loading}
                    className="w-full inline-flex items-center justify-center gap-2 py-2.5 px-4 bg-blue-500 text-dark text-sm font-medium rounded-lg hover:bg-brand-700 focus:ring-2 focus:ring-brand-500/40 transition-colors disabled:opacity-60 disabled:cursor-not-allowed cursor-pointer"
                >
                    Novo Veiculo
                </button>
            </FormEditOrCreate>
        </div>


    );
};


