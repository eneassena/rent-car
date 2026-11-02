
import { resolve } from 'node:path'
import { criarMock } from './src/index.js'

const api = criarMock({
  porta: 3001,
  atrasoMs: 300,

  // Cada chave se transforma em um recurso da API.
  recursos: {
    clientes: {
      campos: {
        name: { tipo: 'string' },
        email: { tipo: 'string' },
        phone: { tipo: 'string', obrigatorio: false },
        cpf: { tipo: 'string' },
        status: { tipo: 'string', obrigatorio: false },
      },
    },
    veiculos: {
      campos: {
        modelo: { tipo: 'string' },
        marca: { tipo: 'string' },
        ano: { tipo: 'number' },
        placa: { tipo: 'string' },
      },
    },
    locacoes: {
      campos: {
        clienteId: { tipo: 'number' },
        veiculoId: { tipo: 'number' },
        dataInicio: { tipo: 'string' },
        dataFim: { tipo: 'string' },
      },
    }
  },

  // Cada projeto pode manter seu próprio banco JSON.
  arquivo: resolve('dados/db.json'),
  seed: resolve('dados/seed.json'),
})

api.iniciar()
