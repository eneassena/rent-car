import {create} from 'zustand';

interface Store {
    nome: string;
}

function logar(nome: string) {
    console.log(`Logging in as ${nome}`);
}

const set = () => {
    logar('Setting initial store state')
    
    return {
        nome: 'Eneas'
    }
}

const set2 = () => {
    logar('Setting initial store state')
    
    return {
        nome: 'Eneas Sena'
    }
}

const useStore = create<Store>(set2);

export default useStore;