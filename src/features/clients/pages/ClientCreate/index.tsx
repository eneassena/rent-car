
import { useState, type SubmitEvent } from "react";
import { Car, Mail } from "lucide-react";

// import { clientService } from "../../services/clientService";
// import type { Client } from "../../types/client";
import { FormEditOrCreate } from "@/shared/components/Forms/FormEditOrCreate";



interface ClientesFormType {
  name: string;
  email: string;
  phone: string;
  cpf: string;
  status: string;
}

const clientService = {
  create: async (client: ClientesFormType) => {
    // Adicione aqui a lógica para criar um cliente, por exemplo, uma chamada à API
    console.log("Criando cliente:", client);
  }
}


const ClientCreate = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [cpf, setCpf] = useState('');
  const [status, setStatus] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: SubmitEvent<HTMLFormElement>) => {
    e.preventDefault();
    // Adicione aqui a lógica para enviar os dados do formulário
    setLoading(true);
    try {
      await clientService.create({ name, email, phone, cpf, status });
      // await create({ name, email, phone, cpf, status });
    } catch (error) {
      console.error(error);
      setError("Ocorreu um erro ao criar o cliente.");
    } finally {
      setLoading(false);
      setName('');
      setEmail('');
      setPhone('');
      setCpf('');
      setStatus('');
    }
  };

  return (
    <div className="space-y-6">
      <FormEditOrCreate handleSubmit={handleSubmit} error={error}>


        {/* Marca */}
        <div className="flex flex-col gap-1.5">
          <label htmlFor="name" className="block text-sm font-medium text-slate-700">
            Nome
          </label>
          <div className="relative">
            <Car className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
            <input
              id="name"
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Nome do cliente"
              className="w-full pl-10 pr-3 py-2.5 text-sm text-slate-900 placeholder:text-slate-400 bg-white border border-slate-300 rounded-lg outline-none focus:border-brand-500 focus:ring-2 focus:ring-brand-500/20 transition"
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
            <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Email do cliente"
              className="w-full pl-10 pr-3 py-2.5 text-sm text-slate-900 placeholder:text-slate-400 bg-white border border-slate-300 rounded-lg outline-none focus:border-brand-500 focus:ring-2 focus:ring-brand-500/20 transition"
              required
              disabled={loading}
            />
          </div>
        </div>

        {/* Telefone */}
        <div className="flex flex-col gap-1.5">
          <label htmlFor="phone" className="block text-sm font-medium text-slate-700">
            Telefone
          </label>
          <div className="relative">
            <input
              id="phone"
              type="text"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
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
              value={cpf}
              onChange={(e) => setCpf(e.target.value)}
              placeholder="Cpf do cliente"
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
              <option value="ACTIVE">Disponível</option>
              <option value="INACTIVE">Indisponível</option>
            </select>
          </div>
        </div>

        {/* Botão */}
        <button
          type="submit"
          disabled={loading}
          className="w-full inline-flex items-center justify-center gap-2 py-2.5 px-4 bg-blue-500 text-dark text-sm font-medium rounded-lg hover:bg-brand-700 focus:ring-2 focus:ring-brand-500/40 transition-colors disabled:opacity-60 disabled:cursor-not-allowed cursor-pointer"
        >
          Novo Cliente
        </button>
      </FormEditOrCreate>
    </div>
  );
}

export default ClientCreate;
