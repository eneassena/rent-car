import { useEffect, useState } from "react";

interface ImageUploadProps {
    value: File | null;
    onChange: (file: File | null) => void;
}

export default function ImageUpload({
    value,
    onChange,
}: ImageUploadProps) {
    const [preview, setPreview] = useState<string | null>(null);

    useEffect(() => {
        if (!value) {
            setPreview(null);
            return;
        }

        const url = URL.createObjectURL(value);
        setPreview(url);

        return () => URL.revokeObjectURL(url);
    }, [value]);

    return (
        <div className="space-y-2">
            <label className="block text-sm font-medium text-slate-700">
                Imagem do veículo
            </label>

            <div className="flex items-center gap-4">
                {preview ? (
                    <img
                        src={preview}
                        alt="Pré-visualização do veículo"
                        className="h-24 w-32 rounded-lg border object-cover"
                    />
                ) : (
                    <div className="flex h-24 w-32 items-center justify-center rounded-lg border border-dashed text-slate-400">
                        Sem imagem
                    </div>
                )}

                <div className="space-y-2">
                    <input
                        type="file"
                        accept="image/jpeg,image/png,image/webp"
                        onChange={(event) => {
                            const file = event.target.files?.[0] ?? null;
                            onChange(file);
                        }}
                        className="block w-full text-sm"
                    />

                    {value && (
                        <button
                            type="button"
                            onClick={() => onChange(null)}
                            className="text-sm text-red-600"
                        >
                            Remover imagem
                        </button>
                    )}

                    <p className="text-xs text-slate-500">
                        JPEG, PNG ou WebP. Máximo de 5 MB.
                    </p>
                </div>
            </div>
        </div>
    );
}
