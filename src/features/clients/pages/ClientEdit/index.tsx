import { useState, type SubmitEvent, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { FormEditOrCreate } from "@/shared/components/Forms/FormEditOrCreate";
import HeaderClient from "@/features/clients/components/HeaderClient";
import { Client } from "@/features/clients/types/client";
import { clientesService } from '@/features/clients/services/client.service';


const ClientesEdit = () => {
  const [client, setClient] = useState<Client>({} as Client);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();

  const fetchClient = async () => {
    // Adicione aqui a lógica para buscar os dados do cliente pelo ID
    if (id) {
      const clientData = await clientesService.detailById(Number(id));
      console.log(`Fetched client data:`, clientData);
      if (!clientData) {
        setError("Cliente não encontrado.");
        return;
      }
      setClient(clientData);
    }
  };

  useEffect(() => {
    fetchClient();
  }, [id]);

  const handleSubmit = async (e: SubmitEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    try {
      await clientesService.update(Number(id), client!);
      navigate("/clientes", { replace: true });
    } catch (error) {
      console.error(error);
      setError("Ocorreu um erro ao atualizar o cliente.");
    } finally {
      setLoading(false);
    }
  };

  const handleBack = () => {
    navigate("/clientes", { replace: true });
  };

  return (
    <div className="space-y-6">
      <FormEditOrCreate handleSubmit={handleSubmit} error={error}>
        <HeaderClient
          handleBack={handleBack}
          textVoltar="Voltar para clientes"
          textDetalhes="Detalhes do cliente"
          textPreencha="preencha os dados do cliente."
        />

        {/* Marca */}
        <div className="flex flex-col gap-1.5">
          <label htmlFor="name" className="block text-sm font-medium text-slate-700">
            Nome
          </label>
          <div className="relative">
            <input
              id="name"
              type="text"
              value={client?.nome ?? ""}
              onChange={(e) => setClient({ ...client!, nome: e.target.value })}
              placeholder="Nome do cliente"
              className="w-full pl-3 pr-3 py-2.5 text-sm text-slate-900 placeholder:text-slate-400 bg-white border border-slate-300 rounded-lg outline-none focus:border-brand-500 focus:ring-2 focus:ring-brand-500/20 transition"
              required
              disabled={loading}
            />
          </div>
        </div>

        {/* Email */}
        <div className="flex flex-col gap-1.5">
          <label htmlFor="email" className="block text-sm font-medium text-slate-700">
            Email
          </label>
          <div className="relative">
            <input
              id="email"
              type="email"
              value={client?.email ?? ""}
              onChange={(e) => setClient({ ...client!, email: e.target.value })}
              placeholder="Email do cliente"
              className="w-full pl-3 pr-3 py-2.5 text-sm text-slate-900 placeholder:text-slate-400 bg-white border border-slate-300 rounded-lg outline-none focus:border-brand-500 focus:ring-2 focus:ring-brand-500/20 transition"
              required
              disabled={loading}
            />
          </div>
        </div>

        {/* Telefone */}
        <div className="flex flex-col gap-1.5">
          <label htmlFor="telefone" className="block text-sm font-medium text-slate-700">
            Telefone
          </label>
          <div className="relative">
            <input
              id="telefone"
              type="text"
              value={client?.telefone ?? ""}
              onChange={(e) => client && setClient({ ...client, telefone: e.target.value })}
              placeholder="Telefone do cliente"
              className="w-full pl-3 pr-3 py-2.5 text-sm text-slate-900 placeholder:text-slate-400 bg-white border border-slate-300 rounded-lg outline-none focus:border-brand-500 focus:ring-2 focus:ring-brand-500/20 transition"
              required
              disabled={loading}
            />
          </div>
        </div>

        {/* Cpf */}
        <div className="flex flex-col gap-1.5">
          <label htmlFor="cpf" className="block text-sm font-medium text-slate-700">
            Cpf
          </label>
          <div className="relative">
            <input
              id="cpf"
              type="text"
              value={client?.cpf ?? ""}
              onChange={(e) => client && setClient({ ...client, cpf: e.target.value })}
              placeholder="Cpf do cliente"
              className="w-full pl-3 pr-3 py-2.5 text-sm text-slate-900 placeholder:text-slate-400 bg-white border border-slate-300 rounded-lg outline-none focus:border-brand-500 focus:ring-2 focus:ring-brand-500/20 transition"
              required
              disabled={loading}
            />
          </div>
        </div>

        {/* Endereço */}
        <div className="flex flex-col gap-1.5">
          <label htmlFor="endereco" className="block text-sm font-medium text-slate-700">
            Endereço
          </label>
          <div className="relative">
            <input
              id="endereco"
              type="text"
              value={client?.endereco ?? ""}
              onChange={(e) => client && setClient({ ...client, endereco: e.target.value })}
              placeholder="Endereço do cliente"
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
          Editar Cliente
        </button>
      </FormEditOrCreate>
    </div>
  );
}

export default ClientesEdit;
