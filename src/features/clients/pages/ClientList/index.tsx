import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Plus } from "lucide-react";

import DataTable, {
  type Column,
} from "@/shared/components/DataTable";
import SearchInput from "@/shared/components/SearchInput";
import TablePagination from "@/shared/components/TablePagination";
import type { Client } from "@/features/clients/types/client";
import HeaderClient from "@/features/clients/components/HeaderClient";
import { ConfirmModal } from "@/shared/components/ConfirmModal";
import { clientesService, Pagination } from '@/features/clients/services/client.service';

const ClientList = () => {
  const navigate = useNavigate();
  const [clients, setClients] = useState<Client[]>([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState<string | null>(null);
  const [refresh, setRefresh] = useState(0);
  const [isConfirmModalOpen, setIsConfirmModalOpen] = useState(false);
  const [clientToDelete, setClientToDelete] = useState<Client | null>(null);
  const [pagination, setPagination] = useState<Pagination>({
    page: 1,
    limit: 10,
    total: 0,
    pages: 0,
  });

  function handleNewClient() {
    navigate("/clientes/novo");
  }

  useEffect(() => {
    let active = true;
    clientesService.list({ page: pagination.page, limit: pagination.limit, search })
      .then((response) => {
        if (!active) return;
        setClients(response.items);
        setPagination(response.pagination);
        setLoadError(null);
      })
      .catch((error) => {
        console.error("Erro ao carregar clientes:", error);
        if (active) setLoadError("Não foi possível carregar os clientes.");
      })
      .finally(() => { if (active) setLoading(false); });
    return () => { active = false; };
  }, [pagination.page, pagination.limit, search, refresh]);

  // 2. Definir as colunas
  const columns: Column<Client>[] = [
    {
      accessor: "nome",
      header: "Nome",
    },
    {
      accessor: "email",
      header: "E-mail",
    },
    {
      accessor: "telefone",
      header: "Telefone",
    },
    {
      accessor: "cpf",
      header: "CPF",
    },
    {
      accessor: "endereco",
      header: "Endereço",
    },
  ];

  // 5. Ação: visualizar
  function handleView(client: Client) {
    navigate(`/clientes/${client.id}`);
  }

  // 6. Ação: editar
  function handleEdit(client: Client) {
    navigate(`/clientes/${client.id}/editar`);
  }

  // 7. Ação: excluir
  async function handleDelete(id: number) {
    if (!clientToDelete) return;

    try {
      await clientesService.delete(id);
      if (pagination.page !== 1) setPagination((current) => ({ ...current, page: 1 }));
      else setRefresh((current) => current + 1);
    } catch (error) {
      console.error("Erro ao excluir cliente:", error);
      alert("Não foi possível excluir o cliente.");
    }
  }

  if (loading) {
    return <p className="p-6 text-slate-500">Carregando clientes...</p>;
  }

  return (
    <div className="space-y-6">
      {loadError && <p className="text-red-500" role="alert">{loadError}</p>}
      {/* Cabeçalho */}
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
        <HeaderClient
          textVoltar="Gerencie os clientes cadastrados no sistema."
          textDetalhes="Clientes"
        />

        <button
          type="button"
          onClick={handleNewClient}
          className="inline-flex items-center justify-center gap-2 rounded-lg bg-slate-900 px-4 py-2.5 text-sm font-medium text-white transition hover:bg-slate-700"
        >
          <Plus size={18} />
          Novo cliente
        </button>
      </div>

      {/* Pesquisa */}
      <div className="max-w-md">
        <SearchInput
          value={search}
          onChange={(value) => {
            setSearch(value);
            setPagination((current) => ({ ...current, page: 1 }));
          }}
          placeholder="Buscar por nome, e-mail ou CPF..."
        />
      </div>

      <ConfirmModal
        isOpen={isConfirmModalOpen}
        title="Confirmar exclusão"
        message={`Deseja realmente excluir o cliente ${clientToDelete?.nome}?`}
        confirmText="Excluir"
        cancelText="Cancelar"
        onConfirm={() => {
          if (!clientToDelete) return;
          handleDelete(clientToDelete.id);
          setIsConfirmModalOpen(false);
          setClientToDelete(null);
        }}
        onCancel={() => {
          setIsConfirmModalOpen(false);
          setClientToDelete(null);
        }}
      />

      {/* Tabela */}
      <DataTable
        columns={columns}
        data={clients}
        getRowId={(client) => client.id}
        onView={handleView}
        onEdit={handleEdit}
        onDelete={(client) => {
          setClientToDelete(client);
          setIsConfirmModalOpen(true);
        }}
      />

      {/* Paginação */}
      <TablePagination
        currentPage={pagination.page}
        totalPages={pagination.pages}
        totalItems={pagination.total}
        pageSize={pagination.limit}
        onPageChange={(page) => setPagination((current) => ({ ...current, page }))}
      />
    </div>
  );
}

export default ClientList;
