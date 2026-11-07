import { type SubmitEvent } from 'react';


interface NovoClienteFormType {
    children?: React.ReactNode;
    handleSubmit: (e: SubmitEvent<HTMLFormElement>) => Promise<void>;
    error: string | null;
}

export const FormEditOrCreate = ({ children, handleSubmit, error }: NovoClienteFormType) => {
    return (
        <form onSubmit={handleSubmit} className="space-y-5">
            {children}
            {error && <p className="text-red-500 text-sm">{error}</p>}
        </form>
    );
};

export default FormEditOrCreate;