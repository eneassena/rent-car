import { ArrowLeft, Pencil } from "lucide-react";

type HeaderPageType = {
    handleBack?: () => void;
    textVoltar: string;
    handleEdit?: () => void;
    textEditar?: string;
    textDetalhes: string;
    textPreencha?: string;
};

const HeaderPage = ({ handleBack, handleEdit, textVoltar, textDetalhes, textPreencha, textEditar }: HeaderPageType) => {
    return (
        <>
            <div>
                {handleBack && (
                    <button
                        type="button"
                        onClick={handleBack}
                        className="mb-3 flex items-center gap-2 text-sm text-slate-500 transition hover:text-slate-800"
                    >
                        <ArrowLeft size={17} />
                        {textVoltar}
                    </button>
                )}

                {!handleBack && textVoltar && (
                    <p className="mb-3 text-sm text-slate-500">
                        {textVoltar}
                    </p>
                )}

                <h1 className="text-2xl font-semibold text-slate-800">
                    {textDetalhes}
                </h1>

                {textPreencha && (
                    <p className="mt-1 text-sm text-slate-500">
                        {textPreencha}
                    </p>
                )}
            </div>

            {handleEdit && (
                <button
                    type="button"
                    onClick={handleEdit}
                    className="flex items-center justify-center gap-2 rounded-lg bg-blue-600 px-4 py-2.5 text-sm font-medium text-white transition hover:bg-blue-700"
                >
                    <Pencil size={17} />
                    {textEditar}
                </button>
            )}
        </>
    );
}

export default HeaderPage;