
import { Eye, Pencil, Trash2 } from "lucide-react";

interface TableActionsProps {
  onView?: () => void;
  onEdit?: () => void;
  onDelete?: () => void;
}

function TableActions({
  onView,
  onEdit,
  onDelete,
}: TableActionsProps) {
  const buttonClass =
    "rounded-lg p-2 transition-colors focus:outline-none focus:ring-2 focus:ring-offset-1";

  return (
    <div className="flex items-center justify-end gap-1">
      {onView && (
        <button
          type="button"
          title="Visualizar"
          aria-label="Visualizar registro"
          onClick={onView}
          className={`${buttonClass} text-slate-500 hover:bg-blue-50 hover:text-blue-600 focus:ring-blue-500`}
        >
          <Eye size={17} />
        </button>
      )}

      {onEdit && (
        <button
          type="button"
          title="Editar"
          aria-label="Editar registro"
          onClick={onEdit}
          className={`${buttonClass} text-slate-500 hover:bg-amber-50 hover:text-amber-600 focus:ring-amber-500`}
        >
          <Pencil size={17} />
        </button>
      )}

      {onDelete && (
        <button
          type="button"
          title="Excluir"
          aria-label="Excluir registro"
          onClick={onDelete}
          className={`${buttonClass} text-slate-500 hover:bg-red-50 hover:text-red-600 focus:ring-red-500`}
        >
          <Trash2 size={17} />
        </button>
      )}
    </div>
  );
}

export default TableActions;
