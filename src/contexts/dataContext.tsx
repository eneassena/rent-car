import { createContext, useContext } from 'react';

interface DataContextType {
    data: DataType;
}
const DataContext = createContext<DataContextType | {}>({} as DataContextType);

type DataType = {
    nomeEmpresa: string;
};

interface DataContextType {
    data: DataType;
}

const data: DataType = {
    nomeEmpresa: "Rent Car Empresa",
};

export const DataProvider = ({ children }: { children: React.ReactNode }) => {

    return (
        <DataContext.Provider value={{ data }}>
            {children}
        </DataContext.Provider>
    );
};

export const useData = () => useContext(DataContext);
