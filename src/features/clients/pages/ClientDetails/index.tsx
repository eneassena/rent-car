
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Pencil, UserRound, Mail, Phone, CreditCard } from "lucide-react";
import { useData } from "@/contexts/dataContext";

import type { Client } from "../../types/client";
import StatusBadge from "../../../../shared/components/StatusBadge";
import { HeaderClient } from "../ClientCreate";

function ClientDetails() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const context = useData();
  const data = 'data' in context ? context.data : undefined;

  const [client, setClient] = useState<Client | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // let active = true;

    async function loadClient() {
      try {
        if (!id) {
          setClient(null);
          return;
        }

        if (data) {
          const clientDataFromContext = await data.detailClient(id);
          if (clientDataFromContext) {
            if (clientDataFromContext.success) {
              setClient(clientDataFromContext.data);
            }
            return;
          }

        }
        // const clientData = await clientService.getById(id);

        // if (active) {
        //   setClient(clientData ?? null);
        // }
      } catch (error) {
        console.error("Erro ao buscar cliente:", error);

        setClient(null);
      } finally {
        setLoading(false);
      }
    }

    setLoading(true);
    loadClient();

    return () => {
      // active = false;
    };
  }, []);

  const handleEdit = () => {
    if (client) {
      navigate(`/clientes/${client.id}/editar`);
    }
  };

  const handleBack = () => {
    navigate("/clientes");
  };

  if (loading) {
    return (
      <div className="flex min-h-64 items-center justify-center">
        <p className="text-sm text-slate-500">Carregando dados do cliente...</p>
      </div>
    );
  }

  if (!client) {
    return (
      <div className="flex flex-col items-center justify-center rounded-xl border border-slate-200 bg-white px-6 py-16 shadow-sm">
        <UserRound size={40} className="mb-3 text-slate-300" />

        <h2 className="text-lg font-semibold text-slate-800">
          Cliente não encontrado
        </h2>

        <p className="mt-1 text-sm text-slate-500">
          Não foi possível localizar os dados deste cliente.
        </p>

        <button
          type="button"
          onClick={handleBack}
          className="mt-5 rounded-lg bg-slate-900 px-4 py-2 text-sm font-medium text-white transition hover:bg-slate-700"
        >
          Voltar para clientes
        </button>
      </div>
    );
  }

  const status = client.status === "ACTIVE"
    ? { label: "Ativo", variant: "success" as const }
    : { label: "Inativo", variant: "neutral" as const };

  return (
    <div className="space-y-6">
      {/* Cabeçalho */}
      <div className="flex flex-row gap-4 sm:flex-row sm:items-center sm:justify-between">
        <HeaderClient
          handleBack={handleBack}
          textVoltar="Voltar para clientes"
          textDetalhes="Detalhes do cliente"
          textPreencha="Visualize as informações cadastradas deste cliente."
        />

        <button
          type="button"
          onClick={handleEdit}
          className="flex items-center justify-center gap-2 rounded-lg bg-blue-600 px-4 py-2.5 text-sm font-medium text-white transition hover:bg-blue-700"
        >
          <Pencil size={16} />
          Editar cliente
        </button>
      </div>

      {/* Identificação */}
      <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
          <div className="flex h-14 w-14 items-center justify-center rounded-full bg-blue-50 text-blue-600">
            {/* <UserRound size={28} /> */}
            <img
              src={client.imagem_path ? client.imagem_path : "/images/clients/client-01.jpg"}
              alt={client.nome}
              className="h-15 w-15 rounded-full object-cover"
            />
            {/* <img
              src={client.image || "/images/placeholder.png"}
              alt={client.name}
              onError={(event) => {
                event.currentTarget.src = "/images/placeholder.png";
              }}
              className="h-full w-full object-cover"
            /> */}
          </div>

          <div className="flex-1">
            <h2 className="text-lg font-semibold text-slate-800">
              {client.nome}
            </h2>

            <p className="mt-1 text-sm text-slate-500">
              Cliente #{client.id}
            </p>
          </div>

          <StatusBadge label={status.label} variant={status.variant} />
        </div>
      </div>

      {/* Informações pessoais */}
      <div className="rounded-xl border border-slate-200 bg-white shadow-sm">
        <div className="border-b border-slate-100 px-6 py-4">
          <h3 className="font-semibold text-slate-800">
            Informações pessoais
          </h3>

          <p className="mt-1 text-sm text-slate-500">
            Dados de identificação e contato do cliente.
          </p>
        </div>

        <div className="grid grid-cols-1 gap-6 p-6 sm:grid-cols-2">
          <div className="flex items-start gap-3">
            <UserRound size={19} className="mt-0.5 text-slate-400" />

            <div>
              <p className="text-xs font-medium uppercase text-slate-400">
                Nome completo
              </p>
              <p className="mt-1 text-sm font-medium text-slate-700">
                {client.nome}
              </p>
            </div>
          </div>

          <div className="flex items-start gap-3">
            <CreditCard size={19} className="mt-0.5 text-slate-400" />

            <div>
              <p className="text-xs font-medium uppercase text-slate-400">
                CPF
              </p>
              <p className="mt-1 text-sm font-medium text-slate-700">
                {client.cpf}
              </p>
            </div>
          </div>

          <div className="flex items-start gap-3">
            <Mail size={19} className="mt-0.5 text-slate-400" />

            <div>
              <p className="text-xs font-medium uppercase text-slate-400">
                E-mail
              </p>
              <p className="mt-1 text-sm font-medium text-slate-700">
                {client.email}
              </p>
            </div>
          </div>

          <div className="flex items-start gap-3">
            <Phone size={19} className="mt-0.5 text-slate-400" />

            <div>
              <p className="text-xs font-medium uppercase text-slate-400">
                Telefone
              </p>
              <p className="mt-1 text-sm font-medium text-slate-700">
                {client.telefone}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ClientDetails;
