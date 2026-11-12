
import TableActions from "../TableActions";

export interface Column<T> {
  accessor: keyof T | string;
  header: string;
  render?: (row: T) => React.ReactNode;
  align?: "left" | "center" | "right";
}

interface DataTableProps<T> {
  columns: Column<T>[];
  data: T[];
  getRowId: (row: T) => string | number;
  onView?: (row: T) => void;
  onEdit?: (row: T) => void;
  onDelete?: (row: T) => void;
}

function DataTable<T>({
  columns,
  data,
  getRowId,
  onView,
  onEdit,
  onDelete,
}: DataTableProps<T>) {
  const hasActions = Boolean(onView || onEdit || onDelete);

  return (
    <div className="w-full overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
      <div className="w-full overflow-x-auto">
        <table className="w-full min-w-[700px] border-collapse text-left">
          <thead className="border-b border-slate-200 bg-slate-50">
            <tr>
              {columns.map((column) => (
                <th
                  key={String(column.accessor)}
                  className={`
                    px-6 py-4 text-xs font-semibold uppercase
                    tracking-wider text-slate-500
                    ${column.align === "center" ? "text-center" : ""}
                    ${column.align === "right" ? "text-right" : ""}
                  `}
                >
                  {column.header}
                </th>
              ))}

              {hasActions && (
                <th className="px-6 py-4 text-right text-xs font-semibold uppercase tracking-wider text-slate-500">
                  Ações
                </th>
              )}
            </tr>
          </thead>

          <tbody className="divide-y divide-slate-100">
            {data.length > 0 ? (
              data.map((row) => (
                <tr
                  key={getRowId(row)}
                  className="transition-colors hover:bg-slate-50"
                >
                  {columns.map((column) => (
                    <td
                      key={String(column.accessor)}
                      className={`
                        px-6 py-4 text-sm text-slate-600
                        ${column.align === "center" ? "text-center" : ""}
                        ${column.align === "right" ? "text-right" : ""}
                      `}
                    >
                      {column.render
                        ? column.render(row)
                        : String(
                          (row as Record<string, unknown>)[
                          String(column.accessor)
                          ] ?? "-"
                        )}
                    </td>
                  ))}

                  {hasActions && (
                    <td className="px-6 py-4">
                      <TableActions
                        onView={onView ? () => onView(row) : undefined}
                        onEdit={onEdit ? () => onEdit(row) : undefined}
                        onDelete={onDelete ? () => onDelete(row) : undefined}
                      />
                    </td>
                  )}
                </tr>
              ))
            ) : (
              <tr>
                <td
                  colSpan={columns.length + (hasActions ? 1 : 0)}
                  className="px-6 py-12 text-center text-sm text-slate-500"
                >
                  Nenhum registro encontrado.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default DataTable;
