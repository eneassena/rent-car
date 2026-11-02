
import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Plus } from "lucide-react";

import DataTable, {
  type Column,
} from "../../../../shared/components/DataTable";

import TableActions from "../../../../shared/components/TableActions";
import StatusBadge from "../../../../shared/components/StatusBadge";
import SearchInput from "../../../../shared/components/SearchInput";
import TablePagination from "../../../../shared/components/TablePagination";

import { clientService } from "../../services/clientService";
import type { Client } from "../../types/client";

const ClientList = () => {
  const navigate = useNavigate();

  const [clients, setClients] = useState<Client[]>([]);
  const [search, setSearch] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [loading, setLoading] = useState(true);

  const pageSize = 10;

  // 1. Buscar clientes
  useEffect(() => {
    async function loadClients() {
      try {
        const result = await clientService.getAll();
        setClients(result);
      } catch (error) {
        console.error("Erro ao carregar clientes:", error);
      } finally {
        setLoading(false);
      }
    }

    loadClients();
  }, []);

  // 2. Definir as colunas
  const columns: Column<Client>[] = [
    {
      accessor: "name",
      header: "Nome",
    },
    {
      accessor: "email",
      header: "E-mail",
    },
    {
      accessor: "phone",
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

  // 3. Filtrar clientes
  const filteredClients = useMemo(() => {
    const term = search.toLowerCase().trim();

    return clients.filter((client) =>
      [
        client.name,
        client.email,
        client.phone,
        client.cpf,
      ].some((value) => value.toLowerCase().includes(term))
    );
  }, [clients, search]);

  // 4. Paginação
  const totalPages = Math.max(
    1,
    Math.ceil(filteredClients.length / pageSize)
  );

  const paginatedClients = filteredClients.slice(
    (currentPage - 1) * pageSize,
    currentPage * pageSize
  );

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
    const confirmed = window.confirm(
      `Deseja realmente excluir o cliente ${client.name}?`
    );

    if (!confirmed) return;

    try {
      await clientService.delete(client.id);

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
        <div>
          <h1 className="text-2xl font-semibold text-slate-800">
            Clientes
          </h1>
          <p className="mt-1 text-sm text-slate-500">
            Gerencie os clientes cadastrados no sistema.
          </p>
        </div>

        <button
          type="button"
          onClick={() => navigate("/clientes/novo")}
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
            setCurrentPage(1);
          }}
          placeholder="Buscar por nome, e-mail ou CPF..."
        />
      </div>

      {/* Tabela */}
      <DataTable
        columns={columns}
        data={paginatedClients}
        getRowId={(client) => client.id}
        onView={handleView}
        onEdit={handleEdit}
        onDelete={handleDelete}
      />

      {/* Paginação */}
      <TablePagination
        currentPage={currentPage}
        totalPages={totalPages}
        totalItems={filteredClients.length}
        pageSize={pageSize}
        onPageChange={setCurrentPage}
      />
    </div>
  );
}

export default ClientList;
