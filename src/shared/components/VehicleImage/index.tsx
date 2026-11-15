import { useState } from "react";
import { X, Maximize2 } from "lucide-react";
import { getImageUrl } from "@/shared/utils/imagemUrl";

interface VehicleImageProps {
    src?: string | null;
    alt?: string;
}

export const VehicleImage = ({
    src,
    alt = "Imagem do veículo",
}: VehicleImageProps) => {
    const [open, setOpen] = useState(false);

    const imageUrl = getImageUrl(src);

    if (!imageUrl) {
        return (
            <div className="flex h-40 items-center justify-center rounded-lg bg-slate-100 text-slate-400">
                Sem imagem disponível
            </div>
        );
    }

    return (
        <>
            <button
                type="button"
                onClick={() => setOpen(true)}
                className="group block h-full w-full overflow-hidden rounded-xl"
            >
                <img
                    src={imageUrl}
                    alt={alt}
                    className="h-full w-full object-contain transition-transform group-hover:scale-105"
                />

                <span className="absolute bottom-2 right-2 rounded-md bg-black/60 p-2 text-white opacity-0 transition group-hover:opacity-100">
                    <Maximize2 size={16} />
                </span>
            </button>

            {open && (
                <div
                    className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4"
                    onClick={() => setOpen(false)}
                >
                    <button
                        type="button"
                        onClick={() => setOpen(false)}
                        className="absolute right-5 top-5 rounded-full bg-white/10 p-2 text-white hover:bg-white/20"
                        aria-label="Fechar imagem"
                    >
                        <X size={24} />
                    </button>

                    <img
                        src={imageUrl}
                        alt={alt}
                        onClick={(e) => e.stopPropagation()}
                        className="max-h-[85vh] max-w-[90vw] rounded-lg object-contain"
                    />
                </div>
            )}
        </>
    );
}