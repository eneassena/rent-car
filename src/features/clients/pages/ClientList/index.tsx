
import { useEffect, useMemo, useState } from "react";
import { useData } from "../../../../contexts/dataContext";
import { useNavigate } from "react-router-dom";
import { Plus } from "lucide-react";

import DataTable, {
  type Column,
} from "../../../../shared/components/DataTable";

import StatusBadge from "../../../../shared/components/StatusBadge";
import SearchInput from "../../../../shared/components/SearchInput";
import TablePagination from "../../../../shared/components/TablePagination";

import type { Client } from "../../types/client";
import { HeaderClient } from "../ClientCreate";
import { ConfirmModal } from "@/shared/components/ConfirmModal";

const ClientList = () => {
  const navigate = useNavigate();
  const context = useData();
  const data = 'data' in context ? context.data : undefined;

  const [clients, setClients] = useState<Client[]>([]);
  const [search, setSearch] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [isConfirmModalOpen, setIsConfirmModalOpen] = useState(false);
  const [clientToDelete, setClientToDelete] = useState<Client | null>(null);
  const pageSize = 10;
  const [totalPages, setTotalPages] = useState(1);
  const [totalItems, setTotalItems] = useState(0);



  useEffect(() => {
    async function loadClients() {
      try {
        if (data) {
          setLoading(true);

          const response = await data.listClient({
            page: currentPage,
            limit: pageSize,
          });
          setClients(response.data.items);
          setTotalPages(response.data.pagination.pages);
          setTotalItems(response.data.pagination.total);
          setLoading(false);
        }


      } catch (error) {
        console.error("Erro ao carregar clientes:", error);
      } finally {
        setLoading(false);
      }
    }

    loadClients();
  }, [currentPage, pageSize]);

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
      accessor: "status",
      header: "Status",
      render: (client) => (
        <StatusBadge
          label={
            client.status === "ACTIVE" ? "Ativo" : "Inativo"
          }
          variant={
            client.status === "ACTIVE" ? "success" : "neutral"
          }
        />
      ),
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
  async function handleDelete(client: Client) {
    if (!clientToDelete) return;

    try {
      if (!data) return;
      await data.deleteClient(client.id);

      // Atualiza o estado após a exclusão
      setClients((current) =>
        current.filter((item) => item.id !== client.id)
      );

      setCurrentPage(1);
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
      {/* Cabeçalho */}
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
        <HeaderClient
          textVoltar="Gerencie os clientes cadastrados no sistema."
          textDetalhes="Clientes"
        />

        <button
          type="button"
          onClick={() => navigate("/clientes/novo")}
          className="inline-flex items-center justify-center gap-2 rounded-lg bg-slate-900 px-4 py-2.5 text-sm font-medium text-white transition hover:bg-slate-700"
        >
          <Plus size={18} />
          Novo cliente {clients.length}
        </button>
      </div>

      {/* Pesquisa */}
      <div className="max-w-md">
        <SearchInput
          value={search}
          onChange={(value) => {
            setSearch(value);
            setCurrentPage(1);
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
          handleDelete(clientToDelete);
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
        currentPage={currentPage}
        totalPages={totalPages}
        totalItems={totalItems}
        pageSize={pageSize}
        onPageChange={setCurrentPage}
      />
    </div>
  );
}

export default ClientList;
