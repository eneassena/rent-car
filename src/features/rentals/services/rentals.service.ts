import type Rental from '../types/types';

import api from '@/services/api.service';
import { CreateRentalDTO, UpdateRentalDTO } from '../types/types';
import { PaginatedResponse } from '@/types/globals';
import { AxiosResponse } from 'axios';

export interface RentalParams {
    page: number;
    limit: number;
  }

const rentalsService = {
    async create(rentalData: CreateRentalDTO): Promise<Rental> {
        const formData = new FormData();
        formData.append('veiculo_id', rentalData.veiculo_id?.toString());
        formData.append('cliente_id', rentalData.cliente_id?.toString() ?? '');
        formData.append('modalidade', rentalData.modalidade);
        formData.append('data_retirada', rentalData.data_retirada);
        formData.append('data_devolucao', rentalData.data_devolucao);
        formData.append('valor_diaria', rentalData.valor_diaria.toString());
        formData.append('valor_fechado', rentalData.valor_fechado.toString());
        formData.append('valor_total', rentalData.valor_total.toString());
        formData.append('observacoes', rentalData.observacoes);
        
        if (rentalData.imagem instanceof File) {
            formData.append('imagem', rentalData.imagem);
        }
        console.log('FormData for create:', formData);
    
        const response = await api.post('/locacoes', formData);
        console.log('Response from create:', response.data);
        return response.data.data;
    },
    async list(params: RentalParams): Promise<PaginatedResponse<Rental>> {
        const response = await api.get('/locacoes', { params });
        return response.data.data;
    },
    async byId(id: number): Promise<Rental>  {
        const response = await api.get(`/locacoes/${id}`);
        return response.data.data;
    },
    getData(response: AxiosResponse<any, any, {}, any>){
        return response.data.data;
    },
    async update(id: number, rentalData: UpdateRentalDTO): Promise<Rental | null> {
         const formData = new FormData();
        formData.append('veiculo_id', rentalData.veiculo_id?.toString());
        formData.append('cliente_id', rentalData.cliente_id?.toString() ?? '');
        formData.append('modalidade', rentalData.modalidade);
        formData.append('data_retirada', rentalData.data_retirada);
        formData.append('data_devolucao', rentalData.data_devolucao);
        formData.append('valor_diaria', rentalData.valor_diaria.toString());
        formData.append('valor_fechado', rentalData.valor_fechado.toString());
        formData.append('valor_total', rentalData.valor_total.toString());
        formData.append('observacoes', rentalData.observacoes);
        
        console.log('FormData for update:', formData);
        const response = await api.put(`/locacoes/${id}`, formData);
        console.log('Updating rental with ID:', id, 'with data:', rentalData);
        return response.data.data;
    },
    async delete(id: number): Promise<Rental | null> {
        const response = await api.delete(`/locacoes/${id}`);
        return response.data.data;
    }
};

export default rentalsService;
