import { createContext, useContext } from 'react';


const DataContext = createContext<DataContextType | {}>({});


type DataType = {
    id: number
    name:string
};

interface DataContextType {
    data: DataType;
}

const data: DataType = {
    id: 1,
    name: 'Sample Data'   
};
export const DataProvider = ({ children }: { children: React.ReactNode }) => {

    return (
        <DataContext.Provider value={{ data  }}>
            {children}
        </DataContext.Provider>
    );
};

export const useData = () => useContext(DataContext);
