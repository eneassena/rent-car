
type Rental = {
    id: string;
    veiculoId: string;
    veiculo: string;
    clienteId: string;
    cliente: string;
    data_inicio: string;
    data_fim: string;
    diarias: number;
    valor: number;
    valor_diaria: number;
    status: string;
    paymentStatus: string;
    image: string;
};
 
export default Rental;