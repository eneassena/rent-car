import { createContext, useContext } from 'react';
import type { ClienteApiResponse, ClienteDetailsApiResponse } from '@/features/clients/services/client.service';
import { Client } from '@/features/clients/types/client';
import rentalsService from '../features/rentals/services/rentalsService';
import { clientesService } from '@/features/clients/services/client.service';
import { vehiclesServices } from '../features/vehicles/services/vehicles.service';
import { CreateVehicleDTO, Vehicle } from '@/features/vehicles/types/vehicles';


const DataContext = createContext<DataContextType | {}>({});


type DataType = {
    listClient: (params: { page: number; limit: number }) => Promise<ClienteApiResponse>
    detailClient: (id: string) => Promise<ClienteDetailsApiResponse>
    deleteClient: (id: string) => Promise<void>
    createClient: (client: Client) => Promise<Client>
    updateClient: (client: Client) => Promise<ClienteDetailsApiResponse>

    deleteRental: (id: string) => Promise<void>

    listVehicle: () => Promise<Vehicle[]>
    detailVehicle: (id: number) => Promise<Vehicle | undefined>
    createVehicle: (vehicle: CreateVehicleDTO) => Promise<Vehicle>
    updateVehicle: (vehicle: Vehicle) => Promise<Vehicle>
    deleteVehicle: (id: number) => Promise<void>
};

interface DataContextType {
    data: DataType;
}

const data: DataType = {
    listClient: async (params: { page: number; limit: number }) => {
        return await clientesService.getAll(params);
    },
    detailClient: async (id: string) => {
        return await clientesService.getById(id);
    },
    deleteClient: async (id: string) => {
        return await clientesService.delete(id);
    },
    createClient: async (client: Client) => {
        return await clientesService.create(client);
    },
    updateClient: async (client: Client) => {
        return await clientesService.update(client.id, client);
    },

    deleteRental: async (id: string) => {
        try {
            await rentalsService.deleteRental(String(id));
        } catch (error) {
            console.error("Erro ao excluir locação:", error);
            throw error;
        }
    },

    // Vehicle-related operations
    createVehicle: async (vehicle: CreateVehicleDTO) => {
        return await vehiclesServices.create(vehicle);
    },
    listVehicle: async () => {
        return await vehiclesServices.list();
    },
    detailVehicle: async (id: number) => {
        return await vehiclesServices.getById(id);
    },
    updateVehicle: async (vehicle: Vehicle) => {
        return await vehiclesServices.update(vehicle.id, vehicle);
    },
    deleteVehicle: async (id: number) => {
        try {
            await vehiclesServices.delete(id);
        } catch (error) {
            console.error("Erro ao excluir veículo:", error);
            throw error;
        }
    },
};



export const DataProvider = ({ children }: { children: React.ReactNode }) => {

    return (
        <DataContext.Provider value={{ data }}>
            {children}
        </DataContext.Provider>
    );
};

export const useData = () => useContext(DataContext);
