import { type SubmitEvent } from 'react';


interface NovoClienteFormType {
    children?: React.ReactNode;
    handleSubmit: (e: SubmitEvent<HTMLFormElement>) => Promise<void>;
}

export const FormEditOrCreate = ({ children, handleSubmit }: NovoClienteFormType) => {
    return (
        <form onSubmit={handleSubmit} className="space-y-5">
            {children}
        </form>
    );
};

export default FormEditOrCreate;