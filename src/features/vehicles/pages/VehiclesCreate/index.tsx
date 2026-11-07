import { useState, type SubmitEvent } from 'react';
import { Car } from 'lucide-react'
import { FormEditOrCreate } from '@/shared/components/Forms/FormEditOrCreate';
import { CreateVehicleDTO } from '../../types/vehicles';
import { useData } from '@/contexts/dataContext';

import ImageUpload from "@/features/vehicles/components/ImageUpload";





const VehiclesCreate = () => {
    const [marca, setMarca] = useState<string>('');
    const [modelo, setModelo] = useState<string>('');
    const [ano, setAno] = useState<number>(0);
    const [placa, setPlaca] = useState<string>('');
    const [cor, setCor] = useState<string>('');
    const [valorDiaria, setValorDiaria] = useState<number>(0);
    const [imagemPath, setImagemPath] = useState<File | null>(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const context = useData();
    const data = 'data' in context ? context.data : undefined;

    const handleSubmit = async (e: SubmitEvent<HTMLFormElement>) => {
        e.preventDefault();
        // Adicione aqui a lógica para enviar os dados do formulário
        setLoading(true);
        try {
            const newVehicle: CreateVehicleDTO = {
                marca,
                modelo,
                placa,
                ano: Number(ano),
                cor,
                valor_diaria: valorDiaria,
                // imagem_path: new File([imagemPath], "imagem.jpg")
            };
            if (imagemPath) {
                newVehicle.imagem_path = imagemPath;
            }

            if (data) {
                // Supondo que você tenha uma função para criar veículo no contexto
                await data.createVehicle(newVehicle);
            }
            console.log('Veículo criado com sucesso');
            // setError('');
            // setMarca('');
            // setModelo('');
            // setAno(0);
            // setPlaca('');
            // setCor('');
            // setValorDiaria(0);
            // setImagemPath(null);

        } catch (error) {
            console.error(error);
            setError('Ocorreu um erro ao enviar o formulário.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div>
            <FormEditOrCreate handleSubmit={handleSubmit} error={error}>
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
                            type="number"
                            value={valorDiaria}
                            onChange={(e) => setValorDiaria((Number(e.target.value)))}
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

                {/* cor */}
                <div className="flex flex-col gap-1.5">
                    <label htmlFor="cor" className="block text-sm font-medium text-slate-700">
                        Cor
                    </label>
                    <div className="relative">
                        <select
                            id="cor"
                            value={cor}
                            onChange={(e) => setCor(e.target.value)}
                            className="w-full pl-3 pr-3 py-2.5 text-sm text-slate-900 placeholder:text-slate-400 bg-white border border-slate-300 rounded-lg outline-none focus:border-brand-500 focus:ring-2 focus:ring-brand-500/20 transition"
                            required
                            disabled={loading}
                        >
                            <option value="">Selecione a cor</option>
                            <option value="preto">Preto</option>
                            <option value="branco">Branco</option>
                            <option value="prata">Prata</option>
                            <option value="azul">Azul</option>
                            <option value="vermelho">Vermelho</option>
                            <option value="verde">Verde</option>
                            <option value="amarelo">Amarelo</option>
                            <option value="laranja">Laranja</option>
                            <option value="rosa">Rosa</option>
                            <option value="roxo">Roxo</option>
                            <option value="marrom">Marrom</option>
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
                            onChange={(e) => setAno(Number(e.target.value))}
                            placeholder="Ano do carro"
                            className="w-full pl-3 pr-3 py-2.5 text-sm text-slate-900 placeholder:text-slate-400 bg-white border border-slate-300 rounded-lg outline-none focus:border-brand-500 focus:ring-2 focus:ring-brand-500/20 transition"
                            required
                            disabled={loading}
                        />
                    </div>
                </div>

                <ImageUpload
                value={imagemPath}
                    onChange={(file) => {
                        setImagemPath(file);
                    }}
                />

                {/* Botão */}
                <button
                    type="submit"
                    // disabled={loading}
                    className="w-full inline-flex items-center justify-center gap-2 py-2.5 px-4 bg-blue-500 text-dark text-sm font-medium rounded-lg hover:bg-brand-700 focus:ring-2 focus:ring-brand-500/40 transition-colors disabled:opacity-60 disabled:cursor-not-allowed cursor-pointer"
                >
                    {loading ? 'Salvando...' : 'Novo Veiculo'}
                </button>
            </FormEditOrCreate>
        </div>


    );
};


export default VehiclesCreate;
