import type Rental from '../types/types';

import rentalsData from '@/data/mocks/rentals.json';

let rentals: Rental[] = rentalsData as Rental[];

const rentalsService = {
    async createRental(rentalData: any): Promise<Rental> {
        const id = rentals.length > 0 ? String(Number(rentals[rentals.length - 1].id) + 1) : '1';
        const newRental: Rental = {
            id: id,
            ...rentalData
        };
        rentals.push(newRental);
        return newRental;
    },
    async getRentals(): Promise<Rental[]> {
        return Promise.resolve(rentals);
    },
    async getRentalById(id: string): Promise<Rental | undefined>  {
        return rentals.find(rental => rental.id === id);
    },
    async updateRental(id: string, rentalData: any): Promise<Rental | null> {
        const index = rentals.findIndex(rental => rental.id === id);
        if (index !== -1) {
            rentals[index] = { ...rentals[index], ...rentalData };
            return rentals[index];
        }
        return null;
    },
    async deleteRental(id: string): Promise<Rental | null> {
        const index = rentals.findIndex(rental => rental.id === id);
        if (index !== -1) {
            const deletedRental = rentals[index];
            rentals.splice(index, 1);
            return deletedRental;
        }
        return null;
    }
};

export default rentalsService;
