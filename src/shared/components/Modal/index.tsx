import {
  Trash2,
  TriangleAlert,
  X,
} from "lucide-react";

interface DeleteModalProps {
  open: boolean;
  onConfirm: () => void;
  onCancel: () => void;
  loading?: boolean;
}

export function DeleteModal({
  open,
  onConfirm,
  onCancel,
  loading = false,
}: DeleteModalProps) {
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center
      justify-center bg-black/50 p-4">

      <div className="w-full max-w-md rounded-xl
        bg-white p-6 shadow-xl">

        <div className="flex items-center gap-3 mb-4">
          <div className="rounded-full bg-red-100 p-3">
            <TriangleAlert className="h-6 w-6 text-red-600" />
          </div>

          <h2 className="text-lg font-semibold">
            Excluir registro?
          </h2>
        </div>

        <p className="text-sm text-gray-500 mb-6">
          Tem certeza de que deseja excluir este registro?
          Essa ação não poderá ser desfeita.
        </p>

        <div className="flex justify-end gap-3">
          <button
            onClick={onCancel}
            disabled={loading}
            className="rounded-lg border px-4 py-2"
          >
            <X className="inline h-4 w-4 mr-2" />
            Cancelar
          </button>

          <button
            onClick={onConfirm}
            disabled={loading}
            className="rounded-lg bg-red-600 px-4 py-2
              text-white hover:bg-red-700
              disabled:opacity-50"
          >
            <Trash2 className="inline h-4 w-4 mr-2" />
            {loading ? "Excluindo..." : "Excluir"}
          </button>
        </div>

      </div>
    </div>
  );
}