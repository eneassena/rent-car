import { ArrowLeft } from "lucide-react";

export type HeaderClientType = {
    handleBack?: () => void;
    textVoltar: string;
    textDetalhes: string;
    textPreencha?: string;
};
export const HeaderClient = ({ handleBack, textVoltar, textDetalhes, textPreencha }: HeaderClientType) => {
    return (
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
    );
}

export default HeaderClient;